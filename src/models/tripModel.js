const pool = require('../config/db.js'); 

const getAllTrips = async () => {
    const result = await pool.query('SELECT * FROM trips');
    return result.rows;
};

const getTripById = async (tripId) => {
    const result = await pool.query('SELECT * FROM trips WHERE trip_id = $1', [tripId]);
    return result.rows[0];
};

const addTrip = async (tripData) => {
    const { destination, start_date, end_date, purpose, notes, media_url, file_key } = tripData;
    const result = await pool.query(
        'INSERT INTO trips (destination, start_date, end_date, purpose, notes, media_url, file_key) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [destination, start_date, end_date, purpose, notes, media_url, file_key]
    );
    return result.rows[0];
};

const updateTrip = async (tripId, tripData) => {
    const { destination, start_date, end_date, purpose, notes, media_url, file_key } = tripData;
    const result = await pool.query(
        'UPDATE trips SET destination = $1, start_date = $2, end_date = $3, purpose = $4, notes = $5, media_url = $6, file_key = $7 WHERE trip_id = $8 RETURNING *',
        [destination, start_date, end_date, purpose, notes, media_url, file_key, tripId]
    );
    return result.rows[0];
};

const deleteTrip = async (tripId) => {
    const result = await pool.query('DELETE FROM trips WHERE trip_id = $1 RETURNING *', [tripId]);
    return result.rows[0];
};

module.exports = {
    getAllTrips,
    getTripById,
    addTrip,
    updateTrip,
    deleteTrip
};
