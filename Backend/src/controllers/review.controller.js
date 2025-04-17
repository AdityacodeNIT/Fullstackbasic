import { ObjectId } from "mongodb"; // Ensure ObjectId is imported
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Function to add a review
const review = asyncHandler(async (req, res) => {
        const userId = req.user._id;
        const { rating, BookId, description } = req.body;
      
        if (!rating || !BookId || !description) {
          return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }
      
        const newReview = await Review.create({
          rating,
          BookId,
          description,
          userId,
        });
      
        return res.status(201).json(new ApiResponse(201, newReview, "Review submitted successfully"));
      });
      

const averageReview = asyncHandler(async (req, res) => {
        const { BookId } = req.body;
        // Convert productId to ObjectId
        const objectId = new ObjectId(BookId);
        // Aggregation to calculate the average rating for the product
        const result = await Review.aggregate([
                {
                        $match: { BookId: objectId },
                },
                {
                        $group: {
                                _id: "$productId",
                                averageRating: { $avg: "$rating" },
                                count: { $sum: 1 },
                        },
                },
        ]);
        // Return the average rating and the total count
        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        const count = result.length > 0 ? result[0].count : 0;
        return res.json({ averageRating, count });
});

const getReview = asyncHandler(async (req, res) => {
        const id = req.params.id;
      
        const reviews = await Review.find({ BookId: new ObjectId(id) }).populate(
          "userId",
          "fullName"
        );
      
        if (!reviews.length) {
          throw new ApiError(404, "No reviews found");
        }
      
        res.json(reviews);
      });



export { review, averageReview,getReview };
