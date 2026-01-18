// require mongoose
const mongoose = require("mongoose");
// connect the database
mongoose.connect(process.env.MONGO_URI);

// DATABASE CONNECTION
// callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// export the db for use
module.exports = db;