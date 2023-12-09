const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/loginsignupRoutes.js'); 
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { searchDatabase } = require('./src/config/db.js');
require('dotenv').config();


// Create express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(userRoutes);


const tripRoutes = require('./src/routes/tripRoutes.js');
const expenseRoutes = require('./src/routes/expenseRoutes.js');
const itineraryRoutes = require('./src/routes/itineraryRoutes.js');
const mediaRoutes = require('./src/routes/mediaRoutes.js');
const loginsignupRoutes = require('./src/routes/loginsignupRoutes');


app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/loginsignup', loginsignupRoutes);

// Database connection using environment variables from .env file
const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => console.error('Failed to connect to the database', err));

// Default route
app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

// Signup route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
        await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
        
        
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).send('Error signing up');
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Search API endpoint
app.get('/api/search', async (req, res) => {
    try {
        const searchTerm = req.query.term;
        if (!searchTerm || searchTerm.trim() === '') {
            return res.status(400).send('Invalid search term');
        }
        const results = await searchDatabase(searchTerm.trim());
        res.json(results);
    } catch (error) {
        res.status(500).send('Error processing search');
    }
});


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
