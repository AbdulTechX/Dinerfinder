const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure key

// Helper function to generate JWT token
const generateToken = (user) => jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

// Register endpoint
router.post('/register',
    [
        body('username').isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
        body('email').isEmail().withMessage('Please enter a valid email address.'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if the user already exists in the database
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists.' });
            }

            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error.' });
                }
                res.status(201).json({ message: 'Registration successful!' });
            });
        });
    });
// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(user);
        res.json({ message: 'Login successful!', token });
    });
});


// Get user profile
router.get('/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is required.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received Token:', token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);

        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const user = results[0];
            res.json({ username: user.username, email: user.email, phone: user.phone || '' });
        });
    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is required.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Verify the token and get the user's ID from the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get the updated username and phone from the request body
        const { username, phone } = req.body;

        // Only proceed if there are changes to update
        if (!username && !phone) {
            return res.status(400).json({ message: 'No data to update.' });
        }

        // Build the SQL query and parameters for updating
        const updateQuery = 'UPDATE users SET username = ?, phone = ? WHERE id = ?';
        const params = [username, phone, decoded.id];

        // Execute the update query in the database
        db.query(updateQuery, params, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error.' });
            }
            // Check if the user was found and updated
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.json({ message: 'Profile updated successfully!' });
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = { router };
