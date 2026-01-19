// DEPENDENCIES
// dotenv first
require("dotenv").config();

// express app instance
const express = require("express");
const app = express();

// import routes
const productRoutes = require("./src/routes/productRoutes.js")

// DATABASE
// import db from connection
require("./src/config/connection.js");

// MIDDLEWARE
// use express.json to parse any JSON requests
app.use(express.json());

// mount all routes with prefix /api
app.use("/api", productRoutes)

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    // set note when successfully listening
    console.log(`Server is listening on port: ${PORT}`)
})