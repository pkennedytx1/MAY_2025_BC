const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.path}`,
        timestamp: new Date().toISOString(),
        availableRoutes: [
            'GET /api/health',
            'GET /api/weather/current',
            'GET /api/weather/forecast',
            'GET /api/weather/city/:city',
            'GET /api/weather/aviation',
            'GET /api/location/search/:query',
            'GET /api/location/reverse'
        ]
    });
};

module.exports = notFoundHandler;
