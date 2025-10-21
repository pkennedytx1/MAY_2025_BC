const favoritesRepository = require('../repositories/favoritesRepository');

class FavoritesController {
    async getAllFavorites(req, res, next) {
        try {
            const favorites = await favoritesRepository.getAllFavorites();
            res.json({
                favorites,
                count: favorites.length,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async addFavorite(req, res, next) {
        try {
            const { name, country, latitude, longitude, note } = req.body;
            
            // Validate required fields
            if (!name || !latitude || !longitude) {
                return res.status(400).json({
                    error: 'Missing required fields: name, latitude, longitude'
                });
            }

            // Check if location already exists
            const existingFavorites = await favoritesRepository.getAllFavorites();
            const exists = existingFavorites.find(fav => 
                Math.abs(fav.latitude - parseFloat(latitude)) < 0.001 && 
                Math.abs(fav.longitude - parseFloat(longitude)) < 0.001
            );

            if (exists) {
                return res.status(409).json({
                    error: 'Location already exists in favorites',
                    existingFavorite: exists
                });
            }

            const favorite = await favoritesRepository.addFavorite({
                name,
                country: country || 'Unknown',
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                note: note || ''
            });

            res.status(201).json({
                message: 'Favorite added successfully',
                favorite,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async removeFavorite(req, res, next) {
        try {
            const { id } = req.params;
            
            const favorite = await favoritesRepository.getFavoriteById(id);
            if (!favorite) {
                return res.status(404).json({
                    error: 'Favorite not found'
                });
            }

            await favoritesRepository.removeFavorite(id);
            
            res.json({
                message: 'Favorite removed successfully',
                removedFavorite: favorite,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async updateFavorite(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const favorite = await favoritesRepository.getFavoriteById(id);
            if (!favorite) {
                return res.status(404).json({
                    error: 'Favorite not found'
                });
            }

            const updatedFavorite = await favoritesRepository.updateFavorite(id, updates);
            
            res.json({
                message: 'Favorite updated successfully',
                favorite: updatedFavorite,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async getFavoriteById(req, res, next) {
        try {
            const { id } = req.params;
            
            const favorite = await favoritesRepository.getFavoriteById(id);
            if (!favorite) {
                return res.status(404).json({
                    error: 'Favorite not found'
                });
            }

            res.json({
                favorite,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async getFavoritesStats(req, res, next) {
        try {
            const stats = await favoritesRepository.getFavoritesStats();
            res.json({
                stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    async clearAllFavorites(req, res, next) {
        try {
            await favoritesRepository.clearAllFavorites();
            
            res.json({
                message: 'All favorites cleared successfully',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FavoritesController();
