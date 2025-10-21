const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const weatherRoutes = require('./routes/weatherRoutes');
const healthRoutes = require('./routes/healthRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
    origin: [
        'http://localhost:8007',
        'http://127.0.0.1:8007',
        /^http:\/\/192\.168\.\d+\.\d+:8007$/,
        /^http:\/\/10\.\d+\.\d+\.\d+:8007$/,
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoritesRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`🚁 Holy Grail Aviation Weather API running on port ${PORT}`);
    console.log(`🌤️  Ready to serve weather data!`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;