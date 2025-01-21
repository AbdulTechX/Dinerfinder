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

