#!/usr/bin/env node

/**
 * Sitemap Generator for Prerendered Angular Site
 *
 * Scans the Angular build output directory for prerendered HTML files
 * and generates a standards-compliant sitemap.xml + robots.txt
 */

const fs = require('fs');
const path = require('path');

function normalizeSiteOrigin(origin) {
  const trimmed = String(origin || '').trim().replace(/\/+$/, '');
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  const hostname = url.hostname.startsWith('www.')
    ? url.hostname
    : `www.${url.hostname}`;
  const port = url.port ? `:${url.port}` : '';
  return `${url.protocol}//${hostname}${port}`;
}

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  // Site origin - used for all URLs in sitemap
  siteOrigin: normalizeSiteOrigin('https://www.allthethings.dev'),

  // Build output directory (relative to project root)
  buildDir: path.join(__dirname, '../dist/all-the-tools/browser'),

  // Routes/patterns to exclude from sitemap
  excludePatterns: [
    /^\/404$/,           // 404 page
    /^\/admin/,          // Admin routes
    /^\/auth/,           // Auth routes
    /^\/dev/,            // Dev/test pages
    /^\/test/,           // Test pages
    /\/draft/,           // Draft content
    /\/preview/,         // Preview pages
  ],

  // Sitemap defaults
  defaultChangefreq: 'weekly',
  defaultPriority: '0.5',

  // Route-specific priorities (optional)
  priorityMap: {
    '/': '1.0',              // Homepage
    '/tools': '0.9',         // Main tools page
    '/blog': '0.9',          // Blog listing
    '/resources': '0.9',     // Resources listing
  }
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Recursively find all index.html files in a directory
 */
function findIndexFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findIndexFiles(filePath, fileList);
    } else if (file === 'index.html') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath, buildDir) {
  // Get relative path from build directory
  const relativePath = path.relative(buildDir, filePath);

  // Remove 'index.html' from the end
  let urlPath = relativePath.replace(/[\\\/]index\.html$/, '');

  // Convert Windows backslashes to forward slashes
  urlPath = urlPath.replace(/\\/g, '/');

  // Ensure leading slash
  urlPath = '/' + urlPath;

  // Handle root index
  if (urlPath === '/') {
    return '/';
  }

  return urlPath;
}

/**
 * Check if a URL should be excluded from sitemap
 */
function shouldExclude(urlPath) {
  return CONFIG.excludePatterns.some(pattern => pattern.test(urlPath));
}

/**
 * Get priority for a URL (from config or default)
 */
function getPriority(urlPath) {
  return CONFIG.priorityMap[urlPath] || CONFIG.defaultPriority;
}

/**
 * Format date as ISO 8601 (W3C Datetime)
 */
function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Generate sitemap entry for a URL
 */
function generateUrlEntry(url, lastmod, priority) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${CONFIG.defaultChangefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML
 */
function generateSitemap(urls) {
  const urlEntries = urls.map(({ url, lastmod, priority }) =>
    generateUrlEntry(url, lastmod, priority)
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate or update robots.txt
 */
function generateRobotsTxt() {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${CONFIG.siteOrigin}/sitemap.xml`;
}

/**
 * Main execution function
 */
function generateSitemapXml() {
  console.log('🗺️  Generating sitemap.xml...\n');

  // Validate build directory exists
  if (!fs.existsSync(CONFIG.buildDir)) {
    console.error(`❌ Build directory not found: ${CONFIG.buildDir}`);
    console.error('   Make sure to run "ng build" first.');
    process.exit(1);
  }

  console.log(`📂 Scanning: ${CONFIG.buildDir}`);

  // Find all prerendered HTML files
  const indexFiles = findIndexFiles(CONFIG.buildDir);
  console.log(`   Found ${indexFiles.length} prerendered pages`);

  // Convert to URL objects with metadata
  const urls = [];
  const excluded = [];

  for (const filePath of indexFiles) {
    const urlPath = filePathToUrlPath(filePath, CONFIG.buildDir);

    // Check exclusions
    if (shouldExclude(urlPath)) {
      excluded.push(urlPath);
      continue;
    }

    // Get file modification time
    const stat = fs.statSync(filePath);
    const lastmod = formatDate(stat.mtime);

    // Get priority
    const priority = getPriority(urlPath);

    // Create full URL
    const url = CONFIG.siteOrigin + urlPath;

    urls.push({ url, lastmod, priority });
  }

  // Sort URLs alphabetically
  urls.sort((a, b) => a.url.localeCompare(b.url));

  console.log(`   ✅ ${urls.length} URLs included`);
  if (excluded.length > 0) {
    console.log(`   🚫 ${excluded.length} URLs excluded`);
  }

  // Generate sitemap XML
  const sitemapContent = generateSitemap(urls);
  const sitemapPath = path.join(CONFIG.buildDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log(`\n✅ Sitemap generated: ${sitemapPath}`);
  console.log(`   ${urls.length} URLs included\n`);

  // Generate robots.txt
  const robotsContent = generateRobotsTxt();
  const robotsPath = path.join(CONFIG.buildDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log(`✅ Robots.txt generated: ${robotsPath}\n`);

  // Print sample URLs
  console.log('📋 Sample URLs included:');
  urls.slice(0, 5).forEach(({ url, lastmod }) => {
    console.log(`   ${url} (${lastmod})`);
  });
  if (urls.length > 5) {
    console.log(`   ... and ${urls.length - 5} more`);
  }

  if (excluded.length > 0) {
    console.log('\n🚫 Excluded URLs:');
    excluded.slice(0, 5).forEach(url => {
      console.log(`   ${url}`);
    });
    if (excluded.length > 5) {
      console.log(`   ... and ${excluded.length - 5} more`);
    }
  }

  console.log('\n✨ Sitemap generation complete!\n');
}

// ============================================================================
// Execute
// ============================================================================

try {
  generateSitemapXml();
} catch (error) {
  console.error('❌ Error generating sitemap:', error.message);
  console.error(error.stack);
  process.exit(1);
}
