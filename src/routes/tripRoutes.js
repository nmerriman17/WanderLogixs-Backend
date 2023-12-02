const express = require('express');
const multer = require('multer');
const TripController = require('../controllers/tripController.js');
const { authenticateToken } = require('../../middleware/auth');
const router = express.Router();

// Setup multer for file upload. Configure as needed.
const upload = multer({ dest: 'uploads/' });

// Route to create a new trip with potential file upload
router.post('/', authenticateToken, upload.single('media'), TripController.createTrip);

// Get all trips
router.get('/', authenticateToken, TripController.getTrips);

// Get a single trip by ID
router.get('/:id', authenticateToken, TripController.getTripById);

// Update a trip with potential file upload
router.put('/:id', authenticateToken, upload.single('media'), TripController.updateTrip);

// Delete a trip
router.delete('/:id', authenticateToken, TripController.deleteTrip);

module.exports = router;
