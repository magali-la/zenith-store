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
        // set up filters for index - if they are undefined or not in the query params, they won't be included in the query
        const filter = {};

        // category - if it's in the request url, then set it in the object
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // min & max price
        if (req.query.minPrice) {
            // use mongoose comparison operator for >= / set the key for the filter as price as this is what the field is for each product in the database, set it to an object
            filter.price = { $gte: req.query.minPrice };
        }

        if (req.query.maxPrice) {
            // do a conditional to not overwrite if a min price was included already under the price query
            if (filter.price) {
                // add $lte key to this price object in addition to whats already in if minprice was added as a quer
                filter.price.$lte = req.query.maxPrice;
            } else {
                // otherwise just set the price object to <=
                filter.price = { $lte: req.query.maxPrice };
            }
        }

        // sort - create a new sortFilter empty object for the sort method chained to product
        const sortFilter = {}
        if (req.query.sortBy) {
            // conditional if value is price_asc
            if (req.query.sortBy === "price_asc") {
                // mongoose sort method takes the field and adds 1 for ascending
                sortFilter.price = 1;
            } else if (req.query.sortBy === "price_desc") {
                // -1 for descending
                sortFilter.price = -1;
            }
        }

        // pagination - break up results into pages with limit (how many docs on one page) and skip methods (which index to start with) - default is page 1 and show 10 - set it to the query param, and if there isn't one, fallback to default values
        const page = req.query.page || 1;
        const pageSize = req.query.limit || 10;

        // pass filter object with potential query parameters added 
        let products = await Product.find(filter).sort(sortFilter).skip((page - 1) * pageSize).limit(pageSize).exec();

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

// DELETE - delete a product by its id
router.delete("/products/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        // handle if the product hasn't been found by that id
        if (!deletedProduct) {
            console.log("Product not found.");
            res.status(404).json({ message: "No product found." });
        } else {
            console.log("Product successfully deleted", deletedProduct);
            // send the deleted post to the client, could be useful for undo functionality to store what was deleted
            res.status(200).json({ message: "Product successfully deleted", product: deletedProduct });
        }
    } catch (error) {
        console.error("Error deleting product, ", productId);
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - update an existing document by its id, return the modified document once it's done
router.put("/products/:id", async (req, res) => {
    const productId = req.params.id
    try {
        // takes 3 arguments, the id, the updated content in form of req.body, and the option to return the document after it's been updated
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true }).exec();

        // check if the id is even correct
        if (!updatedProduct){
            console.log("Product not found with id: ", productId);
            // not found error
            res.status(404).json({ message: "No product found" })
        } else {
            console.log("Post updated: ", updatedProduct);
            res.status(200).json(updatedProduct);
        }

    } catch (error) {
        console.error("Error updating the document with id, ", productId);

        // error status code network error
        res.status(500).json({ message: error.message });
    }
});

// CREATE - post a new product, set route and callback to check bookleans used in schema
router.post("/products", async (req, res) => {
    // create a book, req.body refers to whatever data is passed from the client/ui form
    try {
        const createdProduct = await Product.create(req.body);
        console.log("New product successfully created", createdProduct);
        // response w success code for post method
        res.status(201).json(createdProduct)
    } catch (error) {
        console.error("Error adding product", error);
        // response with bad request code if product doesnt meet the requirements in the schema - send the detailed validation error from mongoose as a json object
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;