const axios = require('axios');
const config = require('../config/config');

class LocationService {
    constructor() {
        this.openMeteoBaseUrl = config.openMeteo.baseUrl;
        this.timeout = config.openMeteo.timeout;
    }

    async searchLocation(query) {
        try {
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
                params: {
                    name: query,
                    count: 10,
                    language: 'en',
                    format: 'json'
                },
                timeout: this.timeout
            });

            return response.data.results || [];
        } catch (error) {
            throw new Error(`Failed to search location: ${error.message}`);
        }
    }

    async reverseGeocode(latitude, longitude) {
        try {
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
                params: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    count: 1,
                    language: 'en',
                    format: 'json'
                },
                timeout: this.timeout
            });

            return response.data.results?.[0] || null;
        } catch (error) {
            throw new Error(`Failed to reverse geocode: ${error.message}`);
        }
    }

    async getLocationDetails(latitude, longitude) {
        try {
            const location = await this.reverseGeocode(latitude, longitude);
            
            if (!location) {
                return {
                    name: 'Unknown Location',
                    country: 'Unknown',
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                };
            }

            return {
                name: location.name,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
                admin1: location.admin1,
                admin2: location.admin2
            };
        } catch (error) {
            throw new Error(`Failed to get location details: ${error.message}`);
        }
    }
}

module.exports = new LocationService();
