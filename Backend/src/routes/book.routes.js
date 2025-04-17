import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
        addBook,
        getBooks,
        getBookById
} from "../controllers/book.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = Router();

router.route("/addBook").post(
      verifyJWT,
     verifyRole("admin"),
        upload.single("bookImage"),
        addBook,
);

router.route("/getBooks").get(
       getBooks,
);

router.route("/getBook/:id").get(
        getBookById,
);

export default router;
