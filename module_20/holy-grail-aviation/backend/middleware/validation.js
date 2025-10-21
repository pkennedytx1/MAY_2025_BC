const { body, param, query, validationResult } = require('express-validator');

const validateWeatherParams = [
    query('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be a number between -90 and 90'),
    query('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be a number between -180 and 180'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid parameters',
                details: errors.array()
            });
        }
        next();
    }
];

const validateCityParams = [
    param('city')
        .isLength({ min: 1, max: 100 })
        .withMessage('City name must be between 1 and 100 characters')
        .matches(/^[a-zA-Z\s\-'\.]+$/)
        .withMessage('City name contains invalid characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid city parameter',
                details: errors.array()
            });
        }
        next();
    }
];

const validateDaysParam = [
    query('days')
        .optional()
        .isInt({ min: 1, max: 16 })
        .withMessage('Days must be an integer between 1 and 16'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid days parameter',
                details: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateWeatherParams,
    validateCityParams,
    validateDaysParam
};
