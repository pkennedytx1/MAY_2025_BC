# Holy Grail Aviation Weather App - MVC Architecture

## 🏗️ Architecture Overview

This application follows a proper **Model-View-Controller (MVC)** architecture with clear separation of concerns:

```
backend/
├── config/
│   └── config.js              # Application configuration
├── controllers/               # Controllers (Business Logic)
│   ├── weatherController.js    # Weather-related endpoints
│   ├── locationController.js   # Location-related endpoints
│   └── healthController.js     # Health check endpoints
├── services/                   # Service Layer (External API Integration)
│   ├── weatherService.js       # Open Meteo API integration
│   └── locationService.js      # Location/Geocoding services
├── repositories/               # Data Access Layer
│   └── weatherDataRepository.js # JSON database operations
├── database/                   # Database Layer
│   └── JsonDatabase.js         # JSON file-based database
├── routes/                     # Route Definitions
│   ├── weatherRoutes.js       # Weather API routes
│   ├── locationRoutes.js      # Location API routes
│   ├── healthRoutes.js        # Health check routes
│   └── adminRoutes.js         # Admin/database management routes
├── middleware/                 # Custom Middleware
│   ├── validation.js          # Input validation
│   ├── errorHandler.js        # Error handling
│   ├── notFoundHandler.js     # 404 handler
│   └── requestLogger.js       # Request logging
├── data/                      # JSON Database Files
│   ├── cache.json            # Weather data cache
│   ├── settings.json         # Application settings
│   └── logs.json             # Request/error logs
├── package.json              # Dependencies
└── server.js                 # Main server file
```

## 🔄 Data Flow

```
Client Request → Routes → Controllers → Services → External APIs
                     ↓
                Repositories → JSON Database
                     ↓
                Response ← Controllers ← Services ← External APIs
```

## 📊 Components Breakdown

### **1. Routes Layer** (`/routes/`)
- **Purpose**: Define API endpoints and HTTP methods
- **Responsibility**: Route requests to appropriate controllers
- **Files**:
  - `weatherRoutes.js` - Weather-related endpoints
  - `locationRoutes.js` - Location/geocoding endpoints
  - `healthRoutes.js` - Health check endpoints
  - `adminRoutes.js` - Database management endpoints

### **2. Controllers Layer** (`/controllers/`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibility**: Business logic, data validation, error handling
- **Files**:
  - `weatherController.js` - Weather data processing
  - `locationController.js` - Location data processing
  - `healthController.js` - System health monitoring

### **3. Services Layer** (`/services/`)
- **Purpose**: External API integration and business logic
- **Responsibility**: API calls, data transformation, external service management
- **Files**:
  - `weatherService.js` - Open Meteo API integration
  - `locationService.js` - Geocoding and location services

### **4. Data Access Layer** (`/repositories/`)
- **Purpose**: Database operations and data persistence
- **Responsibility**: CRUD operations, caching, data retrieval
- **Files**:
  - `weatherDataRepository.js` - Weather data caching and retrieval

### **5. Database Layer** (`/database/`)
- **Purpose**: Low-level database operations
- **Responsibility**: File I/O, data serialization, database management
- **Files**:
  - `JsonDatabase.js` - JSON file-based database implementation

### **6. Middleware** (`/middleware/`)
- **Purpose**: Request/response processing
- **Responsibility**: Validation, error handling, logging, security
- **Files**:
  - `validation.js` - Input validation middleware
  - `errorHandler.js` - Centralized error handling
  - `notFoundHandler.js` - 404 error handling
  - `requestLogger.js` - Request logging middleware

## 🗄️ JSON Database Structure

### **Cache Database** (`data/cache.json`)
```json
{
  "current_40.7128_-74.0060": {
    "data": { /* weather data */ },
    "timestamp": 1703123456789,
    "expiresAt": 1703124056789
  }
}
```

### **Settings Database** (`data/settings.json`)
```json
{
  "cacheTimeout": 600000,
  "maxCacheSize": 1000,
  "logLevel": "info",
  "apiRateLimit": 1000
}
```

### **Logs Database** (`data/logs.json`)
```json
[
  {
    "type": "api_call",
    "endpoint": "current",
    "params": { "latitude": 40.7128, "longitude": -74.0060 },
    "responseTime": 150,
    "success": true,
    "timestamp": "2023-12-21T10:30:00.000Z"
  }
]
```

## 🚀 API Endpoints

### **Weather Endpoints**
- `GET /api/weather/current` - Current weather by coordinates
- `GET /api/weather/forecast` - Weather forecast by coordinates
- `GET /api/weather/city/:city` - Weather by city name
- `GET /api/weather/aviation` - Aviation-specific weather data

### **Location Endpoints**
- `GET /api/location/search/:query` - Search for locations
- `GET /api/location/reverse` - Reverse geocoding

### **Health Endpoints**
- `GET /api/health` - System health check

### **Admin Endpoints**
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/cache/stats` - Cache statistics
- `GET /api/admin/api/stats` - API usage statistics
- `POST /api/admin/cache/clear` - Clear expired cache
- `GET /api/admin/logs` - System logs

## 🔧 Key Features

### **Caching System**
- Automatic caching of weather data
- Configurable cache timeout (default: 10 minutes)
- Cache size management with automatic cleanup
- Cache statistics and monitoring

### **Logging System**
- Request/response logging
- API call tracking with response times
- Error logging with stack traces
- Configurable log retention

### **Error Handling**
- Centralized error handling middleware
- Detailed error responses in development
- Graceful error recovery
- Error logging and monitoring

### **Input Validation**
- Request parameter validation
- Data type checking
- Range validation for coordinates
- Sanitization of user inputs

### **Performance Monitoring**
- Response time tracking
- API usage statistics
- Cache hit/miss ratios
- System resource monitoring

## 🛠️ Configuration

The application uses environment variables for configuration:

```bash
PORT=5001                          # Server port
NODE_ENV=development               # Environment
OPEN_METEO_BASE_URL=https://...    # API base URL
API_TIMEOUT=10000                  # API timeout (ms)
CACHE_TIMEOUT=600000              # Cache timeout (ms)
MAX_CACHE_SIZE=1000               # Max cache entries
LOG_LEVEL=info                     # Logging level
FRONTEND_URL=http://localhost:8007 # CORS origin
```

## 📈 Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to modify and extend individual components
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features or modify existing ones
5. **Data Persistence**: JSON database provides simple data storage
6. **Performance**: Caching reduces API calls and improves response times
7. **Monitoring**: Comprehensive logging and statistics
8. **Error Handling**: Centralized error management

This architecture provides a solid foundation for a production-ready weather application with proper separation of concerns and data management capabilities.
