# Industry Atlas

A comprehensive industry mapping and analysis platform that provides insights into global industries, their interconnections, and emerging trends.

## 🌟 Features

- **Industry Overview**: Comprehensive analysis of 8 major industries
- **Market Trends**: Real-time financial data and performance metrics
- **Technology Readiness**: TRL assessments and adoption analysis
- **Academic Impact**: Research publications and institutional analysis
- **Supply Chain Mapping**: Global supply chain evolution and risk assessment
- **Interactive Charts**: Dynamic visualizations powered by Chart.js
- **Advanced Search**: Full-text search across all content
- **Responsive Design**: Mobile-first, accessible interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/industry-atlas.github.io.git
   cd industry-atlas.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
industry-atlas/
├── src/
│   ├── _data/              # JSON data files
│   ├── _includes/          # Shared components
│   │   ├── css/           # Stylesheets
│   │   ├── js/            # JavaScript modules
│   │   └── images/        # Static images
│   ├── _layouts/          # Page templates
│   └── pages/             # Content pages
│       ├── industry/      # Industry-specific pages
│       ├── trends/        # Market trends
│       ├── technology/    # Tech readiness
│       ├── academics/     # Academic research
│       └── supplychain/   # Supply chain analysis
├── scripts/
│   └── scrapers/          # Data collection scripts
├── .github/
│   └── workflows/         # CI/CD pipelines
└── _site/                 # Build output (generated)
```

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run start        # Alias for dev

# Building
npm run build        # Build for production
npm run clean        # Clean build directory

# Data Collection
npm run scrape       # Run all data scrapers
npm run scrape -- --wikipedia-only    # Run specific scraper
npm run scrape -- --dry-run          # Test without saving

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
```

### Data Sources

The platform aggregates data from multiple sources:

- **Wikipedia**: Industry outlines and sector definitions
- **Financial APIs**: Market data and performance metrics
- **Academic Databases**: Research publications and citations
- **Corporate Databases**: Company information and rankings

### Adding New Content

1. **Create a new page**
   ```bash
   # Create a new industry page
   touch src/pages/industry/new-industry.md
   ```

2. **Add front matter**
   ```yaml
   ---
   layout: base.njk
   title: New Industry
   description: Description of the new industry
   ---
   ```

3. **Add data**
   ```bash
   # Add industry data
   echo '{"id": "new-industry", "name": "New Industry"}' >> src/_data/industries.json
   ```

## 🎨 Customization

### Styling

The project uses CSS custom properties for theming:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  /* ... more variables */
}
```

### Layouts

Templates are built with Nunjucks and support:

- **Base Layout**: Common header, footer, and navigation
- **Page Layouts**: Specific layouts for different content types
- **Component Includes**: Reusable UI components

### JavaScript Modules

- `main.js`: Core application logic
- `charts.js`: Chart.js integration
- `search.js`: Search functionality
- `filters.js`: Filter management

## 📊 Data Management

### Scrapers

The platform includes automated data collection:

```bash
# Run all scrapers
npm run scrape

# Run specific scraper
npm run scrape -- --financial-only

# Test scraping
npm run scrape -- --dry-run
```

### Data Formats

All data is stored in JSON format with metadata:

```json
{
  "metadata": {
    "generated_at": "2024-01-15T10:30:00Z",
    "source": "Industry Atlas Scrapers",
    "version": "1.0.0"
  },
  "data": {
    // Actual data here
  }
}
```

## 🚀 Deployment

### GitHub Pages

The site automatically deploys to GitHub Pages on push to main:

1. **Enable GitHub Pages** in repository settings
2. **Set source** to GitHub Actions
3. **Push to main** to trigger deployment

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to any static hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# API Keys (optional)
ALPHA_VANTAGE_API_KEY=your_key_here
CROSSREF_API_KEY=your_key_here

# Development
ELEVENTY_ENV=development
```

### Build Configuration

Modify `.eleventy.js` for build settings:

```javascript
module.exports = function(eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-bundle'));
  
  // Configure output
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure accessibility compliance
- Test on multiple devices/browsers

## 📈 Performance

### Optimization Features

- **Static Site Generation**: Pre-rendered pages for fast loading
- **Image Optimization**: Automatic image compression
- **Code Splitting**: JavaScript bundles optimized for size
- **Caching**: Aggressive caching strategies
- **CDN Ready**: Optimized for content delivery networks

### Monitoring

The build process includes performance monitoring:

- Lighthouse CI scores
- Bundle size analysis
- Broken link detection
- Accessibility audits

## 🔒 Security

### Security Features

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure connections required
- **Input Validation**: Sanitized user inputs
- **Dependency Scanning**: Regular security audits

### Reporting Issues

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. **Email** security@industry-atlas.com
3. **Include** detailed reproduction steps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Eleventy**: Static site generator
- **Chart.js**: Data visualization
- **Wikipedia**: Industry data source
- **Financial APIs**: Market data providers
- **Academic Databases**: Research data sources

## 📞 Support

- **Documentation**: [docs.industry-atlas.com](https://docs.industry-atlas.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/industry-atlas.github.io/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/industry-atlas.github.io/discussions)
- **Email**: support@industry-atlas.com

---

**Industry Atlas** - Mapping the future of global industries 🌍 