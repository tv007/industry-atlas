const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { EleventyI18nPlugin } = require("@11ty/eleventy");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");
const bundle = require("@11ty/eleventy-plugin-bundle");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "en"
  });
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(bundle);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_includes/css");
  eleventyConfig.addPassthroughCopy("src/_includes/js");
  eleventyConfig.addPassthroughCopy("src/_includes/images");

  // Watch for data changes
  eleventyConfig.addWatchTarget("src/_data/");
  eleventyConfig.addWatchTarget("src/assets/");

  // Global data
  eleventyConfig.addGlobalData("buildTime", new Date());

  // Filters
  eleventyConfig.addFilter("formatDate", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addFilter("slugify", function(str) {
    return str.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  eleventyConfig.addFilter("jsonify", function(obj) {
    return JSON.stringify(obj, null, 2);
  });

  // Shortcodes
  function chartShortcode(id, data, type = "line") {
    return `<canvas id="${id}" data-chart='${JSON.stringify(data)}' data-type="${type}"></canvas>`;
  }
  eleventyConfig.addShortcode("chart", chartShortcode);
  eleventyConfig.addNunjucksShortcode("chart", chartShortcode);

  eleventyConfig.addShortcode("industryCard", function(industry) {
    return `
      <div class="industry-card">
        <h3><a href="/industry/${industry.id}">${industry.name}</a></h3>
        <p>${industry.description}</p>
        <div class="sectors">
          ${industry.sectors.slice(0, 3).map(sector => `<span class="sector-tag">${sector}</span>`).join('')}
          ${industry.sectors.length > 3 ? `<span class="more-tag">+${industry.sectors.length - 3} more</span>` : ''}
        </div>
      </div>
    `;
  });

  // Collections
  eleventyConfig.addCollection("industries", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/industry/*.md");
  });

  eleventyConfig.addCollection("sectors", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/sector/**/*.md");
  });

  eleventyConfig.addCollection("trends", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/trends/*.md");
  });

  // Server options
  eleventyConfig.setServerOptions({
    port: 8080,
    showAllHosts: true
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}; 