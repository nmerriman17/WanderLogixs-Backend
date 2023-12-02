const express = require('express');
const router = express.Router();
const { searchDatabase } = require('./src/config/db.js'); 
const { authenticateToken } = require('../../middleware/auth');


router.get('/search', authenticateToken, async (req, res) => {
    try {
        const searchTerm = req.query.term;
        const results = await searchDatabase(searchTerm);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;