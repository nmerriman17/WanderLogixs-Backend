const TripModel = require('../models/tripModel.js');
const { uploadFileToS3 } = require('../config/s3Upload'); // AWS S3 upload utility

const getTrips = async (req, res) => {
    try {
        const trips = await TripModel.getAllTrips();
        res.json(trips);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getTripById = async (req, res) => {
    try {
        const trip = await TripModel.getTripById(req.params.id);
        if (trip) {
            res.json(trip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTrip = async (req, res) => {
    try {
        let mediaUrl = '', fileKey = '';

        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
            fileKey = uploadResult.fileKey;
        }

        const tripData = {
            ...req.body,
            media_url: mediaUrl,
            file_key: fileKey
        };

        const newTrip = await TripModel.addTrip(tripData);
        res.status(201).json(newTrip);
    } catch (error) {
        console.error('Error in creating trip:', error);
        res.status(500).send('Error creating trip');
    }
};

const updateTrip = async (req, res) => {
    try {
        let mediaUrl = req.body.media_url, fileKey = req.body.file_key;

        if (req.file) {
            const uploadResult = await uploadFileToS3(req.file);
            mediaUrl = uploadResult.url;
            fileKey = uploadResult.fileKey;
        }

        const tripData = {
            ...req.body,
            media_url: mediaUrl,
            file_key: fileKey
        };

        const updatedTrip = await TripModel.updateTrip(req.params.id, tripData);
        if (updatedTrip) {
            res.json(updatedTrip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        console.error('Error in updating trip:', error);
        res.status(500).send('Error updating trip');
    }
};

const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await TripModel.deleteTrip(req.params.id);
        if (deletedTrip) {
            res.json(deletedTrip);
        } else {
            res.status(404).send('Trip not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
};