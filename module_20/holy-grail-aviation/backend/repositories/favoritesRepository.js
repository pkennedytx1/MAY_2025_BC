const JsonDatabase = require('../database/JsonDatabase');

class FavoritesRepository {
    constructor() {
        this.db = new JsonDatabase();
    }

    async getAllFavorites() {
        try {
            return await this.db.getFavorites();
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    }

    async addFavorite(favoriteData) {
        try {
            const favorite = await this.db.addFavorite(favoriteData);
            
            // Log the addition
            await this.db.addLog({
                type: 'favorite',
                action: 'add',
                favoriteId: favorite.id,
                location: favorite.name
            });
            
            return favorite;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    }

    async removeFavorite(id) {
        try {
            const result = await this.db.removeFavorite(id);
            
            // Log the removal
            await this.db.addLog({
                type: 'favorite',
                action: 'remove',
                favoriteId: id
            });
            
            return result;
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    }

    async updateFavorite(id, updates) {
        try {
            const favorite = await this.db.updateFavorite(id, updates);
            
            if (favorite) {
                // Log the update
                await this.db.addLog({
                    type: 'favorite',
                    action: 'update',
                    favoriteId: id,
                    updates: Object.keys(updates)
                });
            }
            
            return favorite;
        } catch (error) {
            console.error('Error updating favorite:', error);
            throw error;
        }
    }

    async getFavoriteById(id) {
        try {
            const favorites = await this.db.getFavorites();
            return favorites.find(fav => fav.id === id) || null;
        } catch (error) {
            console.error('Error getting favorite by ID:', error);
            return null;
        }
    }

    async clearAllFavorites() {
        try {
            await this.db.clearFavorites();
            
            // Log the clear action
            await this.db.addLog({
                type: 'favorite',
                action: 'clear_all'
            });
            
            return true;
        } catch (error) {
            console.error('Error clearing favorites:', error);
            throw error;
        }
    }

    async getFavoritesStats() {
        try {
            const favorites = await this.db.getFavorites();
            
            const stats = {
                total: favorites.length,
                byCountry: {},
                recentlyAdded: favorites
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5),
                mostRecent: favorites.length > 0 ? 
                    favorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] : null
            };

            // Group by country
            favorites.forEach(fav => {
                const country = fav.country || 'Unknown';
                stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error('Error getting favorites stats:', error);
            return null;
        }
    }
}

module.exports = new FavoritesRepository();
