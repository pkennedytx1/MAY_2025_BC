const weatherService = require('../services/weatherService');
const locationService = require('../services/locationService');
const weatherDataRepository = require('../repositories/weatherDataRepository');

class WeatherController {
    async getCurrentWeather(req, res, next) {
        const startTime = Date.now();
        try {
            const { latitude, longitude } = req.query;
            
            // Check cache first
            const cacheKey = `current_${latitude}_${longitude}`;
            const cachedData = await weatherDataRepository.getCachedWeather(cacheKey);
            
            if (cachedData && await weatherDataRepository.isCacheValid(cacheKey)) {
                await weatherDataRepository.logApiCall('current', { latitude, longitude }, Date.now() - startTime, true);
                return res.json(cachedData.data);
            }

            // Fetch current weather data
            const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
            
            // Try to fetch forecast data, but don't fail if it doesn't work
            let forecastData = null;
            try {
                forecastData = await weatherService.getForecast(latitude, longitude, 3);
            } catch (forecastError) {
                console.warn('Forecast data unavailable:', forecastError.message);
            }
            
            // Combine current and forecast data
            const combinedData = {
                ...weatherData,
                ...(forecastData && { daily: forecastData.daily })
            };
            
            // Cache the data
            await weatherDataRepository.cacheWeather(cacheKey, combinedData);
            
            // Log successful API call
            await weatherDataRepository.logApiCall('current', { latitude, longitude }, Date.now() - startTime, true);
            
            res.json(combinedData);
        } catch (error) {
            // Log failed API call
            await weatherDataRepository.logApiCall('current', req.query, Date.now() - startTime, false);
            next(error);
        }
    }

    async getForecast(req, res, next) {
        const startTime = Date.now();
        try {
            const { latitude, longitude, days = 7 } = req.query;
            
            const cacheKey = `forecast_${latitude}_${longitude}_${days}`;
            const cachedData = await weatherDataRepository.getCachedWeather(cacheKey);
            
            if (cachedData && await weatherDataRepository.isCacheValid(cacheKey)) {
                await weatherDataRepository.logApiCall('forecast', { latitude, longitude, days }, Date.now() - startTime, true);
                return res.json(cachedData.data);
            }

            const forecastData = await weatherService.getForecast(latitude, longitude, days);
            
            await weatherDataRepository.cacheWeather(cacheKey, forecastData);
            
            await weatherDataRepository.logApiCall('forecast', { latitude, longitude, days }, Date.now() - startTime, true);
            
            res.json(forecastData);
        } catch (error) {
            await weatherDataRepository.logApiCall('forecast', req.query, Date.now() - startTime, false);
            next(error);
        }
    }

    async getWeatherByCity(req, res, next) {
        try {
            const { city } = req.params;
            
            // Get city coordinates first
            const locationData = await locationService.searchLocation(city);
            
            if (!locationData || locationData.length === 0) {
                return res.status(404).json({ error: 'City not found' });
            }

            const { latitude, longitude, name, country } = locationData[0];
            
            // Get weather data
            const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
            const forecastData = await weatherService.getForecast(latitude, longitude, 3);
            
            // Combine location and weather data
            const response = {
                location: { name, country, latitude, longitude },
                weather: {
                    current: weatherData.current,
                    daily: forecastData.daily
                }
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getAviationWeather(req, res, next) {
        const startTime = Date.now();
        try {
            const { latitude, longitude } = req.query;
            
            const cacheKey = `aviation_${latitude}_${longitude}`;
            const cachedData = await weatherDataRepository.getCachedWeather(cacheKey);
            
            if (cachedData && await weatherDataRepository.isCacheValid(cacheKey)) {
                await weatherDataRepository.logApiCall('aviation', { latitude, longitude }, Date.now() - startTime, true);
                return res.json(cachedData.data);
            }

            const aviationData = await weatherService.getAviationWeather(latitude, longitude);
            
            await weatherDataRepository.cacheWeather(cacheKey, aviationData);
            
            await weatherDataRepository.logApiCall('aviation', { latitude, longitude }, Date.now() - startTime, true);
            
            res.json(aviationData);
        } catch (error) {
            await weatherDataRepository.logApiCall('aviation', req.query, Date.now() - startTime, false);
            next(error);
        }
    }
}

module.exports = new WeatherController();
