// Main JavaScript for Industry Atlas
(function() {
  'use strict';

  // Global state
  const state = {
    currentIndustry: null,
    currentJurisdiction: 'global',
    currentTimeframe: '1y',
    searchQuery: '',
    filters: {}
  };

  // Initialize the application
  function init() {
    setupEventListeners();
    setupFilters();
    setupSearch();
    setupCharts();
    setupNavigation();
    
    // Load initial data
    loadInitialData();
  }

  // Setup event listeners
  function setupEventListeners() {
    // Filter changes
    document.getElementById('industry-filter')?.addEventListener('change', handleIndustryFilter);
    document.getElementById('jurisdiction-filter')?.addEventListener('change', handleJurisdictionFilter);
    document.getElementById('timeframe-filter')?.addEventListener('change', handleTimeframeFilter);
    
    // Search
    document.getElementById('search-btn')?.addEventListener('click', handleSearch);
    document.getElementById('search-input')?.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Setup filters
  function setupFilters() {
    // Load saved filters from localStorage
    const savedFilters = localStorage.getItem('industryAtlasFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        state.filters = { ...state.filters, ...filters };
        
        // Apply saved filters to UI
        if (filters.industry) {
          const industrySelect = document.getElementById('industry-filter');
          if (industrySelect) {
            industrySelect.value = filters.industry;
          }
        }
        
        if (filters.jurisdiction) {
          const jurisdictionSelect = document.getElementById('jurisdiction-filter');
          if (jurisdictionSelect) {
            jurisdictionSelect.value = filters.jurisdiction;
          }
        }
        
        if (filters.timeframe) {
          const timeframeSelect = document.getElementById('timeframe-filter');
          if (timeframeSelect) {
            timeframeSelect.value = filters.timeframe;
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved filters:', e);
      }
    }
  }

  // Setup search functionality
  function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      // Debounced search
      let searchTimeout;
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const query = this.value.trim();
          if (query.length >= 2) {
            performSearch(query);
          } else if (query.length === 0) {
            clearSearchResults();
          }
        }, 300);
      });
    }
  }

  // Setup charts
  function setupCharts() {
    // Initialize any charts on the page
    const chartElements = document.querySelectorAll('[data-chart]');
    chartElements.forEach(element => {
      initializeChart(element);
    });
  }

  // Setup navigation
  function setupNavigation() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // Load initial data
  function loadInitialData() {
    // Load industries data for filters
    loadIndustriesData();
    
    // Load trends data if on trends page
    if (window.location.pathname.includes('/trends')) {
      loadTrendsData();
    }
    
    // Load academic data if on academics page
    if (window.location.pathname.includes('/academics')) {
      loadAcademicData();
    }
  }

  // Handle industry filter change
  function handleIndustryFilter(event) {
    const industry = event.target.value;
    state.currentIndustry = industry;
    state.filters.industry = industry;
    
    saveFilters();
    updatePageContent();
  }

  // Handle jurisdiction filter change
  function handleJurisdictionFilter(event) {
    const jurisdiction = event.target.value;
    state.currentJurisdiction = jurisdiction;
    state.filters.jurisdiction = jurisdiction;
    
    saveFilters();
    updatePageContent();
  }

  // Handle timeframe filter change
  function handleTimeframeFilter(event) {
    const timeframe = event.target.value;
    state.currentTimeframe = timeframe;
    state.filters.timeframe = timeframe;
    
    saveFilters();
    updatePageContent();
  }

  // Handle search
  function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput?.value.trim();
    
    if (query) {
      performSearch(query);
    }
  }

  // Perform search
  function performSearch(query) {
    state.searchQuery = query;
    
    // Show loading state
    showSearchLoading();
    
    // Simulate search (replace with actual API call)
    setTimeout(() => {
      const results = mockSearch(query);
      displaySearchResults(results);
    }, 500);
  }

  // Mock search function (replace with actual API)
  function mockSearch(query) {
    const industries = [
      { id: 'energy', name: 'Energy', description: 'Power generation and distribution' },
      { id: 'technology', name: 'Technology', description: 'Software and hardware development' },
      { id: 'healthcare', name: 'Healthcare', description: 'Medical services and pharmaceuticals' },
      { id: 'finance', name: 'Finance', description: 'Banking and financial services' },
      { id: 'manufacturing', name: 'Manufacturing', description: 'Industrial production' }
    ];
    
    return industries.filter(industry => 
      industry.name.toLowerCase().includes(query.toLowerCase()) ||
      industry.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Display search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    if (!searchResultsContainer) return;
    
    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="alert alert-info">
          No results found for "${state.searchQuery}"
        </div>
      `;
      return;
    }
    
    const resultsHtml = results.map(result => `
      <div class="search-result-item">
        <div class="search-result-title">
          <a href="/industry/${result.id}">${result.name}</a>
        </div>
        <div class="search-result-snippet">${result.description}</div>
        <div class="search-result-meta">Industry</div>
      </div>
    `).join('');
    
    searchResultsContainer.innerHTML = `
      <h3>Search Results for "${state.searchQuery}"</h3>
      <div class="search-results">
        ${resultsHtml}
      </div>
    `;
  }

  // Show search loading
  function showSearchLoading() {
    const searchResultsContainer = document.getElementById('search-results');
    if (searchResultsContainer) {
      searchResultsContainer.innerHTML = `
        <div class="loading">
          Searching...
        </div>
      `;
    }
  }

  // Clear search results
  function clearSearchResults() {
    const searchResultsContainer = document.getElementById('search-results');
    if (searchResultsContainer) {
      searchResultsContainer.innerHTML = '';
    }
  }

  // Save filters to localStorage
  function saveFilters() {
    localStorage.setItem('industryAtlasFilters', JSON.stringify(state.filters));
  }

  // Update page content based on filters
  function updatePageContent() {
    // Update charts
    updateCharts();
    
    // Update data displays
    updateDataDisplays();
    
    // Update URL if needed
    updateURL();
  }

  // Update charts
  function updateCharts() {
    const charts = Chart.getChart ? Object.values(Chart.instances) : [];
    charts.forEach(chart => {
      if (chart && typeof chart.update === 'function') {
        chart.update();
      }
    });
  }

  // Update data displays
  function updateDataDisplays() {
    // Update any data displays on the page
    const dataElements = document.querySelectorAll('[data-update-on-filter]');
    dataElements.forEach(element => {
      const updateFunction = element.getAttribute('data-update-on-filter');
      if (typeof window[updateFunction] === 'function') {
        window[updateFunction](element, state);
      }
    });
  }

  // Update URL
  function updateURL() {
    const url = new URL(window.location);
    
    if (state.currentIndustry) {
      url.searchParams.set('industry', state.currentIndustry);
    } else {
      url.searchParams.delete('industry');
    }
    
    if (state.currentJurisdiction !== 'global') {
      url.searchParams.set('jurisdiction', state.currentJurisdiction);
    } else {
      url.searchParams.delete('jurisdiction');
    }
    
    if (state.currentTimeframe !== '1y') {
      url.searchParams.set('timeframe', state.currentTimeframe);
    } else {
      url.searchParams.delete('timeframe');
    }
    
    window.history.replaceState({}, '', url);
  }

  // Load industries data
  function loadIndustriesData() {
    // This would typically fetch from an API
    // For now, we'll use mock data
    const industries = [
      { id: 'energy', name: 'Energy' },
      { id: 'technology', name: 'Technology' },
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'finance', name: 'Finance' },
      { id: 'manufacturing', name: 'Manufacturing' },
      { id: 'retail', name: 'Retail' },
      { id: 'transportation', name: 'Transportation' },
      { id: 'agriculture', name: 'Agriculture' }
    ];
    
    // Populate industry filter
    const industrySelect = document.getElementById('industry-filter');
    if (industrySelect) {
      industries.forEach(industry => {
        const option = document.createElement('option');
        option.value = industry.id;
        option.textContent = industry.name;
        industrySelect.appendChild(option);
      });
    }
  }

  // Load trends data
  function loadTrendsData() {
    // This would fetch trends data from API
    console.log('Loading trends data...');
  }

  // Load academic data
  function loadAcademicData() {
    // This would fetch academic data from API
    console.log('Loading academic data...');
  }

  // Initialize chart
  function initializeChart(element) {
    const chartData = JSON.parse(element.dataset.chart);
    const chartType = element.dataset.type || 'line';
    
    const ctx = element.getContext('2d');
    new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: chartData.title || 'Chart'
          }
        }
      }
    });
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    if (nav) {
      nav.classList.toggle('mobile-open');
    }
  }

  // Utility functions
  function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  }

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

  // Expose utility functions globally
  window.IndustryAtlas = {
    state,
    formatNumber,
    formatCurrency,
    formatPercentage,
    debounce
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(); 