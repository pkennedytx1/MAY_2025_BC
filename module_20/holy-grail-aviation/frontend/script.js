// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.currentLocation = null;
        this.weatherData = null;
        this.isLoading = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherContent: document.getElementById('weatherContent'),
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            retryBtn: document.getElementById('retryBtn'),
            errorMessage: document.getElementById('errorMessage'),
            
            // Sidebar elements
            sidebar: document.getElementById('sidebar'),
            menuToggle: document.getElementById('menuToggle'),
            toggleSidebar: document.getElementById('toggleSidebar'),
            favoritesList: document.getElementById('favoritesList'),
            addFavoriteBtn: document.getElementById('addFavoriteBtn'),
            
            // Weather display elements
            locationName: document.getElementById('locationName'),
            locationCountry: document.getElementById('locationCountry'),
            lastUpdated: document.getElementById('lastUpdated'),
            currentTemp: document.getElementById('currentTemp'),
            weatherIcon: document.getElementById('weatherIcon'),
            weatherDesc: document.getElementById('weatherDesc'),
            feelsLike: document.getElementById('feelsLike'),
            
            // Detail elements
            visibility: document.getElementById('visibility'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure'),
            cloudCover: document.getElementById('cloudCover'),
            dewPoint: document.getElementById('dewPoint'),
            
            // Aviation elements
            flightVisibility: document.getElementById('flightVisibility'),
            precipitation: document.getElementById('precipitation'),
            windConditions: document.getElementById('windConditions'),
            
            // Forecast container
            forecastContainer: document.getElementById('forecastContainer')
        };
    }

    bindEvents() {
        // Search functionality
        this.elements.searchBtn.addEventListener('click', () => this.searchCity());
        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });

        // Location functionality
        this.elements.locationBtn.addEventListener('click', () => this.getCurrentLocation());

        // Retry functionality
        this.elements.retryBtn.addEventListener('click', () => this.loadDefaultWeather());

        // Sidebar functionality
        this.elements.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.elements.toggleSidebar.addEventListener('click', () => this.toggleSidebar());
        
        // Favorites functionality
        this.elements.addFavoriteBtn.addEventListener('click', () => this.addCurrentLocationToFavorites());
        
        // Load favorites on page load
        this.loadFavorites();
    }

    async loadDefaultWeather() {
        // Try to get user's location first, fallback to London
        try {
            await this.getCurrentLocation();
        } catch (error) {
            console.log('Location not available, using default city');
            await this.searchCity('London');
        }
    }

    async checkApiHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                console.log('API Health:', data.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error('API Health Check Failed:', error);
            return false;
        }
    }

    async getCurrentLocation() {
        this.showLoading();
        
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        try {
            const position = await this.getCurrentPositionPromise();
            const { latitude, longitude } = position.coords;
            this.currentLocation = { latitude, longitude };
            await this.fetchWeatherByCoords(latitude, longitude);
        } catch (error) {
            console.error('Geolocation error:', error);
            
            // Handle different geolocation error types
            if (error.code === 1) {
                // PERMISSION_DENIED or SECURE_ORIGIN_REQUIRED
                this.showError('Location access denied or requires secure connection. Please search for a city instead.');
            } else if (error.code === 2) {
                // POSITION_UNAVAILABLE
                this.showError('Location information unavailable. Please search for a city instead.');
            } else if (error.code === 3) {
                // TIMEOUT
                this.showError('Location request timed out. Please search for a city instead.');
            } else {
                this.showError('Unable to get your location. Please search for a city instead.');
            }
        }
    }

    getCurrentPositionPromise() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
    }

    async searchCity(cityName = null) {
        const city = cityName || this.elements.cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        // Check API health first
        const isApiHealthy = await this.checkApiHealth();
        if (!isApiHealthy) {
            this.showError('Weather service is currently unavailable. Please try again later.');
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/weather/city/${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'City not found');
            }

            const data = await response.json();
            this.displayWeatherData(data);
        } catch (error) {
            console.error('Search error:', error);
            
            // Handle JSON parsing errors
            if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
                this.showError('Server returned invalid data. Please try again or check if the backend is running.');
            } else {
                this.showError(error.message || 'Failed to fetch weather data');
            }
        }
    }

    async fetchWeatherByCoords(latitude, longitude, favoriteLocation = null) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/weather/current?latitude=${latitude}&longitude=${longitude}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            
            // Use favorite location data if provided, otherwise create a mock location object
            const locationData = {
                location: favoriteLocation ? {
                    name: favoriteLocation.name,
                    country: favoriteLocation.country,
                    latitude: favoriteLocation.latitude,
                    longitude: favoriteLocation.longitude
                } : {
                    name: 'Current Location',
                    country: 'Unknown',
                    latitude,
                    longitude
                },
                weather: data
            };
            
            this.displayWeatherData(locationData);
        } catch (error) {
            console.error('Weather fetch error:', error);
            
            // Handle JSON parsing errors
            if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
                this.showError('Server returned invalid data. Please try again or check if the backend is running.');
            } else {
                this.showError('Failed to fetch weather data');
            }
        }
    }

    displayWeatherData(data) {
        this.weatherData = data;
        const { location, weather } = data;
        const current = weather.current;

        // Update location info
        this.elements.locationName.textContent = location.name;
        this.elements.locationCountry.textContent = location.country;
        this.elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

        // Update current weather (convert to Fahrenheit)
        this.elements.currentTemp.textContent = `${Math.round(this.celsiusToFahrenheit(current.temperature_2m))}°F`;
        this.elements.weatherDesc.textContent = this.getWeatherDescription(current.weather_code);
        this.elements.feelsLike.textContent = `Feels like ${Math.round(this.celsiusToFahrenheit(current.apparent_temperature))}°F`;

        // Update weather icon
        this.elements.weatherIcon.className = this.getWeatherIcon(current.weather_code, current.is_day);

        // Update weather details
        this.elements.visibility.textContent = `${current.visibility || 'N/A'} km`;
        this.elements.humidity.textContent = `${current.relative_humidity_2m}%`;
        this.elements.windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        this.elements.pressure.textContent = `${current.pressure_msl} hPa`;
        this.elements.cloudCover.textContent = `${current.cloud_cover}%`;
        this.elements.dewPoint.textContent = `${Math.round(this.celsiusToFahrenheit(current.dewpoint_2m || 0))}°F`;

        // Update aviation conditions
        this.updateAviationConditions(current);

        // Update forecast
        this.updateForecast(weather.daily);

        // Show add favorite button
        this.elements.addFavoriteBtn.style.display = 'flex';
        this.elements.addFavoriteBtn.classList.remove('added');
        this.elements.addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';

        this.showWeatherContent();
    }

    updateAviationConditions(current) {
        // Flight visibility assessment
        const visibility = current.visibility || 10;
        let visibilityStatus = 'Excellent';
        if (visibility < 1) visibilityStatus = 'Poor';
        else if (visibility < 3) visibilityStatus = 'Marginal';
        else if (visibility < 5) visibilityStatus = 'Fair';
        else if (visibility < 10) visibilityStatus = 'Good';
        
        this.elements.flightVisibility.textContent = visibilityStatus;

        // Precipitation assessment
        const precip = current.precipitation || 0;
        let precipStatus = 'None';
        if (precip > 0.1) precipStatus = 'Light';
        if (precip > 2.5) precipStatus = 'Moderate';
        if (precip > 7.5) precipStatus = 'Heavy';
        
        this.elements.precipitation.textContent = precipStatus;

        // Wind conditions assessment
        const windSpeed = current.wind_speed_10m || 0;
        let windStatus = 'Calm';
        if (windSpeed > 5) windStatus = 'Light';
        if (windSpeed > 15) windStatus = 'Moderate';
        if (windSpeed > 25) windStatus = 'Strong';
        if (windSpeed > 40) windStatus = 'Very Strong';
        
        this.elements.windConditions.textContent = windStatus;
    }

    updateForecast(dailyData) {
        if (!dailyData) return;

        const { time, temperature_2m_max, temperature_2m_min, weather_code } = dailyData;
        
        this.elements.forecastContainer.innerHTML = '';

        for (let i = 0; i < Math.min(3, time.length); i++) {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            const date = new Date(time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            forecastCard.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <div class="forecast-icon">
                    <i class="${this.getWeatherIcon(weather_code[i], 1)}"></i>
                </div>
                <div class="forecast-temps">
                    <span class="forecast-temp-max">${Math.round(this.celsiusToFahrenheit(temperature_2m_max[i]))}°F</span>
                    <span class="forecast-temp-min">${Math.round(this.celsiusToFahrenheit(temperature_2m_min[i]))}°F</span>
                </div>
            `;
            
            this.elements.forecastContainer.appendChild(forecastCard);
        }
    }

    getWeatherIcon(weatherCode, isDay = 1) {
        const icons = {
            0: isDay ? 'fas fa-sun' : 'fas fa-moon',
            1: isDay ? 'fas fa-sun' : 'fas fa-moon',
            2: isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon',
            3: 'fas fa-cloud',
            45: 'fas fa-smog',
            48: 'fas fa-smog',
            51: 'fas fa-cloud-rain',
            53: 'fas fa-cloud-rain',
            55: 'fas fa-cloud-rain',
            61: 'fas fa-cloud-rain',
            63: 'fas fa-cloud-rain',
            65: 'fas fa-cloud-rain',
            71: 'fas fa-snowflake',
            73: 'fas fa-snowflake',
            75: 'fas fa-snowflake',
            77: 'fas fa-snowflake',
            80: 'fas fa-cloud-rain',
            81: 'fas fa-cloud-rain',
            82: 'fas fa-cloud-rain',
            85: 'fas fa-snowflake',
            86: 'fas fa-snowflake',
            95: 'fas fa-bolt',
            96: 'fas fa-bolt',
            99: 'fas fa-bolt'
        };
        
        return icons[weatherCode] || 'fas fa-cloud';
    }

    getWeatherDescription(weatherCode) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        
        return descriptions[weatherCode] || 'Unknown';
    }

    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherContent.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.remove('hidden');
        this.elements.weatherContent.classList.add('hidden');
    }

    showWeatherContent() {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherContent.classList.remove('hidden');
    }

    // Temperature conversion utility
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    // Sidebar functionality
    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('sidebar-collapsed');
    }

    // Favorites functionality
    async loadFavorites() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/favorites`);
            if (response.ok) {
                const data = await response.json();
                this.displayFavorites(data.favorites);
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    }

    displayFavorites(favorites) {
        this.elements.favoritesList.innerHTML = '';
        
        if (favorites.length === 0) {
            this.elements.favoritesList.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    <i class="fas fa-heart" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>No favorites yet</p>
                    <p style="font-size: 0.9rem;">Search for a city and add it to favorites!</p>
                </div>
            `;
            return;
        }

        favorites.forEach(favorite => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <div class="favorite-item-header">
                    <div>
                        <div class="favorite-item-title">${favorite.name}</div>
                        <div class="favorite-item-country">${favorite.country}</div>
                    </div>
                    <button class="favorite-item-remove" onclick="event.stopPropagation(); weatherApp.removeFavorite('${favorite.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="favorite-item-coords">${favorite.latitude.toFixed(4)}, ${favorite.longitude.toFixed(4)}</div>
                ${favorite.note ? `<div class="favorite-item-note">"${favorite.note}"</div>` : ''}
                <div class="favorite-item-date">Added ${new Date(favorite.createdAt).toLocaleDateString()}</div>
            `;
            
            favoriteItem.addEventListener('click', () => this.loadFavoriteWeather(favorite));
            this.elements.favoritesList.appendChild(favoriteItem);
        });
    }

    async loadFavoriteWeather(favorite) {
        this.showLoading();
        try {
            await this.fetchWeatherByCoords(favorite.latitude, favorite.longitude, favorite);
            this.toggleSidebar(); // Close sidebar after loading
        } catch (error) {
            console.error('Failed to load favorite weather:', error);
            this.showError('Failed to load weather for this location');
        }
    }

    async addCurrentLocationToFavorites() {
        if (!this.weatherData || !this.weatherData.location) {
            this.showError('No location data available to add to favorites');
            return;
        }

        const location = this.weatherData.location;
        const note = prompt('Add a note for this location (optional):') || '';

        try {
            const response = await fetch(`${this.apiBaseUrl}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: location.name,
                    country: location.country,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    note: note
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.elements.addFavoriteBtn.classList.add('added');
                this.elements.addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites';
                this.loadFavorites(); // Refresh favorites list
            } else {
                const errorData = await response.json();
                if (response.status === 409) {
                    this.showError('This location is already in your favorites');
                } else {
                    this.showError(errorData.error || 'Failed to add to favorites');
                }
            }
        } catch (error) {
            console.error('Failed to add favorite:', error);
            this.showError('Failed to add to favorites');
        }
    }

    async removeFavorite(id) {
        if (!confirm('Are you sure you want to remove this favorite?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/favorites/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.loadFavorites(); // Refresh favorites list
            } else {
                this.showError('Failed to remove favorite');
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            this.showError('Failed to remove favorite');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
