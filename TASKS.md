# Industry Atlas – Project Tasks

## ✅ Completed Tasks

- Initialized project with Eleventy (11ty) static site generator
- Created `package.json` with all required dependencies and scripts
- Set up Eleventy configuration (`.eleventy.js`) with plugins, filters, shortcodes, and collections
- Designed modern, responsive layouts and styles (`base.njk`, `main.css`, `components.css`)
- Implemented global header, navigation, filters bar, and footer
- Added JavaScript modules for main logic, charts, search, and filters
- Created initial data files in `/src/_data/` (industries.json, trends.json)
- Scaffolded homepage (`index.njk`) with industry grid, stats, chart, and navigation
- Set up folder structure for modular content and routing
- Added GitHub Actions workflow for CI/CD, build, and scheduled scrapers
- Created main scraper orchestration script (`scripts/scrapers/index.js`)
- Added `.gitignore` and `LICENSE` (MIT)
- Wrote comprehensive `README.md` with setup, usage, and contribution guidelines
- Verified build process and fixed Eleventy/Nunjucks/shortcode issues

## 📝 Future Tasks / TODO

- Implement individual scraper modules:
  - Wikipedia industry outline scraper
  - Financial trends API integration (e.g., Alpha Vantage, Yahoo Finance)
  - Academic metadata scraper (Crossref API)
  - Corporate data scraper (e.g., Fortune 500)
- Add more page templates:
  - Industry detail pages
  - Sector and subsector pages
  - Trends by jurisdiction
  - Technology readiness and supply chain evolution
  - Academics and research impact
- Build out `/src/_data/` with real, regularly updated data
- Automate periodic data updates and Git commits via GitHub Actions
- Add more UI components:
  - Timeline for supply chain evolution
  - Interactive charts for trends and academics
  - Search results and filters
  - Breadcrumbs and related links
- Improve accessibility (ARIA labels, keyboard navigation)
- Add sitemap.xml, robots.txt, and SEO metadata
- Implement spell-check and markdown linting in CI
- Add tests for scrapers and data normalization
- Enable user contributions (GitHub Issues/PRs)
- Plan for Phase 2+ features:
  - Advanced analytics dashboard
  - Real-time price feeds
  - Academic sentiment analysis
  - Localization and translations
  - Deeper corporate/EDGAR integration

---

*This file tracks project progress and next steps. Update as you complete or plan new tasks.* 