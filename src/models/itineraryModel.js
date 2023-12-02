const pool = require('../config/db.js'); 

const getAllItineraries = async () => {
    const result = await pool.query('SELECT * FROM itineraries');
    return result.rows;
};

const getItineraryById = async (itineraryId) => {
    const result = await pool.query('SELECT * FROM itineraries WHERE id = $1', [itineraryId]);
    return result.rows[0];
};

const addItinerary = async (itineraryData) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + 'T' + startTime).toISOString();
    const endDateTime = new Date(endDate + 'T' + endTime).toISOString();

    const result = await pool.query(
        'INSERT INTO itineraries (event_name, location, start_datetime, end_datetime, description, notification) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [eventName, location, startDateTime, endDateTime, description, notification]
    );
    return result.rows[0];
};

const updateItinerary = async (itineraryId, itineraryData) => {
    const { eventName, location, startDate, startTime, endDate, endTime, description, notification } = itineraryData;
    const startDateTime = new Date(startDate + 'T' + startTime).toISOString();
    const endDateTime = new Date(endDate + 'T' + endTime).toISOString();

    const result = await pool.query(
        'UPDATE itineraries SET event_name = $1, location = $2, start_datetime = $3, end_datetime = $4, description = $5, notification = $6 WHERE id = $7 RETURNING *',
        [eventName, location, startDateTime, endDateTime, description, notification, itineraryId]
    );
    return result.rows[0];
};

const deleteItinerary = async (itineraryId) => {
    const result = await pool.query('DELETE FROM itineraries WHERE id = $1 RETURNING *', [itineraryId]);
    return result.rows[0];
};

module.exports = {
    getAllItineraries,
    getItineraryById,
    addItinerary,
    updateItinerary,
    deleteItinerary
};
