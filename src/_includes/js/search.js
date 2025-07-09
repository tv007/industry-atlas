// Search functionality for Industry Atlas
(function() {
  'use strict';

  // Search state
  const searchState = {
    query: '',
    filters: {},
    history: [],
    suggestions: [],
    isSearching: false
  };

  // Search configuration
  const searchConfig = {
    minQueryLength: 2,
    maxSuggestions: 10,
    maxHistory: 10,
    debounceDelay: 300
  };

  // Initialize search
  function initSearch() {
    loadSearchHistory();
    setupSearchEventListeners();
    setupSearchUI();
  }

  // Setup search event listeners
  function setupSearchEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    if (searchInput) {
      // Input event for real-time search
      searchInput.addEventListener('input', debounce(handleSearchInput, searchConfig.debounceDelay));
      
      // Focus event for showing suggestions
      searchInput.addEventListener('focus', showSearchSuggestions);
      
      // Blur event for hiding suggestions
      searchInput.addEventListener('blur', () => {
        setTimeout(hideSearchSuggestions, 200);
      });
      
      // Key events
      searchInput.addEventListener('keydown', handleSearchKeydown);
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', performSearch);
    }

    // Click outside to close search results
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        hideSearchSuggestions();
      }
    });
  }

  // Setup search UI
  function setupSearchUI() {
    const searchContainer = document.querySelector('.search-box');
    if (!searchContainer) return;

    // Create suggestions dropdown
    const suggestionsDropdown = document.createElement('div');
    suggestionsDropdown.className = 'search-suggestions';
    suggestionsDropdown.id = 'search-suggestions';
    searchContainer.appendChild(suggestionsDropdown);

    // Create search filters
    createSearchFilters();
  }

  // Create search filters
  function createSearchFilters() {
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'search-filters';
    filtersContainer.id = 'search-filters';

    const filterTypes = [
      { id: 'type', label: 'Type', options: ['All', 'Industry', 'Sector', 'Company', 'Technology'] },
      { id: 'jurisdiction', label: 'Jurisdiction', options: ['All', 'Global', 'US', 'EU', 'Asia'] },
      { id: 'timeframe', label: 'Timeframe', options: ['All', '1Y', '5Y', '10Y'] }
    ];

    filterTypes.forEach(filter => {
      const filterGroup = document.createElement('div');
      filterGroup.className = 'search-filter-group';
      
      const label = document.createElement('label');
      label.textContent = filter.label;
      label.htmlFor = `search-filter-${filter.id}`;
      
      const select = document.createElement('select');
      select.id = `search-filter-${filter.id}`;
      select.className = 'search-filter-select';
      
      filter.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase();
        optionElement.textContent = option;
        select.appendChild(optionElement);
      });
      
      select.addEventListener('change', () => {
        searchState.filters[filter.id] = select.value;
        if (searchState.query) {
          performSearch();
        }
      });
      
      filterGroup.appendChild(label);
      filterGroup.appendChild(select);
      filtersContainer.appendChild(filterGroup);
    });

    // Insert filters after search box
    const searchBox = document.querySelector('.search-box');
    if (searchBox && searchBox.parentNode) {
      searchBox.parentNode.insertBefore(filtersContainer, searchBox.nextSibling);
    }
  }

  // Handle search input
  function handleSearchInput(event) {
    const query = event.target.value.trim();
    searchState.query = query;

    if (query.length >= searchConfig.minQueryLength) {
      generateSuggestions(query);
      showSearchSuggestions();
    } else {
      hideSearchSuggestions();
      clearSearchResults();
    }
  }

  // Handle search keydown
  function handleSearchKeydown(event) {
    const suggestions = document.querySelectorAll('.search-suggestion-item');
    const activeSuggestion = document.querySelector('.search-suggestion-item.active');
    let currentIndex = -1;

    if (activeSuggestion) {
      currentIndex = Array.from(suggestions).indexOf(activeSuggestion);
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < suggestions.length - 1) {
          if (activeSuggestion) activeSuggestion.classList.remove('active');
          suggestions[currentIndex + 1].classList.add('active');
        }
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          if (activeSuggestion) activeSuggestion.classList.remove('active');
          suggestions[currentIndex - 1].classList.add('active');
        }
        break;
      
      case 'Enter':
        event.preventDefault();
        if (activeSuggestion) {
          selectSuggestion(activeSuggestion);
        } else {
          performSearch();
        }
        break;
      
      case 'Escape':
        hideSearchSuggestions();
        break;
    }
  }

  // Generate search suggestions
  function generateSuggestions(query) {
    const suggestions = [];
    
    // Industry suggestions
    const industries = [
      { id: 'energy', name: 'Energy', type: 'Industry', description: 'Power generation and distribution' },
      { id: 'technology', name: 'Technology', type: 'Industry', description: 'Software and hardware development' },
      { id: 'healthcare', name: 'Healthcare', type: 'Industry', description: 'Medical services and pharmaceuticals' },
      { id: 'finance', name: 'Finance', type: 'Industry', description: 'Banking and financial services' },
      { id: 'manufacturing', name: 'Manufacturing', type: 'Industry', description: 'Industrial production' },
      { id: 'retail', name: 'Retail', type: 'Industry', description: 'Consumer goods and services' },
      { id: 'transportation', name: 'Transportation', type: 'Industry', description: 'Logistics and mobility' },
      { id: 'agriculture', name: 'Agriculture', type: 'Industry', description: 'Farming and food production' }
    ];

    // Sector suggestions
    const sectors = [
      { id: 'renewable-energy', name: 'Renewable Energy', type: 'Sector', description: 'Solar, wind, and hydro power' },
      { id: 'artificial-intelligence', name: 'Artificial Intelligence', type: 'Sector', description: 'Machine learning and automation' },
      { id: 'biotechnology', name: 'Biotechnology', type: 'Sector', description: 'Genetic engineering and biotech' },
      { id: 'blockchain', name: 'Blockchain', type: 'Sector', description: 'Distributed ledger technology' },
      { id: 'electric-vehicles', name: 'Electric Vehicles', type: 'Sector', description: 'EV manufacturing and infrastructure' }
    ];

    // Technology suggestions
    const technologies = [
      { id: 'machine-learning', name: 'Machine Learning', type: 'Technology', description: 'AI and predictive analytics' },
      { id: 'cloud-computing', name: 'Cloud Computing', type: 'Technology', description: 'Distributed computing services' },
      { id: 'iot', name: 'Internet of Things', type: 'Technology', description: 'Connected devices and sensors' },
      { id: '5g', name: '5G Networks', type: 'Technology', description: 'Next-generation wireless technology' },
      { id: 'quantum-computing', name: 'Quantum Computing', type: 'Technology', description: 'Quantum information processing' }
    ];

    const allItems = [...industries, ...sectors, ...technologies];
    
    // Filter by query and search state filters
    const filteredItems = allItems.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
                          item.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesFilters = !searchState.filters.type || 
                           searchState.filters.type === 'all' || 
                           item.type.toLowerCase() === searchState.filters.type;
      
      return matchesQuery && matchesFilters;
    });

    // Add to suggestions
    suggestions.push(...filteredItems.slice(0, searchConfig.maxSuggestions));

    // Add search history if query matches
    const historyMatches = searchState.history.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
    
    if (historyMatches.length > 0) {
      suggestions.unshift({
        id: 'history',
        name: `Recent: ${historyMatches[0]}`,
        type: 'History',
        description: 'From your search history'
      });
    }

    searchState.suggestions = suggestions;
    renderSuggestions();
  }

  // Render search suggestions
  function renderSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    if (searchState.suggestions.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="search-suggestion-item no-results">
          <span>No suggestions found</span>
        </div>
      `;
      return;
    }

    const suggestionsHtml = searchState.suggestions.map((suggestion, index) => `
      <div class="search-suggestion-item ${index === 0 ? 'active' : ''}" 
           data-suggestion='${JSON.stringify(suggestion)}'>
        <div class="suggestion-content">
          <div class="suggestion-title">${suggestion.name}</div>
          <div class="suggestion-description">${suggestion.description}</div>
        </div>
        <div class="suggestion-type">
          <span class="badge badge-${getTypeBadgeClass(suggestion.type)}">${suggestion.type}</span>
        </div>
      </div>
    `).join('');

    suggestionsContainer.innerHTML = suggestionsHtml;

    // Add click listeners
    suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
      item.addEventListener('click', () => selectSuggestion(item));
      item.addEventListener('mouseenter', () => {
        suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // Select a suggestion
  function selectSuggestion(suggestionElement) {
    const suggestion = JSON.parse(suggestionElement.dataset.suggestion);
    
    if (suggestion.id === 'history') {
      // Handle history selection
      const query = suggestion.name.replace('Recent: ', '');
      document.getElementById('search-input').value = query;
      searchState.query = query;
      performSearch();
    } else {
      // Navigate to the item
      navigateToItem(suggestion);
    }
    
    hideSearchSuggestions();
  }

  // Navigate to search item
  function navigateToItem(item) {
    let url = '';
    
    switch (item.type) {
      case 'Industry':
        url = `/industry/${item.id}`;
        break;
      case 'Sector':
        url = `/sector/${item.id}`;
        break;
      case 'Technology':
        url = `/technology/${item.id}`;
        break;
      default:
        url = `/search?q=${encodeURIComponent(item.name)}`;
    }
    
    window.location.href = url;
  }

  // Perform search
  function performSearch() {
    if (!searchState.query.trim()) return;

    searchState.isSearching = true;
    showSearchLoading();

    // Add to search history
    addToSearchHistory(searchState.query);

    // Simulate API call
    setTimeout(() => {
      const results = executeSearch(searchState.query, searchState.filters);
      displaySearchResults(results);
      searchState.isSearching = false;
    }, 500);
  }

  // Execute search (mock implementation)
  function executeSearch(query, filters) {
    const allData = [
      { id: 'energy', name: 'Energy Industry', type: 'Industry', description: 'Power generation and distribution', relevance: 0.95 },
      { id: 'renewable-energy', name: 'Renewable Energy', type: 'Sector', description: 'Solar, wind, and hydro power', relevance: 0.92 },
      { id: 'tesla', name: 'Tesla Inc.', type: 'Company', description: 'Electric vehicle and clean energy company', relevance: 0.88 },
      { id: 'solar-power', name: 'Solar Power Technology', type: 'Technology', description: 'Photovoltaic energy generation', relevance: 0.85 },
      { id: 'wind-energy', name: 'Wind Energy', type: 'Sector', description: 'Wind turbine power generation', relevance: 0.82 }
    ];

    return allData.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) ||
                          item.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesFilters = !filters.type || filters.type === 'all' || 
                           item.type.toLowerCase() === filters.type;
      
      return matchesQuery && matchesFilters;
    }).sort((a, b) => b.relevance - a.relevance);
  }

  // Display search results
  function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-results-empty">
          <h3>No results found for "${searchState.query}"</h3>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      `;
      return;
    }

    const resultsHtml = `
      <div class="search-results-header">
        <h3>Search Results for "${searchState.query}"</h3>
        <span class="results-count">${results.length} results found</span>
      </div>
      <div class="search-results-list">
        ${results.map(result => `
          <div class="search-result-item">
            <div class="result-header">
              <div class="result-title">
                <a href="/${result.type.toLowerCase()}/${result.id}">${result.name}</a>
              </div>
              <div class="result-type">
                <span class="badge badge-${getTypeBadgeClass(result.type)}">${result.type}</span>
              </div>
            </div>
            <div class="result-description">${result.description}</div>
            <div class="result-meta">
              <span class="relevance">Relevance: ${Math.round(result.relevance * 100)}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    resultsContainer.innerHTML = resultsHtml;
  }

  // Show search loading
  function showSearchLoading() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-loading">
          <div class="loading-spinner"></div>
          <p>Searching for "${searchState.query}"...</p>
        </div>
      `;
    }
  }

  // Clear search results
  function clearSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  // Show search suggestions
  function showSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer && searchState.suggestions.length > 0) {
      suggestionsContainer.style.display = 'block';
    }
  }

  // Hide search suggestions
  function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
      suggestionsContainer.style.display = 'none';
    }
  }

  // Add to search history
  function addToSearchHistory(query) {
    if (!searchState.history.includes(query)) {
      searchState.history.unshift(query);
      searchState.history = searchState.history.slice(0, searchConfig.maxHistory);
      saveSearchHistory();
    }
  }

  // Load search history
  function loadSearchHistory() {
    try {
      const history = localStorage.getItem('industryAtlasSearchHistory');
      if (history) {
        searchState.history = JSON.parse(history);
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }

  // Save search history
  function saveSearchHistory() {
    try {
      localStorage.setItem('industryAtlasSearchHistory', JSON.stringify(searchState.history));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  // Get type badge class
  function getTypeBadgeClass(type) {
    switch (type.toLowerCase()) {
      case 'industry': return 'primary';
      case 'sector': return 'secondary';
      case 'company': return 'success';
      case 'technology': return 'warning';
      case 'history': return 'info';
      default: return 'secondary';
    }
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Expose search functions globally
  window.SearchManager = {
    initSearch,
    performSearch,
    clearSearchResults,
    getSearchHistory: () => searchState.history,
    clearSearchHistory: () => {
      searchState.history = [];
      saveSearchHistory();
    }
  };

  // Initialize search when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }

})(); 