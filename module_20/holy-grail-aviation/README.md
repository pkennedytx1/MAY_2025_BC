# Holy Grail Aviation Weather App

A modern, responsive weather application built with vanilla JavaScript frontend and Node.js backend, powered by the Open Meteo Weather API.

## Features

- 🌤️ **Real-time Weather Data** - Current conditions and 3-day forecasts
- 🛩️ **Aviation-Specific Information** - Flight visibility, wind conditions, and precipitation data
- 📍 **Location Services** - GPS-based location detection and city search
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing
- **Open Meteo API** - Free weather data source

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Modern styling with flexbox and grid
- **HTML5** - Semantic markup
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm
- Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your web browser or use a local server:
```bash
# Using Python (if available)
python -m http.server 8007

# Using Node.js http-server (install globally first)
npx http-server -p 8007
```

3. Open `http://localhost:8007` in your browser

## API Endpoints

The backend provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/weather/current` - Current weather by coordinates
- `GET /api/weather/forecast` - Weather forecast by coordinates
- `GET /api/weather/city/:city` - Weather by city name
- `GET /api/weather/aviation` - Aviation-specific weather data

## Usage

1. **Search by City**: Type a city name in the search box and press Enter or click search
2. **Use Current Location**: Click "Use My Location" to get weather for your current position
3. **View Details**: Scroll down to see detailed weather information and aviation conditions
4. **Check Forecast**: View the 3-day weather forecast below the current conditions

## Weather Data Sources

This app uses the [Open Meteo API](https://open-meteo.com/), which provides:
- Free, open-source weather data
- No API key required for non-commercial use
- Global coverage with high accuracy
- Real-time and forecast data
- Aviation-specific parameters

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

