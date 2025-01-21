const express = require("express"); // Imports the Express Library to use it web server features.
const app = express(); // Creates an instance of an Express app.
const PORT = process.env.PORT || 3000; // sets the server port, defaulting to 4000 if not provided in the environment variable.
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Middleware to check for Authorization header
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from 'Authorization' header
    if (!token) {
        return res.status(403).json({ message: 'Authorization header is required.' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Store user information
        next(); // Pass control to the next middleware
    });
};

// Use the middleware in your route
app.get('/api/profile', verifyToken, (req, res) => {
    // Handle fetching user profile here
});

const userRoutes = require('./src/routes/users').router;
const restaurantRoutes = require('./src/routes/restaurant')

// Enable all CORS requests
app.use(cors({
    allowedHeaders: ['Authorization', 'Content-Type'], // Ensure Authorization header is allowed
}));

// middleware
app.use(express.json()); // to parse json request bodies

// use the user routes for authentication
app.use('/api/users', userRoutes);

// restaurant
app.use('/api', restaurantRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to DineFinder API!'); //sets up a route handler for the root URL('/'), responding with "Dinner Finder API"
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
