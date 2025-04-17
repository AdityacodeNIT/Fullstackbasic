import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config()

const app = express();

app.use(
        cors({
                origin: process.env.CORS_ORIGIN,
                credentials: true,
            
        }),
);

app.use(express.json({ limit: "2mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
import Reviewrouter from "./routes/review.routes.js";

app.use("/api/v1/users", userRouter);

app.use("/api/v1/book", bookRouter);
app.use("/api/v2/feedback", Reviewrouter);


export { app };
