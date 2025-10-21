module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    openMeteo: {
        baseUrl: process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1',
        timeout: parseInt(process.env.API_TIMEOUT) || 10000,
        retries: parseInt(process.env.API_RETRIES) || 3
    },
    
    database: {
        path: process.env.DB_PATH || './data',
        cacheTimeout: parseInt(process.env.CACHE_TIMEOUT) || 600000, // 10 minutes
        maxCacheSize: parseInt(process.env.MAX_CACHE_SIZE) || 1000,
        logRetention: parseInt(process.env.LOG_RETENTION) || 1000
    },
    
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:8007',
        credentials: true
    },
    
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // requests per window
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    }
};
