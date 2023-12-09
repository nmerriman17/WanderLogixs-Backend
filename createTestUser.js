const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const createUser = async () => {
    const hashedPassword = await bcrypt.hash('testPassword123', 10); // New password
    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            ['Test User', 'test@example.com', hashedPassword]
        );
        console.log('Test User Created:', result.rows[0]);
    } catch (err) {
        console.error('Error creating test user', err);
    } finally {
        await pool.end();
    }
};

createUser();
