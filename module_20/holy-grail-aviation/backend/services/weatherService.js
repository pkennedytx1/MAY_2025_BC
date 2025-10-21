const axios = require('axios');
const config = require('../config/config');

class WeatherService {
    constructor() {
        this.openMeteoBaseUrl = config.openMeteo.baseUrl;
        this.timeout = config.openMeteo.timeout;
    }

    async getCurrentWeather(latitude, longitude) {
        try {
            const response = await axios.get(`${this.openMeteoBaseUrl}/forecast`, {
                params: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,dewpoint_2m,visibility',
                    timezone: 'auto'
                },
                timeout: this.timeout
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch current weather: ${error.message}`);
        }
    }

    async getForecast(latitude, longitude, days = 7) {
        try {
            const response = await axios.get(`${this.openMeteoBaseUrl}/forecast`, {
                params: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
                    timezone: 'auto',
                    forecast_days: parseInt(days)
                },
                timeout: this.timeout
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch forecast: ${error.message}`);
        }
    }

    async getAviationWeather(latitude, longitude) {
        try {
            const response = await axios.get(`${this.openMeteoBaseUrl}/forecast`, {
                params: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    current: 'temperature_2m,relative_humidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,visibility',
                    hourly: 'temperature_2m,relative_humidity_2m,dewpoint_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,visibility',
                    timezone: 'auto',
                    forecast_hours: 24
                },
                timeout: this.timeout
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch aviation weather: ${error.message}`);
        }
    }

    async getWeatherByCoordinates(latitude, longitude) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.getCurrentWeather(latitude, longitude),
                this.getForecast(latitude, longitude, 3)
            ]);

            return {
                current: currentWeather.current,
                daily: forecast.daily
            };
        } catch (error) {
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }
}

module.exports = new WeatherService();
