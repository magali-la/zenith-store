# Zenith Store Product API
#### A REST API for managing an e-commerce product inventory. Built with Node.js, Express, and MongoDB, using Mongoose for data modeling.

## Description
This API serves as the backend for Zenith's online store, handling all CRUD operations for products with advanced features such as filtering, sorting, and pagination. The API is designed with frontend developers in mind, sending detailed responses to make integration seamless.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Environment Management:** dotenv
- **Testing:** Postman

## How to Run
### Prerequisites
- Node.js
- MongoDB Atlas Account

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up a `.env` file in the root directory
    - add a `PORT` variable
    - add a `MONGO_URI` variable with your connection string. The database name is set to zenith
    `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/zenith`
4. Start the server with `npm start` or `npx nodemon`

## API Endpoints
### POST `/api/products`
- Create a new product
- Products tested must include these fields from the Product model in `Product.js`
    ```
    {
        "name": "Product Name",
        "description": "Product description",
        "price": 29.99,
        "category": "Electronics",
        "inStock": true,
        "tags": ["tag1", "tag2"]  
    }
    ```

### GET `/api/products`
- Get all products with optional filters
#### Optional Query Parameters
- **category**: Filter by category (`?category=Electronics`)
- **minPrice**: Set a minimum price (`?minPrice=30`)
- **maxPrice**: Set a maximum price (`?maxPrice=100`)
- **sortBy**: Sort orders in ascending(`price_asc`) or descending (`price_desc`) order by price (`?sortBy=price_asc`)
- **page**: Set a page number, defaulted to 1 (`?page=2`)
- **limit**: Set items per page, defaulted to 10 (`?limit=5`)

### GET `/api/products/:id`
- Get a single product by its Id

### PUT `/api/products/:id`
- Update a product
### DELETE `/api/products/:id`
- Delete a product 

## Development Process
This API was built incrementally with testing at each step
### Project Setup
Initialized Express server, configured MongoDB connection, set up project structure
### Data Modeling 
Created Product schema with validation rules using Mongoose
### CRUD Routes
Built each endpoint one at a time, testing with Postman
    - Created POST route to add test data
    - Built GET by ID to retrieve individual products
    - Built GET all to retrieve all products
    - Implemented Update and Delete routes
### Advanced Querying
Added optional parameters incrementally for GET route
    - Category filtering
    - Min and Max price filtering
    - Sorting by price (ascending and descending)
    - Pagination with skip and limit
### Testing
Thoroughly tested all endpoints with various query parameter combinations in Postman, including simulating errors to verify error responses

## Key API Design Decisions
### Response design
All responses use JSON objects with consistent structure, which makes it easier for frontend developers to extract data and handle errors predictably. This was the case especially when creating the DELETE route. The API returns the deleted product data to the client. This allows frontend applications to implement undo functionality or maintain a log in case of user error. Each response includes a status code whether successful or not.
### Error Handling
Each route uses try/catch blocks to handle errors. Mongoose validation errors are caught and returned with descriptive messages so clients know what went wrong. I used `.exec()` method in Mongoose to provide better stack traces and pinpoint the exact line in your code where an error occured, making debugging easier
### Optional Parameters
Optional paramaters for GET routes wer handled by creating two filter objects `filter` and `sortFilter` to correspond with Mongoose chaining methods `.find()` and `.sort()`. They are designed through conditionals, checking if these query parameters exist before adding them to both objects, otherwise passing empty objects to both methods to retrieve all products in the db.

## Learnings 
### Mongoose Comparison Operators
I used MongoDB comparison operators for flexible filtering for the price range query, such as `$gte` and `$lte`.
### Schema Validation
Learned how Mongoose schema validation prevents bad data from hitting the database and catching these errors with successful handling in all routes. Through testing with bad data or incorrect endpoints, this helped to understand the response sent to the client.
### Conditional Filter Building
The design with conditional filters helped to understand how a client might access data, by basing filters on query parameters.

## Resources
For list of queries built into mongoose
https://mongoosejs.com/docs/queries.html

For handling error with try catch vs then catch promise chains
https://www.geeksforgeeks.org/node-js/how-to-handle-errors-in-mongodb-operations-using-nodejs/

Understanding .exec() in async/await functions
https://medium.com/@asimabas96/the-power-of-exec-in-mongoose-unlocking-better-query-execution-73c494e8160f
https://mongoosejs.com/docs/promises.html

