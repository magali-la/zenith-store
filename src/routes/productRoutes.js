// require express and set up express router
const express = require("express");
const router = express.Router();

// import the Product schema for use
const Product = require("../models/Product.js")

// ROUTES - INDUCES

// CREATE - post a new product, set route and callback to check bookleans used in schema
router.post("/post", async (req, res) => {
    // test - see what req.body is 
    console.log("req.body", req.body);
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