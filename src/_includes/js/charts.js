// Charts functionality for Industry Atlas
(function() {
  'use strict';

  // Chart configurations
  const chartConfigs = {
    // Line chart for trends
    trends: {
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Industry Trends'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Change (%)'
            },
            ticks: {
              callback: function(value) {
                return value.toFixed(1) + '%';
              }
            }
          }
        }
      }
    },

    // Bar chart for academic data
    academic: {
      type: 'bar',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Academic Publications by Institution'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Institution'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Publications'
            },
            beginAtZero: true
          }
        }
      }
    },

    // Doughnut chart for sector distribution
    sectors: {
      type: 'doughnut',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Sector Distribution'
          }
        }
      }
    },

    // Radar chart for technology readiness
    trl: {
      type: 'radar',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Technology Readiness Levels'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 9,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    }
  };

  // Chart instances storage
  const chartInstances = new Map();

  // Initialize all charts on the page
  function initCharts() {
    const chartElements = document.querySelectorAll('[data-chart]');
    chartElements.forEach(element => {
      initializeChart(element);
    });
  }

  // Initialize a single chart
  function initializeChart(element) {
    try {
      const chartData = JSON.parse(element.dataset.chart);
      const chartType = element.dataset.type || 'line';
      const chartId = element.id || 'chart-' + Math.random().toString(36).substr(2, 9);
      
      // Set element ID if not present
      if (!element.id) {
        element.id = chartId;
      }

      // Get chart configuration
      const config = chartConfigs[chartType] || chartConfigs.trends;
      
      // Merge custom options with default config
      const options = {
        ...config.options,
        ...chartData.options
      };

      // Create chart
      const ctx = element.getContext('2d');
      const chart = new Chart(ctx, {
        type: config.type,
        data: chartData,
        options: options
      });

      // Store chart instance
      chartInstances.set(chartId, chart);

      // Add chart controls if specified
      if (element.dataset.controls) {
        addChartControls(element, chart);
      }

    } catch (error) {
      console.error('Failed to initialize chart:', error);
      element.innerHTML = '<div class="alert alert-error">Failed to load chart</div>';
    }
  }

  // Add chart controls
  function addChartControls(element, chart) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'chart-controls';
    
    const controls = JSON.parse(element.dataset.controls);
    
    controls.forEach(control => {
      const button = document.createElement('button');
      button.textContent = control.label;
      button.className = control.active ? 'active' : '';
      
      button.addEventListener('click', () => {
        // Update chart based on control
        updateChart(chart, control.action, control.value);
        
        // Update active state
        controlsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
      
      controlsContainer.appendChild(button);
    });
    
    // Insert controls before the chart
    element.parentNode.insertBefore(controlsContainer, element);
  }

  // Update chart data
  function updateChart(chart, action, value) {
    switch (action) {
      case 'timeframe':
        updateChartTimeframe(chart, value);
        break;
      case 'jurisdiction':
        updateChartJurisdiction(chart, value);
        break;
      case 'industry':
        updateChartIndustry(chart, value);
        break;
      case 'view':
        updateChartView(chart, value);
        break;
      default:
        console.warn('Unknown chart action:', action);
    }
  }

  // Update chart timeframe
  function updateChartTimeframe(chart, timeframe) {
    // This would typically fetch new data from API
    const mockData = generateMockTrendsData(timeframe);
    
    chart.data.labels = mockData.labels;
    chart.data.datasets.forEach((dataset, index) => {
      dataset.data = mockData.datasets[index]?.data || dataset.data;
    });
    
    chart.update();
  }

  // Update chart jurisdiction
  function updateChartJurisdiction(chart, jurisdiction) {
    // This would typically fetch new data from API
    const mockData = generateMockJurisdictionData(jurisdiction);
    
    chart.data.labels = mockData.labels;
    chart.data.datasets.forEach((dataset, index) => {
      dataset.data = mockData.datasets[index]?.data || dataset.data;
    });
    
    chart.update();
  }

  // Update chart industry
  function updateChartIndustry(chart, industry) {
    // This would typically fetch new data from API
    const mockData = generateMockIndustryData(industry);
    
    chart.data.labels = mockData.labels;
    chart.data.datasets.forEach((dataset, index) => {
      dataset.data = mockData.datasets[index]?.data || dataset.data;
    });
    
    chart.update();
  }

  // Update chart view
  function updateChartView(chart, view) {
    // Change chart type or view mode
    chart.config.type = view;
    chart.update();
  }

  // Generate mock trends data
  function generateMockTrendsData(timeframe) {
    const months = 12;
    const labels = [];
    const datasets = [
      {
        label: 'Energy',
        data: [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)'
      },
      {
        label: 'Technology',
        data: [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: 'Healthcare',
        data: [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
      }
    ];

    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      
      datasets.forEach(dataset => {
        dataset.data.push(Math.random() * 20 - 10); // Random values between -10 and 10
      });
    }

    return { labels, datasets };
  }

  // Generate mock jurisdiction data
  function generateMockJurisdictionData(jurisdiction) {
    const jurisdictions = ['US', 'EU', 'Asia', 'Global'];
    const labels = jurisdictions;
    const datasets = [{
      label: 'Market Performance',
      data: jurisdictions.map(() => Math.random() * 100),
      backgroundColor: [
        'rgba(37, 99, 235, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }];

    return { labels, datasets };
  }

  // Generate mock industry data
  function generateMockIndustryData(industry) {
    const sectors = ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E'];
    const labels = sectors;
    const datasets = [{
      label: industry.charAt(0).toUpperCase() + industry.slice(1) + ' Performance',
      data: sectors.map(() => Math.random() * 100),
      backgroundColor: 'rgba(37, 99, 235, 0.8)'
    }];

    return { labels, datasets };
  }

  // Create trends chart
  function createTrendsChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'trends-chart';
    container.appendChild(canvas);

    const chartData = {
      labels: data.labels,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        borderWidth: 2,
        fill: false,
        tension: 0.4
      }))
    };

    const chart = new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: chartConfigs.trends.options
    });

    chartInstances.set('trends-chart', chart);
    return chart;
  }

  // Create academic chart
  function createAcademicChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'academic-chart';
    container.appendChild(canvas);

    const chart = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: chartConfigs.academic.options
    });

    chartInstances.set('academic-chart', chart);
    return chart;
  }

  // Create sectors chart
  function createSectorsChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'sectors-chart';
    container.appendChild(canvas);

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: data,
      options: chartConfigs.sectors.options
    });

    chartInstances.set('sectors-chart', chart);
    return chart;
  }

  // Create TRL chart
  function createTRLChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'trl-chart';
    container.appendChild(canvas);

    const chart = new Chart(canvas, {
      type: 'radar',
      data: data,
      options: chartConfigs.trl.options
    });

    chartInstances.set('trl-chart', chart);
    return chart;
  }

  // Export chart as image
  function exportChart(chartId, format = 'png') {
    const chart = chartInstances.get(chartId);
    if (!chart) return;

    const link = document.createElement('a');
    link.download = `chart-${chartId}.${format}`;
    link.href = chart.toBase64Image();
    link.click();
  }

  // Print chart
  function printChart(chartId) {
    const chart = chartInstances.get(chartId);
    if (!chart) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Chart Print</title>
          <style>
            body { margin: 0; padding: 20px; }
            canvas { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <canvas id="print-chart"></canvas>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
            const canvas = document.getElementById('print-chart');
            const ctx = canvas.getContext('2d');
            const chart = new Chart(ctx, ${JSON.stringify(chart.config)});
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Destroy chart
  function destroyChart(chartId) {
    const chart = chartInstances.get(chartId);
    if (chart) {
      chart.destroy();
      chartInstances.delete(chartId);
    }
  }

  // Destroy all charts
  function destroyAllCharts() {
    chartInstances.forEach((chart, id) => {
      chart.destroy();
    });
    chartInstances.clear();
  }

  // Expose functions globally
  window.ChartManager = {
    initCharts,
    initializeChart,
    createTrendsChart,
    createAcademicChart,
    createSectorsChart,
    createTRLChart,
    updateChart,
    exportChart,
    printChart,
    destroyChart,
    destroyAllCharts,
    chartInstances
  };

  // Initialize charts when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
  } else {
    initCharts();
  }

})(); 