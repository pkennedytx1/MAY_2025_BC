const weatherDataRepository = require('../repositories/weatherDataRepository');

const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log the request
    weatherDataRepository.addLog({
        type: 'request',
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const responseTime = Date.now() - startTime;
        
        weatherDataRepository.addLog({
            type: 'response',
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
            timestamp: new Date().toISOString()
        });

        originalEnd.call(this, chunk, encoding);
    };

    next();
};

module.exports = requestLogger;
