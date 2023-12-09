const express = require('express');
const jwt = require('jsonwebtoken');
const { registerUser, getUserByEmail } = require('../config/db.js'); 

const router = express.Router();

// Route for user registration
router.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await registerUser(name, email, password);
        // You can add token generation here if you want to log the user in immediately after signup
        res.json(newUser);
    } catch (err) {
        res.status(500).send('Server error during registration');
    }
});

// Route for user login
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).send('Invalid Credentials');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid Credentials');
        }

        const token = jwt.sign({ id: user.id }, 'yourSecretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error during login');
    }
});

module.exports = router;
