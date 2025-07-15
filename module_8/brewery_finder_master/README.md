# 🍺 Brewery Finder

A modern, responsive web application for discovering breweries across the United States. Built with vanilla JavaScript, Bootstrap 5, and the Open Brewery DB API.

## ✨ Features

### 🔍 Search Functionality
- **Dual Search Modes**: Search by brewery name OR city (toggleable)
- **Real-time Search**: Debounced input with automatic search after 500ms
- **Smart Validation**: Minimum 2 characters required
- **Search History**: Recent searches saved to local storage

### 📊 Results Display
- **Responsive Grid**: 12 results per page with pagination
- **Brewery Cards**: Clean, informative cards with hover effects
- **Detailed Information**: Name, type, address, phone, website
- **Type Badges**: Color-coded brewery type indicators
- **Pagination Controls**: Previous/Next navigation with page info

### 🛡️ Error Handling & Validation
- **Input Validation**: Required fields and minimum character limits
- **API Error Handling**: Network errors, server errors, timeouts
- **User-Friendly Messages**: Clear error messages and guidance
- **Loading States**: Spinners and loading indicators
- **No Results Handling**: Helpful messages when no breweries found

### 🎨 User Experience
- **Modern Design**: Clean, professional interface with Bootstrap 5
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, fade-ins, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized with debouncing and efficient DOM updates

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start searching for breweries!

### File Structure
```
brewery_finder_master/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── app.js             # Main JavaScript application
└── README.md          # This documentation
```

## 🛠️ Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Custom styling, animations, responsive design
- **Vanilla JavaScript**: ES6+ features, async/await, classes
- **Bootstrap 5**: UI components and responsive grid system

### Key JavaScript Concepts
- **ES6 Classes**: Object-oriented programming with `BreweryFinder` class
- **Async/Await**: Modern promise handling for API calls
- **Event Handling**: Form submission, input changes, pagination
- **DOM Manipulation**: Dynamic content creation and updates
- **Local Storage**: Persistent search history
- **Debouncing**: Performance optimization for search inputs

### API Integration
- **Open Brewery DB**: Free, public API for brewery data
- **Fetch API**: Modern HTTP requests with error handling
- **URL Parameters**: Dynamic query construction
- **Response Processing**: JSON parsing and data formatting

## 📱 Usage Guide

### Basic Search
1. Choose search type (by name or by city)
2. Enter at least 2 characters in the search box
3. Results will appear automatically or click the search button
4. Use pagination to browse through results

### Search History
- Recent searches are automatically saved
- Click on any history item to repeat the search
- History persists between browser sessions

### Brewery Information
Each brewery card displays:
- **Name**: Brewery name
- **Type**: Micro, brewpub, large, regional, etc.
- **Address**: Full address with city, state, zip
- **Phone**: Formatted phone number (if available)
- **Website**: Direct link to brewery website (if available)

## 🎯 Learning Objectives

This project demonstrates:

### API Integration
- Working with external APIs
- URL parameter construction
- Response handling and data parsing
- Error handling for network requests

### DOM Manipulation
- Dynamic content creation
- Event handling and listeners
- Form validation and submission
- State management

### Modern JavaScript
- ES6+ features and syntax
- Async/await for API calls
- Class-based architecture
- Local storage for persistence

### User Experience
- Responsive design principles
- Loading states and feedback
- Error handling and validation
- Performance optimization

## 🔧 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- Bootstrap classes can be customized or extended
- Animation timings and effects can be adjusted

### Functionality
- Change `resultsPerPage` in the JavaScript for different pagination
- Modify debounce timing in `handleInputChange()`
- Add new search filters or sorting options
- Extend brewery card information display

### API Integration
- The app uses the Open Brewery DB API
- API endpoints and parameters can be modified
- Additional API features can be integrated

## 🐛 Troubleshooting

### Common Issues
- **No results found**: Try different search terms or cities
- **API errors**: Check internet connection and try again
- **Search not working**: Ensure at least 2 characters are entered
- **Pagination issues**: Refresh the page and try again

### Browser Compatibility
- Modern browsers with ES6+ support required
- Local storage must be enabled
- JavaScript must be enabled

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Open Brewery DB**: For providing the free brewery data API
- **Bootstrap**: For the responsive UI framework
- **Vanilla JavaScript Community**: For modern JavaScript practices

## 🚀 Future Enhancements

Potential features for future versions:
- Advanced filtering (by state, brewery type)
- Sorting options (by name, city, type)
- Favorites system with local storage
- Map integration showing brewery locations
- Export functionality for search results
- Dark mode theme
- Offline support with service workers

---

**Built with ❤️ using Vanilla JavaScript & Bootstrap** 