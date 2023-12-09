const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Create express app
const app = express();
app.use(express.json());
app.use(cors());

// Database connection using environment variables from .env file
const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Export the pool for use in route modules
module.exports = pool;

// Test database connection
pool.connect()
    .then(() => console.log('Connected to database successfully'))
    .catch(err => console.error('Failed to connect to the database', err));

// Import and use route modules
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

// Default route
app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
