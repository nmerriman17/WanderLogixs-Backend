const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const searchDatabase = async (term) => {
    try {
        const query = `
            SELECT 'trips' as source, trip_id as id, destination, start_date, end_date
            FROM trips
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'expenses', expense_id, category, date, amount
            FROM expenses
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'itinerary', event_id, event_name, location, start_datetime
            FROM itinerary
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            UNION ALL
            SELECT 'media', media_id, tripname, tags, notes
            FROM media
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1);
        `;

        const result = await pool.query(query, [term]);
        return result.rows;
    } catch (err) {
        console.error('Error executing full-text search query', err);
        throw err;
    }
};

// Function to register a new user
const registerUser = async (name, email, password) => {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, hashedPassword];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error registering new user', err);
        throw err;
    }
};

// Function to retrieve a user by email
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving user by email', err);
        throw err;
    }
};


module.exports = { searchDatabase };
