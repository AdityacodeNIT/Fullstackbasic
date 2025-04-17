import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

// Get all books
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find().sort({ createdAt: -1 });

    if (!books.length) {
        throw new ApiError(404, "No books found.");
    } else {
        res.json(books);
    }
});

const getBookById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const book=await Book.findById(id);
    if (!book) {
        throw new ApiError(404, "Book not found.");
    }
    else{
        res.json(book);
    }
});


const featuredBooks = asyncHandler(async (req, res) => {
    const books = await Book.find()
        .sort({ averageRating: -1 })
        .limit(5);

    return res.status(200).json(new ApiResponse(200, books, "Featured books fetched successfully."));
});

export {
    addBook,
    
    getBooks,
  
    featuredBooks,
    getBookById
};
