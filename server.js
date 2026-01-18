// DEPENDENCIES
// dotenv first
require("dotenv").config();

// express app instance
const express = require("express");
const app = express();

// DATABASE
// import db from connection
require("./src/config/connection.js");

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    // set note when successfully listening
    console.log(`Server is listening on port: ${PORT}`)
})