const fs = require('fs').promises;
const path = require('path');

class JsonDatabase {
    constructor(dbPath = './data') {
        this.dbPath = dbPath;
        this.cachePath = path.join(dbPath, 'cache.json');
        this.settingsPath = path.join(dbPath, 'settings.json');
        this.logsPath = path.join(dbPath, 'logs.json');
        this.favoritesPath = path.join(dbPath, 'favorites.json');
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            await fs.mkdir(this.dbPath, { recursive: true });
            
            // Initialize cache file if it doesn't exist
            try {
                await fs.access(this.cachePath);
            } catch {
                await fs.writeFile(this.cachePath, JSON.stringify({}, null, 2));
            }

            // Initialize settings file if it doesn't exist
            try {
                await fs.access(this.settingsPath);
            } catch {
                const defaultSettings = {
                    cacheTimeout: 600000, // 10 minutes
                    maxCacheSize: 1000,
                    logLevel: 'info',
                    apiRateLimit: 1000 // requests per hour
                };
                await fs.writeFile(this.settingsPath, JSON.stringify(defaultSettings, null, 2));
            }

            // Initialize logs file if it doesn't exist
            try {
                await fs.access(this.logsPath);
            } catch {
                await fs.writeFile(this.logsPath, JSON.stringify([], null, 2));
            }

            // Initialize favorites file if it doesn't exist
            try {
                await fs.access(this.favoritesPath);
            } catch {
                await fs.writeFile(this.favoritesPath, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }

    async readJsonFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }

    async writeJsonFile(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            throw error;
        }
    }

    async getCache() {
        return await this.readJsonFile(this.cachePath);
    }

    async setCache(cacheData) {
        await this.writeJsonFile(this.cachePath, cacheData);
    }

    async getSettings() {
        return await this.readJsonFile(this.settingsPath);
    }

    async updateSettings(newSettings) {
        const currentSettings = await this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        await this.writeJsonFile(this.settingsPath, updatedSettings);
        return updatedSettings;
    }

    async addLog(logEntry) {
        const logs = await this.readJsonFile(this.logsPath);
        const newLog = {
            timestamp: new Date().toISOString(),
            ...logEntry
        };
        logs.push(newLog);
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        await this.writeJsonFile(this.logsPath, logs);
        return newLog;
    }

    async getLogs(limit = 100) {
        const logs = await this.readJsonFile(this.logsPath);
        return logs.slice(-limit);
    }

    async clearCache() {
        await this.writeJsonFile(this.cachePath, {});
    }

    async clearLogs() {
        await this.writeJsonFile(this.logsPath, []);
    }

    async getFavorites() {
        return await this.readJsonFile(this.favoritesPath);
    }

    async addFavorite(favorite) {
        const favorites = await this.getFavorites();
        const newFavorite = {
            id: Date.now().toString(),
            ...favorite,
            createdAt: new Date().toISOString()
        };
        favorites.push(newFavorite);
        await this.writeJsonFile(this.favoritesPath, favorites);
        return newFavorite;
    }

    async removeFavorite(id) {
        const favorites = await this.getFavorites();
        const filteredFavorites = favorites.filter(fav => fav.id !== id);
        await this.writeJsonFile(this.favoritesPath, filteredFavorites);
        return true;
    }

    async updateFavorite(id, updates) {
        const favorites = await this.getFavorites();
        const index = favorites.findIndex(fav => fav.id === id);
        if (index !== -1) {
            favorites[index] = { ...favorites[index], ...updates, updatedAt: new Date().toISOString() };
            await this.writeJsonFile(this.favoritesPath, favorites);
            return favorites[index];
        }
        return null;
    }

    async clearFavorites() {
        await this.writeJsonFile(this.favoritesPath, []);
    }
}

module.exports = JsonDatabase;
