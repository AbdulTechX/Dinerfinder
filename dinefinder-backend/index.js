const express = require("express"); // Imports the Express Library to use it web server features.
const app = express(); // Creates an instance of an Express app.
const PORT = process.env.PORT || 3000; // sets the server port, defaulting to 4000 if not provided in the environment variable.
const dotenv = require('dotenv');

// middleware
app.use(express.json()); // to parse json request bodies


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
