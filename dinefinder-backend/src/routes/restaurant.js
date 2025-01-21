const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming you have a database configuration file

const { check, validationResult } = require('express-validator');


router.get('/restaurants',[
    check('location').optional().isString(),
    check('cuisine').optional().isString(),
    check('budget').optional().isNumeric(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { location, cuisine, budget } = req.query;

    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];

    if (location) {
        query += ' AND LOWER(location) LIKE ?';
        params.push(`%${location.toLowerCase()}%`);
    }

    if (cuisine) {
        const cuisineList = cuisine.split(',').map(c => c.trim().toLowerCase());
        query += ` AND LOWER(cuisine) IN (${cuisineList.map(() => '?').join(',')})`;
        params.push(...cuisineList);
    }

    if (budget) {
        query += ' AND budget <= ?';
        params.push(Number(budget));
    }

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching restaurants.' });
    }
});

module.exports = router;
