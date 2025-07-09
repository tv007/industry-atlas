#!/usr/bin/env node

/**
 * Industry Atlas Data Scrapers
 * 
 * This script orchestrates data collection from various sources:
 * - Wikipedia industry outlines
 * - Financial market data
 * - Academic publications
 * - Corporate information
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Import individual scrapers
const wikipediaScraper = require('./wikipedia');
const financialScraper = require('./financial');
const academicScraper = require('./academic');
const corporateScraper = require('./corporate');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../../src/_data'),
  cacheDir: path.join(__dirname, '../cache'),
  logFile: path.join(__dirname, '../logs/scraper.log'),
  maxRetries: 3,
  retryDelay: 1000,
  userAgent: 'Industry-Atlas-Bot/1.0 (https://github.com/industry-atlas/industry-atlas.github.io)'
};

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [CONFIG.outputDir, CONFIG.cacheDir, path.dirname(CONFIG.logFile)];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Failed to create directory ${dir}:`, error);
      }
    }
  }
}

// Logging utility
async function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  console.log(logMessage);
  
  try {
    await fs.appendFile(CONFIG.logFile, logMessage + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

// Retry utility
async function retry(fn, maxRetries = CONFIG.maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      await log(`Attempt ${i + 1} failed, retrying in ${CONFIG.retryDelay}ms: ${error.message}`, 'WARN');
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
    }
  }
}

// Save data to file
async function saveData(filename, data) {
  const filepath = path.join(CONFIG.outputDir, filename);
  
  try {
    // Add metadata
    const output = {
      metadata: {
        generated_at: new Date().toISOString(),
        source: 'Industry Atlas Scrapers',
        version: '1.0.0'
      },
      data: data
    };
    
    await fs.writeFile(filepath, JSON.stringify(output, null, 2));
    await log(`Saved ${filename} (${JSON.stringify(output).length} bytes)`);
    
    return filepath;
  } catch (error) {
    await log(`Failed to save ${filename}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Main scraping orchestration
async function runScrapers() {
  const startTime = Date.now();
  
  try {
    await log('Starting Industry Atlas data collection...');
    await ensureDirectories();
    
    const results = {
      wikipedia: null,
      financial: null,
      academic: null,
      corporate: null,
      errors: []
    };
    
    // 1. Wikipedia Industry Outlines
    try {
      await log('Scraping Wikipedia industry outlines...');
      results.wikipedia = await retry(() => wikipediaScraper.scrape());
      await saveData('wikipedia-industries.json', results.wikipedia);
      await log(`Wikipedia scraping completed: ${results.wikipedia.length} industries found`);
    } catch (error) {
      await log(`Wikipedia scraping failed: ${error.message}`, 'ERROR');
      results.errors.push({ source: 'wikipedia', error: error.message });
    }
    
    // 2. Financial Market Data
    try {
      await log('Collecting financial market data...');
      results.financial = await retry(() => financialScraper.collect());
      await saveData('financial-trends.json', results.financial);
      await log(`Financial data collection completed: ${Object.keys(results.financial).length} jurisdictions`);
    } catch (error) {
      await log(`Financial data collection failed: ${error.message}`, 'ERROR');
      results.errors.push({ source: 'financial', error: error.message });
    }
    
    // 3. Academic Publications
    try {
      await log('Collecting academic publication data...');
      results.academic = await retry(() => academicScraper.collect());
      await saveData('academic-publications.json', results.academic);
      await log(`Academic data collection completed: ${results.academic.total_publications} publications`);
    } catch (error) {
      await log(`Academic data collection failed: ${error.message}`, 'ERROR');
      results.errors.push({ source: 'academic', error: error.message });
    }
    
    // 4. Corporate Information
    try {
      await log('Collecting corporate information...');
      results.corporate = await retry(() => corporateScraper.collect());
      await saveData('corporate-data.json', results.corporate);
      await log(`Corporate data collection completed: ${results.corporate.companies.length} companies`);
    } catch (error) {
      await log(`Corporate data collection failed: ${error.message}`, 'ERROR');
      results.errors.push({ source: 'corporate', error: error.message });
    }
    
    // Generate summary report
    const summary = {
      timestamp: new Date().toISOString(),
      duration_ms: Date.now() - startTime,
      success_count: Object.values(results).filter(r => r && !Array.isArray(r)).length,
      error_count: results.errors.length,
      errors: results.errors,
      data_sources: {
        wikipedia: results.wikipedia ? results.wikipedia.length : 0,
        financial: results.financial ? Object.keys(results.financial).length : 0,
        academic: results.academic ? results.academic.total_publications : 0,
        corporate: results.corporate ? results.corporate.companies.length : 0
      }
    };
    
    await saveData('scraper-summary.json', summary);
    await log(`Scraping completed in ${summary.duration_ms}ms. Success: ${summary.success_count}, Errors: ${summary.error_count}`);
    
    // Exit with error code if any scrapers failed
    if (results.errors.length > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    await log(`Fatal error during scraping: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Industry Atlas Data Scrapers

Usage:
  node index.js [options]

Options:
  --help, -h          Show this help message
  --wikipedia-only    Only run Wikipedia scraper
  --financial-only    Only run financial data collection
  --academic-only     Only run academic data collection
  --corporate-only    Only run corporate data collection
  --dry-run          Run without saving data
  --verbose          Enable verbose logging
    `);
    return;
  }
  
  if (args.includes('--dry-run')) {
    CONFIG.dryRun = true;
    await log('Running in dry-run mode (no data will be saved)');
  }
  
  if (args.includes('--verbose')) {
    CONFIG.verbose = true;
    await log('Verbose logging enabled');
  }
  
  // Run specific scraper if requested
  if (args.includes('--wikipedia-only')) {
    await log('Running Wikipedia scraper only...');
    const data = await retry(() => wikipediaScraper.scrape());
    if (!CONFIG.dryRun) {
      await saveData('wikipedia-industries.json', data);
    }
    return;
  }
  
  if (args.includes('--financial-only')) {
    await log('Running financial data collection only...');
    const data = await retry(() => financialScraper.collect());
    if (!CONFIG.dryRun) {
      await saveData('financial-trends.json', data);
    }
    return;
  }
  
  if (args.includes('--academic-only')) {
    await log('Running academic data collection only...');
    const data = await retry(() => academicScraper.collect());
    if (!CONFIG.dryRun) {
      await saveData('academic-publications.json', data);
    }
    return;
  }
  
  if (args.includes('--corporate-only')) {
    await log('Running corporate data collection only...');
    const data = await retry(() => corporateScraper.collect());
    if (!CONFIG.dryRun) {
      await saveData('corporate-data.json', data);
    }
    return;
  }
  
  // Run all scrapers
  await runScrapers();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch(async (error) => {
    await log(`Unhandled error: ${error.message}`, 'ERROR');
    process.exit(1);
  });
}

module.exports = {
  runScrapers,
  log,
  retry,
  saveData,
  CONFIG
}; 