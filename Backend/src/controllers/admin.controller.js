import { Book } from "../models/book.model.js";
import { response } from "express";


export const productList = async (req, res) => {
        try {
                const products = await Book.aggregate([
                        {
                                $project: {
                                        name: 1,
                                        price: 1,
                                        Category: 1,
                                        stocks: 1,
                                },
                        },
                ]);
                res.status(200).json(products);
        } catch (error) {
                throw error;
        }
};


    export const getProducts = async (req, res) => {
        try {
            let filter = req.user.role === "seller" ? { seller: req.user._id } : {}; 
            const products = await Product.find(filter);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: "Error fetching products" });
        }
    };

