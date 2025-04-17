import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Review } from "../models/review.model.js";
import fs from "fs";

// Add a new book
const addBook = asyncHandler(async (req, res) => {
    const { title, author, genre, publishedDate, summary, ...optionalFields } = req.body;

    // Validate required fields
    if (!title?.trim() || !author?.trim()) {
        throw new ApiError(400, "Title and Author are required.");
    }

    // Check if book already exists
    const existedBook = await Book.findOne({ title, author });
    if (existedBook) {
        throw new ApiError(409, "Book already exists.");
    }

    // Check for book cover image
    const bookImageLocalPath = req.file?.path;
    if (!bookImageLocalPath) {
        throw new ApiError(400, "Book cover image is required.");
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(bookImageLocalPath);
    if (!uploadedImage) {
        throw new ApiError(400, "Failed to upload book cover image.");
    }

    // Prepare book object
    const bookData = {
        title,
        author,
        genre,
        publishedDate,
        summary,
        bookImage: uploadedImage.url,
    };

    // Assign optional fields
    Object.keys(optionalFields).forEach((key) => {
        if (optionalFields[key] !== undefined) {
            bookData[key] = optionalFields[key];
        }
    });

    // Save book to database
    const book = await Book.create(bookData);

    return res.status(201).json(new ApiResponse(201, book, "Book added successfully."));
});

// Get all books (regular listings with filters, sorting, and pagination)
const getBooks = asyncHandler(async (req, res) => {
    const { search, genre, sort, page = 1, limit = 10 } = req.query;
    
    // Build query object
    let query = {};

    if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (genre) {
        query.genre = { $in: genre.split(",") }; // Filter by genre
    }

    // Sorting based on query params
    const sortOption = sort === "rating" ? { averageRating: -1 } : { createdAt: -1 }; // Default sorting by creation date

    // Pagination logic
    const skip = (page - 1) * limit;

    const books = await Book.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    if (!books.length) {
        throw new ApiError(404, "No books found.");
    }

    return res.status(200).json(new ApiResponse(200, books, "Books fetched successfully."));
});

// Get book by ID
const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(404, "Book not found.");
    }

    return res.json(book);
});


const featuredBooks = async (req, res) => {
    try {
      // Step 1: Aggregate the top-rated books based on reviews
      const topBooksRatings = await Review.aggregate([
        {
          $group: {
            _id: "$BookId", // Group by bookId
            averageRating: { $avg: "$rating" }, // Calculate average rating
          },
        },
        {
          $sort: { averageRating: -1 }, // Sort by average rating descending
        },
        {
          $limit: 5, // Limit to top 5 books
        },
      ]);
  
      // Step 2: Fetch the actual book details for those top-rated books
      const topBookIds = topBooksRatings.map((item) => item._id);
      const books = await Book.find({ _id: { $in: topBookIds } });
  
      return res.status(200).json(new ApiResponse(200, books, "Top-rated books fetched successfully."));
      
    } catch (err) {
      return res.status(500).json(new ApiResponse(500, null, "Error fetching featured books", err.message));
    }
  };
  
  
  



export {
    addBook,
    getBooks,
    featuredBooks,
    getBookById
};
