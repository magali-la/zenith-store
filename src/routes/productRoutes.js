// require express and set up express router
const express = require("express");
const router = express.Router();

// import the Product schema for use
const Product = require("../models/Product.js")

// ROUTES - INDUCES
// INDEX - get products data
// get all products
router.get("/products", async (req, res) => {
    try {
        // pass empty object to retrieve all products without filters
        let products = await Product.find({}).exec();

        if (products.length === 0) {
            // if there are no products
            res.status(404).json({message: "No products found." })
        } else {
            // send success code
            res.status(200).json(products);
        }
    } catch (error) {
        // console for backend
        console.log("Error retrieving all products", error);
        // set status and error message
        res.status(500).json({ message: error.message });
    }
});

// get product by id
router.get("/products/:id", async (req, res) => {
    // store id from url for the product
    const productId = req.params.id;

    // use try catch for error handling
    try {
        // add .exec for detailed errors w lines from code
        const product = await Product.findById(productId).exec()
        
        if (product) {
            console.log("Product found for id: ", productId);

            // send a response with the product in a json object
            res.status(200).json(product);
        } else {
            console.log("Product not found with id: ", productId);
            res.status(404).json({ message: "No product found." });
        }
    } catch (error) {
        // console for backend server
        console.error("Error fetching product for id: ", productId);
        // error for server error
        res.status(500).json({ message: error.message });
    };
});

// CREATE - post a new product, set route and callback to check bookleans used in schema
router.post("/products", async (req, res) => {
    // create a book, req.body refers to whatever data is passed from the client/ui form
    Product.create(req.body)
        .then(createdProduct => {
            console.log("New product successfully created", createdProduct);
            // response w success code for post method
            res.status(201).json(createdProduct)
        })
        .catch(error => {
            console.error("Error adding product", error);
            // response with bad request code if product doesnt meet the requirements in the schema - send the detailed validation error from mongoose as a json object
            res.status(400).json({ message: error.message });
        })
});

module.exports = router;