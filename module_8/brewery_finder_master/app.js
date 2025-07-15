// Brewery Finder Application
class BreweryFinder {
    constructor() {
        this.currentPage = 1;
        this.resultsPerPage = 12;
        this.currentResults = [];
        this.searchHistory = this.loadSearchHistory();
        this.debounceTimer = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateSearchHistory();
    }

    // Initialize DOM elements
    initializeElements() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchSpinner = document.getElementById('searchSpinner');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.resultsTitle = document.getElementById('resultsTitle');
        this.resultsCount = document.getElementById('resultsCount');
        this.noResults = document.getElementById('noResults');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorDetails = document.getElementById('errorDetails');
        this.loadingState = document.getElementById('loadingState');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.pageInfo = document.getElementById('pageInfo');
        this.searchHistoryElement = document.getElementById('searchHistory');
        this.historyList = document.getElementById('historyList');
    }

    // Bind event listeners
    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        this.searchInput.addEventListener('input', (e) => this.handleInputChange(e));
        this.prevPageBtn.addEventListener('click', () => this.previousPage());
        this.nextPageBtn.addEventListener('click', () => this.nextPage());
        
        // Search type toggle
        document.querySelectorAll('input[name="searchType"]').forEach(radio => {
            radio.addEventListener('change', () => this.updatePlaceholder());
        });
    }

    // Handle search form submission
    async handleSearch(e) {
        e.preventDefault();
        
        const query = this.searchInput.value.trim();
        const searchType = document.querySelector('input[name="searchType"]:checked').value;
        
        if (query.length < 2) {
            this.showError('Please enter at least 2 characters to search.');
            return;
        }

        await this.performSearch(query, searchType);
    }

    // Handle input changes with debouncing
    handleInputChange(e) {
        const query = e.target.value.trim();
        
        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Set new timer for debounced search
        if (query.length >= 2) {
            this.debounceTimer = setTimeout(() => {
                const searchType = document.querySelector('input[name="searchType"]:checked').value;
                this.performSearch(query, searchType);
            }, 500); // 500ms delay
        }
    }

    // Perform the actual search
    async performSearch(query, searchType) {
        try {
            this.showLoading();
            this.hideError();
            this.hideResults();

            const url = this.buildSearchUrl(query, searchType);
            console.log('🔍 Searching:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📊 Results received:', data.length, 'breweries');

            this.currentResults = data;
            this.currentPage = 1;
            
            // Add to search history
            this.addToSearchHistory(query, searchType);
            
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showError('An error occurred while searching. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    // Build search URL with parameters
    buildSearchUrl(query, searchType) {
        const baseUrl = 'https://api.openbrewerydb.org/v1/breweries';
        const params = new URLSearchParams();
        
        params.append(searchType, query);
        params.append('per_page', '50'); // Get more results for pagination
        
        return `${baseUrl}?${params.toString()}`;
    }

    // Display search results
    displayResults() {
        if (this.currentResults.length === 0) {
            this.showNoResults();
            return;
        }

        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = this.currentResults.slice(startIndex, endIndex);

        this.resultsTitle.textContent = `Search Results`;
        this.resultsCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, this.currentResults.length)} of ${this.currentResults.length} breweries`;
        
        this.renderResults(pageResults);
        this.updatePagination();
        this.showResults();
    }

    // Render brewery cards
    renderResults(breweries) {
        this.resultsGrid.innerHTML = '';
        
        breweries.forEach(brewery => {
            const card = this.createBreweryCard(brewery);
            this.resultsGrid.appendChild(card);
        });
    }

    // Create individual brewery card
    createBreweryCard(brewery) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 fade-in';
        
        const card = document.createElement('div');
        card.className = 'card brewery-card h-100 shadow-sm';
        
        const breweryType = this.getBreweryTypeBadge(brewery.brewery_type);
        const website = brewery.website_url ? 
            `<a href="${brewery.website_url}" class="website-link" target="_blank">Visit Website</a>` : 
            '<span class="text-muted">No website</span>';
        
        const phone = brewery.phone ? 
            `<div class="phone-number">📞 ${this.formatPhone(brewery.phone)}</div>` : 
            '<div class="text-muted">📞 No phone</div>';
        
        const address = this.formatAddress(brewery);
        
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">${brewery.name}</h5>
                    ${breweryType}
                </div>
                <div class="address mb-2">📍 ${address}</div>
                ${phone}
                <div class="mt-3">
                    ${website}
                </div>
            </div>
        `;
        
        col.appendChild(card);
        return col;
    }

    // Get brewery type badge
    getBreweryTypeBadge(type) {
        if (!type) return '';
        
        const typeClass = type.toLowerCase();
        const displayName = type.charAt(0).toUpperCase() + type.slice(1);
        
        return `<span class="brewery-type ${typeClass}">${displayName}</span>`;
    }

    // Format phone number
    formatPhone(phone) {
        if (!phone) return '';
        
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        
        return phone;
    }

    // Format address
    formatAddress(brewery) {
        const parts = [];
        
        if (brewery.address_1) parts.push(brewery.address_1);
        if (brewery.city) parts.push(brewery.city);
        if (brewery.state) parts.push(brewery.state);
        if (brewery.postal_code) parts.push(brewery.postal_code);
        
        return parts.join(', ');
    }

    // Update pagination controls
    updatePagination() {
        const totalPages = Math.ceil(this.currentResults.length / this.resultsPerPage);
        
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= totalPages;
        
        this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    // Navigation methods
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayResults();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.currentResults.length / this.resultsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayResults();
        }
    }

    // Search history methods
    addToSearchHistory(query, searchType) {
        const searchItem = { query, searchType, timestamp: Date.now() };
        
        // Remove duplicate if exists
        this.searchHistory = this.searchHistory.filter(item => 
            !(item.query === query && item.searchType === searchType)
        );
        
        // Add to beginning
        this.searchHistory.unshift(searchItem);
        
        // Keep only last 10 searches
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
        
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    updateSearchHistory() {
        if (this.searchHistory.length === 0) {
            this.hideSearchHistory();
            return;
        }

        this.historyList.innerHTML = '';
        
        this.searchHistory.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'history-btn';
            btn.textContent = `${item.query} (${item.searchType.replace('by_', '')})`;
            btn.addEventListener('click', () => {
                this.searchInput.value = item.query;
                document.querySelector(`input[value="${item.searchType}"]`).checked = true;
                this.updatePlaceholder();
                this.performSearch(item.query, item.searchType);
            });
            
            this.historyList.appendChild(btn);
        });
        
        this.showSearchHistory();
    }

    // Local storage methods
    saveSearchHistory() {
        localStorage.setItem('brewerySearchHistory', JSON.stringify(this.searchHistory));
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('brewerySearchHistory');
        return saved ? JSON.parse(saved) : [];
    }

    // Update placeholder based on search type
    updatePlaceholder() {
        const searchType = document.querySelector('input[name="searchType"]:checked').value;
        const placeholder = searchType === 'by_name' ? 
            'Enter brewery name...' : 
            'Enter city name...';
        this.searchInput.placeholder = placeholder;
    }

    // UI state methods
    showLoading() {
        this.loadingState.classList.remove('d-none');
        this.searchSpinner.classList.remove('d-none');
    }

    hideLoading() {
        this.loadingState.classList.add('d-none');
        this.searchSpinner.classList.add('d-none');
    }

    showResults() {
        this.resultsSection.classList.remove('d-none');
    }

    hideResults() {
        this.resultsSection.classList.add('d-none');
    }

    showNoResults() {
        this.noResults.classList.remove('d-none');
        this.resultsSection.classList.remove('d-none');
    }

    hideNoResults() {
        this.noResults.classList.add('d-none');
    }

    showError(message) {
        this.errorDetails.textContent = message;
        this.errorMessage.classList.remove('d-none');
    }

    hideError() {
        this.errorMessage.classList.add('d-none');
    }

    showSearchHistory() {
        this.searchHistoryElement.classList.remove('d-none');
    }

    hideSearchHistory() {
        this.searchHistoryElement.classList.add('d-none');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍺 Brewery Finder initialized');
    new BreweryFinder();
}); 