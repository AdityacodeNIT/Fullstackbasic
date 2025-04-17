import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  publishedDate: { type: Date },
  summary: { type: String },
  averageRating: { type: Number, default: 0 },
  reviews: [{ 
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String }
  }],
  bookImage: { type: String,required:true }, // URL to the book cover image
 
}, { timestamps: true });

export const Book = mongoose.model('Book', bookSchema);


