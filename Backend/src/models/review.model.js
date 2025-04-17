import mongoose, { Schema } from "mongoose";


const reviewSchema = new Schema(
        {
                rating: {
                        type: Number,
                        required: true,
                },
                BookId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "Book",
                },

                description: {
                        type: String,
                        reuqired:true,
                },
                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        required: true,
                        ref: "User",
                },
        },
        { timestamps: true },
);

export const Review = mongoose.model("reviewSchema", reviewSchema);
