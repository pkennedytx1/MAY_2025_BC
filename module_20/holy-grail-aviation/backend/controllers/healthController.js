class HealthController {
    async getHealth(req, res, next) {
        try {
            const healthData = {
                status: 'OK',
                message: 'Holy Grail Aviation Weather API is running!',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                uptime: process.uptime(),
                memory: process.memoryUsage()
            };

            res.json(healthData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HealthController();
