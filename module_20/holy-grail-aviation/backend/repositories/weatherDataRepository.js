const JsonDatabase = require('../database/JsonDatabase');

class WeatherDataRepository {
    constructor() {
        this.db = new JsonDatabase();
    }

    async getCachedWeather(cacheKey) {
        try {
            const cache = await this.db.getCache();
            return cache[cacheKey] || null;
        } catch (error) {
            console.error('Error getting cached weather:', error);
            return null;
        }
    }

    async cacheWeather(cacheKey, weatherData) {
        try {
            const cache = await this.db.getCache();
            const settings = await this.db.getSettings();
            
            // Check cache size limit
            const cacheKeys = Object.keys(cache);
            if (cacheKeys.length >= settings.maxCacheSize) {
                // Remove oldest entries
                const sortedKeys = cacheKeys.sort((a, b) => {
                    return (cache[a].timestamp || 0) - (cache[b].timestamp || 0);
                });
                
                const keysToRemove = sortedKeys.slice(0, Math.floor(settings.maxCacheSize * 0.2));
                keysToRemove.forEach(key => delete cache[key]);
            }

            cache[cacheKey] = {
                data: weatherData,
                timestamp: new Date().getTime(),
                expiresAt: new Date().getTime() + settings.cacheTimeout
            };

            await this.db.setCache(cache);
            
            // Log cache operation
            await this.db.addLog({
                type: 'cache',
                action: 'set',
                key: cacheKey,
                size: JSON.stringify(weatherData).length
            });
        } catch (error) {
            console.error('Error caching weather data:', error);
        }
    }

    async isCacheValid(cacheKey) {
        try {
            const cachedData = await this.getCachedWeather(cacheKey);
            if (!cachedData) return false;

            const now = new Date().getTime();
            return cachedData.expiresAt > now;
        } catch (error) {
            console.error('Error checking cache validity:', error);
            return false;
        }
    }

    async clearExpiredCache() {
        try {
            const cache = await this.db.getCache();
            const now = new Date().getTime();
            let clearedCount = 0;

            Object.keys(cache).forEach(key => {
                if (cache[key].expiresAt <= now) {
                    delete cache[key];
                    clearedCount++;
                }
            });

            if (clearedCount > 0) {
                await this.db.setCache(cache);
                await this.db.addLog({
                    type: 'cache',
                    action: 'clear_expired',
                    count: clearedCount
                });
            }

            return clearedCount;
        } catch (error) {
            console.error('Error clearing expired cache:', error);
            return 0;
        }
    }

    async getCacheStats() {
        try {
            const cache = await this.db.getCache();
            const keys = Object.keys(cache);
            const now = new Date().getTime();
            
            let validEntries = 0;
            let expiredEntries = 0;
            let totalSize = 0;

            keys.forEach(key => {
                const entry = cache[key];
                totalSize += JSON.stringify(entry).length;
                
                if (entry.expiresAt > now) {
                    validEntries++;
                } else {
                    expiredEntries++;
                }
            });

            return {
                totalEntries: keys.length,
                validEntries,
                expiredEntries,
                totalSize,
                averageSize: keys.length > 0 ? Math.round(totalSize / keys.length) : 0
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            return null;
        }
    }

    async logApiCall(endpoint, params, responseTime, success = true) {
        try {
            await this.db.addLog({
                type: 'api_call',
                endpoint,
                params,
                responseTime,
                success,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error logging API call:', error);
        }
    }

    async getApiStats(hours = 24) {
        try {
            const logs = await this.db.getLogs(10000); // Get more logs for stats
            const cutoffTime = new Date().getTime() - (hours * 60 * 60 * 1000);
            
            const apiLogs = logs.filter(log => 
                log.type === 'api_call' && 
                new Date(log.timestamp).getTime() > cutoffTime
            );

            const stats = {
                totalCalls: apiLogs.length,
                successfulCalls: apiLogs.filter(log => log.success).length,
                failedCalls: apiLogs.filter(log => !log.success).length,
                averageResponseTime: 0,
                endpointStats: {}
            };

            if (apiLogs.length > 0) {
                stats.averageResponseTime = Math.round(
                    apiLogs.reduce((sum, log) => sum + log.responseTime, 0) / apiLogs.length
                );

                // Group by endpoint
                apiLogs.forEach(log => {
                    if (!stats.endpointStats[log.endpoint]) {
                        stats.endpointStats[log.endpoint] = {
                            calls: 0,
                            success: 0,
                            failures: 0,
                            avgResponseTime: 0
                        };
                    }
                    
                    const endpointStat = stats.endpointStats[log.endpoint];
                    endpointStat.calls++;
                    if (log.success) endpointStat.success++;
                    else endpointStat.failures++;
                });

                // Calculate average response times per endpoint
                Object.keys(stats.endpointStats).forEach(endpoint => {
                    const endpointLogs = apiLogs.filter(log => log.endpoint === endpoint);
                    stats.endpointStats[endpoint].avgResponseTime = Math.round(
                        endpointLogs.reduce((sum, log) => sum + log.responseTime, 0) / endpointLogs.length
                    );
                });
            }

            return stats;
        } catch (error) {
            console.error('Error getting API stats:', error);
            return null;
        }
    }
}

module.exports = new WeatherDataRepository();
