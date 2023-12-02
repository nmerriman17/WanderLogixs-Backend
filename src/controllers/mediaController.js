const MediaModel = require('../models/mediaModel.js'); 
const { uploadFileToS3, deleteFileFromS3 } = require('../config/s3Upload.js'); // AWS S3 upload utility

const getAllMedia = async (req, res) => {
    try {
        const mediaItems = await MediaModel.getAllMedia();
        res.json(mediaItems);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getMediaById = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const mediaItem = await MediaModel.getMediaById(mediaId);

        if (!mediaItem) {
            return res.status(404).send('Media not found');
        }

        res.json(mediaItem);
    } catch (error) {
        console.error('Error retrieving media by ID:', error);
        res.status(500).send('Error retrieving media');
    }
};

const uploadMedia = async (req, res) => {
    try {
        let mediaUrl = '';
        let fileKey = '';

        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
            fileKey = uploadResult.fileKey;
        }

        const { tripname, tags, notes } = req.body;
        const mediaData = { tripname, tags, notes, url: mediaUrl, fileKey };

        const newMedia = await MediaModel.addMedia(mediaData);
        res.status(201).json(newMedia);
    } catch (error) {
        console.error('Error in uploading media:', error);
        res.status(500).send('Error uploading media');
    }
};

const deleteMedia = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const mediaItem = await MediaModel.getMediaById(mediaId);

        if (mediaItem) {
            await deleteFileFromS3(mediaItem.fileKey);
            await MediaModel.deleteMedia(mediaId);
            res.send('Media deleted successfully');
        } else {
            res.status(404).send('Media not found');
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).send('Error deleting media');
    }
};

module.exports = {
    getAllMedia,
    getMediaById,
    uploadMedia,
    deleteMedia
};