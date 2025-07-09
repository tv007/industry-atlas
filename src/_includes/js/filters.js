// Filters functionality for Industry Atlas
(function() {
  'use strict';

  // Filter state
  const filterState = {
    industry: null,
    jurisdiction: 'global',
    timeframe: '1y',
    sector: null,
    technology: null,
    dateRange: null,
    customFilters: {}
  };

  // Filter configuration
  const filterConfig = {
    jurisdictions: [
      { id: 'global', name: 'Global', flag: '🌍' },
      { id: 'us', name: 'United States', flag: '🇺🇸' },
      { id: 'eu', name: 'European Union', flag: '🇪🇺' },
      { id: 'asia', name: 'Asia Pacific', flag: '🌏' },
      { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
      { id: 'canada', name: 'Canada', flag: '🇨🇦' },
      { id: 'australia', name: 'Australia', flag: '🇦🇺' },
      { id: 'japan', name: 'Japan', flag: '🇯🇵' },
      { id: 'china', name: 'China', flag: '🇨🇳' },
      { id: 'india', name: 'India', flag: '🇮🇳' }
    ],
    timeframes: [
      { id: '1m', name: '1 Month', value: 30 },
      { id: '3m', name: '3 Months', value: 90 },
      { id: '6m', name: '6 Months', value: 180 },
      { id: '1y', name: '1 Year', value: 365 },
      { id: '2y', name: '2 Years', value: 730 },
      { id: '5y', name: '5 Years', value: 1825 },
      { id: '10y', name: '10 Years', value: 3650 },
      { id: 'max', name: 'Max', value: null }
    ]
  };

  // Initialize filters
  function initFilters() {
    loadFilterState();
    setupFilterEventListeners();
    setupFilterUI();
    applyFilters();
  }

  // Setup filter event listeners
  function setupFilterEventListeners() {
    // Industry filter
    const industryFilter = document.getElementById('industry-filter');
    if (industryFilter) {
      industryFilter.addEventListener('change', handleIndustryFilter);
    }

    // Jurisdiction filter
    const jurisdictionFilter = document.getElementById('jurisdiction-filter');
    if (jurisdictionFilter) {
      jurisdictionFilter.addEventListener('change', handleJurisdictionFilter);
    }

    // Timeframe filter
    const timeframeFilter = document.getElementById('timeframe-filter');
    if (timeframeFilter) {
      timeframeFilter.addEventListener('change', handleTimeframeFilter);
    }

    // Sector filter
    const sectorFilter = document.getElementById('sector-filter');
    if (sectorFilter) {
      sectorFilter.addEventListener('change', handleSectorFilter);
    }

    // Technology filter
    const technologyFilter = document.getElementById('technology-filter');
    if (technologyFilter) {
      technologyFilter.addEventListener('change', handleTechnologyFilter);
    }

    // Date range filter
    const dateRangeFilter = document.getElementById('date-range-filter');
    if (dateRangeFilter) {
      dateRangeFilter.addEventListener('change', handleDateRangeFilter);
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', applyFilters);
    }
  }

  // Setup filter UI
  function setupFilterUI() {
    // Populate jurisdiction filter
    populateJurisdictionFilter();
    
    // Populate timeframe filter
    populateTimeframeFilter();
    
    // Create advanced filters
    createAdvancedFilters();
    
    // Create filter chips
    createFilterChips();
  }

  // Populate jurisdiction filter
  function populateJurisdictionFilter() {
    const jurisdictionFilter = document.getElementById('jurisdiction-filter');
    if (!jurisdictionFilter) return;

    jurisdictionFilter.innerHTML = '<option value="">All Jurisdictions</option>';
    
    filterConfig.jurisdictions.forEach(jurisdiction => {
      const option = document.createElement('option');
      option.value = jurisdiction.id;
      option.textContent = `${jurisdiction.flag} ${jurisdiction.name}`;
      jurisdictionFilter.appendChild(option);
    });
  }

  // Populate timeframe filter
  function populateTimeframeFilter() {
    const timeframeFilter = document.getElementById('timeframe-filter');
    if (!timeframeFilter) return;

    timeframeFilter.innerHTML = '';
    
    filterConfig.timeframes.forEach(timeframe => {
      const option = document.createElement('option');
      option.value = timeframe.id;
      option.textContent = timeframe.name;
      timeframeFilter.appendChild(option);
    });
  }

  // Create advanced filters
  function createAdvancedFilters() {
    const filtersBar = document.querySelector('.filters-bar');
    if (!filtersBar) return;

    // Create advanced filters container
    const advancedFilters = document.createElement('div');
    advancedFilters.className = 'advanced-filters';
    advancedFilters.id = 'advanced-filters';

    // Sector filter
    const sectorGroup = createFilterGroup('sector', 'Sector', [
      'All Sectors',
      'Energy',
      'Technology',
      'Healthcare',
      'Finance',
      'Manufacturing',
      'Retail',
      'Transportation',
      'Agriculture'
    ]);

    // Technology filter
    const technologyGroup = createFilterGroup('technology', 'Technology', [
      'All Technologies',
      'AI/ML',
      'Blockchain',
      'Cloud Computing',
      'IoT',
      '5G',
      'Quantum Computing',
      'Biotechnology',
      'Renewable Energy'
    ]);

    // Date range filter
    const dateRangeGroup = createDateRangeFilter();

    // Clear and apply buttons
    const buttonGroup = createFilterButtons();

    advancedFilters.appendChild(sectorGroup);
    advancedFilters.appendChild(technologyGroup);
    advancedFilters.appendChild(dateRangeGroup);
    advancedFilters.appendChild(buttonGroup);

    // Insert after existing filters
    const existingFilters = filtersBar.querySelector('.filters-content');
    if (existingFilters) {
      existingFilters.appendChild(advancedFilters);
    }
  }

  // Create filter group
  function createFilterGroup(id, label, options) {
    const group = document.createElement('div');
    group.className = 'filter-group';

    const labelElement = document.createElement('label');
    labelElement.htmlFor = `${id}-filter`;
    labelElement.textContent = label;

    const select = document.createElement('select');
    select.id = `${id}-filter`;
    select.className = 'filter-select';

    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase().replace(/\s+/g, '-');
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    group.appendChild(labelElement);
    group.appendChild(select);

    return group;
  }

  // Create date range filter
  function createDateRangeFilter() {
    const group = document.createElement('div');
    group.className = 'filter-group';

    const label = document.createElement('label');
    label.htmlFor = 'date-range-filter';
    label.textContent = 'Date Range';

    const select = document.createElement('select');
    select.id = 'date-range-filter';
    select.className = 'filter-select';

    const dateRanges = [
      'All Time',
      'Last 7 Days',
      'Last 30 Days',
      'Last 90 Days',
      'Last 6 Months',
      'Last Year',
      'Custom Range'
    ];

    dateRanges.forEach(range => {
      const option = document.createElement('option');
      option.value = range.toLowerCase().replace(/\s+/g, '-');
      option.textContent = range;
      select.appendChild(option);
    });

    group.appendChild(label);
    group.appendChild(select);

    return group;
  }

  // Create filter buttons
  function createFilterButtons() {
    const group = document.createElement('div');
    group.className = 'filter-buttons';

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-filters';
    clearBtn.className = 'btn btn-secondary btn-sm';
    clearBtn.textContent = 'Clear All';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'apply-filters';
    applyBtn.className = 'btn btn-primary btn-sm';
    applyBtn.textContent = 'Apply Filters';

    group.appendChild(clearBtn);
    group.appendChild(applyBtn);

    return group;
  }

  // Create filter chips
  function createFilterChips() {
    const filtersBar = document.querySelector('.filters-bar');
    if (!filtersBar) return;

    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'filter-chips';
    chipsContainer.id = 'filter-chips';

    filtersBar.appendChild(chipsContainer);
  }

  // Update filter chips
  function updateFilterChips() {
    const chipsContainer = document.getElementById('filter-chips');
    if (!chipsContainer) return;

    const activeFilters = getActiveFilters();
    
    if (Object.keys(activeFilters).length === 0) {
      chipsContainer.innerHTML = '';
      return;
    }

    const chipsHtml = Object.entries(activeFilters).map(([key, value]) => `
      <div class="filter-chip" data-filter="${key}">
        <span class="chip-label">${getFilterLabel(key)}: ${value}</span>
        <button class="chip-remove" onclick="removeFilter('${key}')">×</button>
      </div>
    `).join('');

    chipsContainer.innerHTML = chipsHtml;
  }

  // Get active filters
  function getActiveFilters() {
    const activeFilters = {};
    
    if (filterState.industry) {
      activeFilters.industry = filterState.industry;
    }
    
    if (filterState.jurisdiction && filterState.jurisdiction !== 'global') {
      activeFilters.jurisdiction = filterState.jurisdiction;
    }
    
    if (filterState.timeframe && filterState.timeframe !== '1y') {
      activeFilters.timeframe = filterState.timeframe;
    }
    
    if (filterState.sector) {
      activeFilters.sector = filterState.sector;
    }
    
    if (filterState.technology) {
      activeFilters.technology = filterState.technology;
    }
    
    if (filterState.dateRange) {
      activeFilters.dateRange = filterState.dateRange;
    }

    return activeFilters;
  }

  // Get filter label
  function getFilterLabel(key) {
    const labels = {
      industry: 'Industry',
      jurisdiction: 'Jurisdiction',
      timeframe: 'Timeframe',
      sector: 'Sector',
      technology: 'Technology',
      dateRange: 'Date Range'
    };
    
    return labels[key] || key;
  }

  // Handle industry filter
  function handleIndustryFilter(event) {
    filterState.industry = event.target.value || null;
    updateFilterChips();
    applyFilters();
  }

  // Handle jurisdiction filter
  function handleJurisdictionFilter(event) {
    filterState.jurisdiction = event.target.value || 'global';
    updateFilterChips();
    applyFilters();
  }

  // Handle timeframe filter
  function handleTimeframeFilter(event) {
    filterState.timeframe = event.target.value || '1y';
    updateFilterChips();
    applyFilters();
  }

  // Handle sector filter
  function handleSectorFilter(event) {
    filterState.sector = event.target.value || null;
    updateFilterChips();
    applyFilters();
  }

  // Handle technology filter
  function handleTechnologyFilter(event) {
    filterState.technology = event.target.value || null;
    updateFilterChips();
    applyFilters();
  }

  // Handle date range filter
  function handleDateRangeFilter(event) {
    filterState.dateRange = event.target.value || null;
    updateFilterChips();
    applyFilters();
  }

  // Remove specific filter
  function removeFilter(filterKey) {
    switch (filterKey) {
      case 'industry':
        filterState.industry = null;
        document.getElementById('industry-filter').value = '';
        break;
      case 'jurisdiction':
        filterState.jurisdiction = 'global';
        document.getElementById('jurisdiction-filter').value = 'global';
        break;
      case 'timeframe':
        filterState.timeframe = '1y';
        document.getElementById('timeframe-filter').value = '1y';
        break;
      case 'sector':
        filterState.sector = null;
        document.getElementById('sector-filter').value = '';
        break;
      case 'technology':
        filterState.technology = null;
        document.getElementById('technology-filter').value = '';
        break;
      case 'dateRange':
        filterState.dateRange = null;
        document.getElementById('date-range-filter').value = '';
        break;
    }
    
    updateFilterChips();
    applyFilters();
  }

  // Clear all filters
  function clearAllFilters() {
    filterState.industry = null;
    filterState.jurisdiction = 'global';
    filterState.timeframe = '1y';
    filterState.sector = null;
    filterState.technology = null;
    filterState.dateRange = null;
    filterState.customFilters = {};

    // Reset UI
    document.getElementById('industry-filter').value = '';
    document.getElementById('jurisdiction-filter').value = 'global';
    document.getElementById('timeframe-filter').value = '1y';
    document.getElementById('sector-filter').value = '';
    document.getElementById('technology-filter').value = '';
    document.getElementById('date-range-filter').value = '';

    updateFilterChips();
    applyFilters();
  }

  // Apply filters
  function applyFilters() {
    saveFilterState();
    updateFilterChips();
    
    // Trigger filter change event
    const filterEvent = new CustomEvent('filtersChanged', {
      detail: { filters: filterState }
    });
    document.dispatchEvent(filterEvent);
    
    // Update URL
    updateFilterURL();
    
    // Update page content
    updatePageContent();
  }

  // Update page content based on filters
  function updatePageContent() {
    // Update charts
    updateChartsWithFilters();
    
    // Update data displays
    updateDataWithFilters();
    
    // Update search results
    updateSearchWithFilters();
  }

  // Update charts with filters
  function updateChartsWithFilters() {
    const charts = Chart.getChart ? Object.values(Chart.instances) : [];
    charts.forEach(chart => {
      if (chart && typeof chart.update === 'function') {
        // Update chart data based on filters
        const filteredData = getFilteredChartData(chart, filterState);
        if (filteredData) {
          chart.data = filteredData;
          chart.update();
        }
      }
    });
  }

  // Get filtered chart data
  function getFilteredChartData(chart, filters) {
    // This would typically fetch new data from API based on filters
    // For now, return null to keep existing data
    return null;
  }

  // Update data with filters
  function updateDataWithFilters() {
    const dataElements = document.querySelectorAll('[data-filterable]');
    dataElements.forEach(element => {
      const updateFunction = element.getAttribute('data-update-function');
      if (typeof window[updateFunction] === 'function') {
        window[updateFunction](element, filterState);
      }
    });
  }

  // Update search with filters
  function updateSearchWithFilters() {
    // Update search filters if search is active
    if (window.SearchManager && window.SearchManager.state) {
      window.SearchManager.state.filters = {
        ...window.SearchManager.state.filters,
        ...filterState
      };
    }
  }

  // Update filter URL
  function updateFilterURL() {
    const url = new URL(window.location);
    
    // Clear existing filter params
    ['industry', 'jurisdiction', 'timeframe', 'sector', 'technology', 'dateRange'].forEach(param => {
      url.searchParams.delete(param);
    });
    
    // Add active filter params
    Object.entries(getActiveFilters()).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    window.history.replaceState({}, '', url);
  }

  // Load filter state from URL
  function loadFilterState() {
    const url = new URL(window.location);
    
    filterState.industry = url.searchParams.get('industry') || null;
    filterState.jurisdiction = url.searchParams.get('jurisdiction') || 'global';
    filterState.timeframe = url.searchParams.get('timeframe') || '1y';
    filterState.sector = url.searchParams.get('sector') || null;
    filterState.technology = url.searchParams.get('technology') || null;
    filterState.dateRange = url.searchParams.get('dateRange') || null;
    
    // Apply loaded state to UI
    applyFilterStateToUI();
  }

  // Apply filter state to UI
  function applyFilterStateToUI() {
    if (filterState.industry) {
      const industryFilter = document.getElementById('industry-filter');
      if (industryFilter) {
        industryFilter.value = filterState.industry;
      }
    }
    
    if (filterState.jurisdiction) {
      const jurisdictionFilter = document.getElementById('jurisdiction-filter');
      if (jurisdictionFilter) {
        jurisdictionFilter.value = filterState.jurisdiction;
      }
    }
    
    if (filterState.timeframe) {
      const timeframeFilter = document.getElementById('timeframe-filter');
      if (timeframeFilter) {
        timeframeFilter.value = filterState.timeframe;
      }
    }
    
    if (filterState.sector) {
      const sectorFilter = document.getElementById('sector-filter');
      if (sectorFilter) {
        sectorFilter.value = filterState.sector;
      }
    }
    
    if (filterState.technology) {
      const technologyFilter = document.getElementById('technology-filter');
      if (technologyFilter) {
        technologyFilter.value = filterState.technology;
      }
    }
    
    if (filterState.dateRange) {
      const dateRangeFilter = document.getElementById('date-range-filter');
      if (dateRangeFilter) {
        dateRangeFilter.value = filterState.dateRange;
      }
    }
  }

  // Save filter state
  function saveFilterState() {
    try {
      localStorage.setItem('industryAtlasFilterState', JSON.stringify(filterState));
    } catch (error) {
      console.warn('Failed to save filter state:', error);
    }
  }

  // Get filter state
  function getFilterState() {
    return { ...filterState };
  }

  // Set custom filter
  function setCustomFilter(key, value) {
    filterState.customFilters[key] = value;
    applyFilters();
  }

  // Get custom filter
  function getCustomFilter(key) {
    return filterState.customFilters[key];
  }

  // Expose filter functions globally
  window.FilterManager = {
    initFilters,
    getFilterState,
    setCustomFilter,
    getCustomFilter,
    clearAllFilters,
    removeFilter,
    applyFilters
  };

  // Expose removeFilter function globally
  window.removeFilter = removeFilter;

  // Initialize filters when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
  } else {
    initFilters();
  }

})(); 