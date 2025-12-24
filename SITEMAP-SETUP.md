# Sitemap Generation Setup

This project automatically generates a standards-compliant `sitemap.xml` and `robots.txt` on every build.

## How It Works

1. **Build Phase**: Angular prerenders all routes to static HTML files
2. **Post-Build**: Node script scans the prerendered output
3. **Generation**: Creates sitemap.xml + robots.txt based on actual files
4. **Deploy**: Netlify publishes everything including the sitemap

## Files Modified/Added

### New Files
- `scripts/generate-sitemap.js` - Sitemap generation script

### Updated Files
- `package.json` - Added `generate:sitemap` script and updated `prerender`
- `netlify.toml` - Added cache headers for sitemap.xml and robots.txt

## Configuration

Edit `scripts/generate-sitemap.js` to customize:

```javascript
const CONFIG = {
  siteOrigin: 'https://allthethings.dev',  // Your site URL
  buildDir: path.join(__dirname, '../dist/all-the-tools/browser'),

  // Add patterns to exclude routes
  excludePatterns: [
    /^\/404$/,       // 404 page
    /^\/admin/,      // Admin routes
    /^\/auth/,       // Auth routes
    // Add more patterns as needed
  ],

  // Set custom priorities
  priorityMap: {
    '/': '1.0',          // Homepage
    '/tools': '0.9',     // Main tools page
    '/blog': '0.9',      // Blog listing
    // Add more route priorities
  }
};
```

## Testing Locally

### 1. Full Build + Sitemap Test
```bash
npm run prerender
```
This will:
- Generate SEO files
- Build and prerender all routes
- Generate sitemap.xml and robots.txt

### 2. Verify Output
Check these files were created:
```bash
# Check sitemap exists
cat dist/all-the-tools/browser/sitemap.xml

# Check robots.txt exists
cat dist/all-the-tools/browser/robots.txt
```

### 3. Manual Sitemap Generation Only
If you just want to regenerate the sitemap without rebuilding:
```bash
npm run generate:sitemap
```

### 4. Validate Sitemap
**Online Validators:**
- Upload to: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- Or use: https://validator.w3.org/feed/

**Quick Check:**
```bash
# View the sitemap
cat dist/all-the-tools/browser/sitemap.xml | head -30

# Count URLs
grep -c "<loc>" dist/all-the-tools/browser/sitemap.xml
```

## Production Verification (After Deploy)

### 1. Check Sitemap is Live
Visit: https://allthethings.dev/sitemap.xml

Should show valid XML like:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://allthethings.dev/</loc>
    <lastmod>2025-12-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

### 2. Check Robots.txt
Visit: https://allthethings.dev/robots.txt

Should show:
```
User-agent: *
Allow: /

Sitemap: https://allthethings.dev/sitemap.xml
```

### 3. Submit to Search Engines

**Google Search Console:**
1. Go to: https://search.google.com/search-console
2. Click "Sitemaps" in left menu
3. Enter: `https://allthethings.dev/sitemap.xml`
4. Click "Submit"

**Bing Webmaster Tools:**
1. Go to: https://www.bing.com/webmasters
2. Navigate to Sitemaps section
3. Submit: `https://allthethings.dev/sitemap.xml`

## Troubleshooting

### Sitemap not generated
```bash
# Check build output exists
ls -la dist/all-the-tools/browser/

# Run script manually with debug
node scripts/generate-sitemap.js
```

### Wrong URLs in sitemap
- Check `excludePatterns` in CONFIG
- Verify prerender is creating the expected routes
- Check file paths in `dist/all-the-tools/browser/`

### Dates not updating
The `<lastmod>` dates come from file modification times. They will update on each build.

### Netlify build fails
Check Netlify deploy logs for errors in the sitemap generation step.

## CI/CD Flow

On every commit to main:
1. Netlify detects commit
2. Runs: `npm ci && npm run prerender`
3. Which executes:
   - `generate:seo` (meta tags, etc.)
   - `ng build --configuration production` (prerender)
   - `generate:sitemap` (this script)
4. Publishes `dist/all-the-tools/browser/` including sitemap

## Sitemap Standards Compliance

✅ **XML Format**: Valid XML 1.0 with UTF-8 encoding
✅ **Namespace**: Uses official sitemap namespace
✅ **URLs**: Absolute URLs with https protocol
✅ **lastmod**: ISO 8601 date format (YYYY-MM-DD)
✅ **changefreq**: Weekly (can be customized)
✅ **priority**: 0.0 to 1.0 scale (homepage = 1.0)
✅ **Limit**: No limit enforced (script handles any size)

## Notes

- **No external dependencies**: Uses only Node built-ins (fs, path)
- **No paid services**: Everything runs in your build process
- **Auto-discovery**: Scans actual prerendered files (not route config)
- **Flexible exclusions**: Regex patterns for route filtering
- **Build-time only**: Runs once per build, not at runtime
