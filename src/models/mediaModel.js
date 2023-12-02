const pool = require('../config/db.js'); 

const getAllMedia = async () => {
    const result = await pool.query('SELECT * FROM media');
    return result.rows;
};

const getMediaById = async (mediaId) => {
    const result = await pool.query('SELECT * FROM media WHERE id = $1', [mediaId]);
    return result.rows[0];
};

const addMedia = async (mediaData) => {
    const { tripname, tags, notes, url, fileKey } = mediaData;
    const result = await pool.query(
        'INSERT INTO media (tripname, tags, notes, url, file_key) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [tripname, tags, notes, url, fileKey]
    );
    return result.rows[0];
};

const updateMedia = async (mediaId, mediaData) => {
    const { tripname, tags, notes, url, fileKey } = mediaData;
    const result = await pool.query(
        'UPDATE media SET tripname = $1, tags = $2, notes = $3, url = $4, file_key = $5 WHERE id = $6 RETURNING *',
        [tripname, tags, notes, url, fileKey, mediaId]
    );
    return result.rows[0];
};

const deleteMedia = async (mediaId) => {
    const result = await pool.query('DELETE FROM media WHERE id = $1 RETURNING *', [mediaId]);
    return result.rows[0];
};

module.exports = {
    getAllMedia,
    getMediaById,
    addMedia,
    updateMedia,
    deleteMedia
};
