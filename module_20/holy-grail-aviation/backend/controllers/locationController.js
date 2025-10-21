const locationService = require('../services/locationService');

class LocationController {
    async searchLocation(req, res, next) {
        try {
            const { query } = req.params;
            
            const locations = await locationService.searchLocation(query);
            
            res.json(locations);
        } catch (error) {
            next(error);
        }
    }

    async reverseGeocode(req, res, next) {
        try {
            const { latitude, longitude } = req.query;
            
            const location = await locationService.reverseGeocode(latitude, longitude);
            
            res.json(location);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LocationController();
