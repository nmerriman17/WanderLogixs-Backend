const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController.js');
const { authenticateToken } = require('../../middleware/auth');

// Get all itineraries
router.get('/', authenticateToken, itineraryController.getItineraries);

// Get a single itinerary by ID
router.get('/:id', authenticateToken, itineraryController.getItineraryById);

// Create a new itinerary
router.post('/', authenticateToken, itineraryController.createItinerary);

// Update an itinerary
router.put('/:id', authenticateToken, itineraryController.updateItinerary);

// Delete an itinerary
router.delete('/:id', authenticateToken, itineraryController.deleteItinerary);

module.exports = router;
