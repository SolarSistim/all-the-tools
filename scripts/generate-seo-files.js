/**
 * SEO Files Generator
 * Automatically generates sitemap.xml and routes.txt from app.routes.ts
 * Run this before building to ensure all routes are included
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://www.allthethings.dev';
const ROUTES_FILE = path.join(__dirname, '../src/app/app.routes.ts');
const SITEMAP_OUTPUT = path.join(__dirname, '../public/sitemap.xml');
const ROUTES_OUTPUT = path.join(__dirname, '../routes.txt');

/**
 * Extract routes from app.routes.ts
 */
function extractRoutes() {
  const content = fs.readFileSync(ROUTES_FILE, 'utf-8');
  const routes = [];

  // Match route path definitions
  // Matches: path: 'some-path' or path: ''
  const pathRegex = /path:\s*['"]([^'"]*)['"]/g;

  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    const route = match[1];

    // Skip wildcard routes and empty strings that aren't root
    if (route === '**') continue;

    // Add root route as /
    if (route === '') {
      routes.push('/');
    } else {
      routes.push(`/${route}`);
    }
  }

  // Remove duplicates and sort
  return [...new Set(routes)].sort();
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(routes) {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    // Determine priority and change frequency based on route
    let priority = '0.5';
    let changefreq = 'monthly';

    if (route === '/') {
      priority = '1.0';
      changefreq = 'weekly';
    } else if (route === '/tools') {
      priority = '0.9';
      changefreq = 'weekly';
    } else if (route.startsWith('/tools/')) {
      priority = '0.8';
      changefreq = 'monthly';
    } else if (['/about', '/privacy', '/terms'].includes(route)) {
      priority = '0.6';
      changefreq = 'yearly';
    }

    sitemap += '  <url>\n';
    sitemap += `    <loc>${DOMAIN}${route}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>\n';

  return sitemap;
}

/**
 * Generate routes.txt for prerendering
 */
function generateRoutesFile(routes) {
  return routes.join('\n') + '\n';
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Extracting routes from app.routes.ts...');
  const routes = extractRoutes();

  console.log(`✅ Found ${routes.length} routes:`);
  routes.forEach(route => console.log(`   - ${route}`));

  // Generate sitemap.xml
  console.log('\n📝 Generating sitemap.xml...');
  const sitemap = generateSitemap(routes);
  fs.writeFileSync(SITEMAP_OUTPUT, sitemap);
  console.log(`✅ Sitemap created: ${SITEMAP_OUTPUT}`);

  // Generate routes.txt
  console.log('\n📝 Generating routes.txt for prerendering...');
  const routesFile = generateRoutesFile(routes);
  fs.writeFileSync(ROUTES_OUTPUT, routesFile);
  console.log(`✅ Routes file created: ${ROUTES_OUTPUT}`);

  console.log('\n🎉 SEO files generated successfully!');
}

// Run the script
main();
