const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Service Unavailable - External API Error';
    } else if (err.status) {
        statusCode = err.status;
        message = err.message;
    }

    res.status(statusCode).json({
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
