const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { validateWeatherParams, validateCityParams } = require('../middleware/validation');

// Weather routes
router.get('/current', validateWeatherParams, weatherController.getCurrentWeather);
router.get('/forecast', validateWeatherParams, weatherController.getForecast);
router.get('/city/:city', validateCityParams, weatherController.getWeatherByCity);
router.get('/aviation', validateWeatherParams, weatherController.getAviationWeather);

module.exports = router;
