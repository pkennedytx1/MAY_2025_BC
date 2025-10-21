const express = require('express');
const router = express.Router();
const weatherDataRepository = require('../repositories/weatherDataRepository');

// Database management routes
router.get('/stats', async (req, res, next) => {
    try {
        const cacheStats = await weatherDataRepository.getCacheStats();
        const apiStats = await weatherDataRepository.getApiStats(24);
        
        res.json({
            cache: cacheStats,
            api: apiStats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

router.get('/cache/stats', async (req, res, next) => {
    try {
        const stats = await weatherDataRepository.getCacheStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

router.get('/api/stats', async (req, res, next) => {
    try {
        const hours = parseInt(req.query.hours) || 24;
        const stats = await weatherDataRepository.getApiStats(hours);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

router.post('/cache/clear', async (req, res, next) => {
    try {
        await weatherDataRepository.clearExpiredCache();
        res.json({ message: 'Expired cache entries cleared successfully' });
    } catch (error) {
        next(error);
    }
});

router.get('/logs', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await weatherDataRepository.getLogs(limit);
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
