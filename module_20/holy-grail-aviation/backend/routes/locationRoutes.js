const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { validateWeatherParams } = require('../middleware/validation');

// Location routes
router.get('/search/:query', locationController.searchLocation);
router.get('/reverse', validateWeatherParams, locationController.reverseGeocode);

module.exports = router;
