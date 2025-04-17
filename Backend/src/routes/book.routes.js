import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addBook,
    getBooks,
    getBookById,
    featuredBooks,
} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = Router();

// Add a new book
router.route("/addBook").post(
    verifyJWT,
    verifyRole("admin"),
    upload.single("bookImage"),
    addBook
);

// Get all books (with optional filters, sorting, and pagination)
router.route("/getBooks").get(getBooks);

// Get a single book by ID
router.route("/getBook/:id").get(getBookById);

// Get top-rated featured books
router.route("/featuredBooks").get(featuredBooks);

export default router;
