# Prerendering Guide

## Development

```bash
# Standard dev server
npm start


# Dev server with SSR
npm run dev:ssr
```

## Build

```bash
# Production build with prerendering
npm run prerender
```

## Deploy to Netlify

```bash
# Commit and push
git add .
git commit -m "Your message"
git push origin main
```

Netlify automatically runs `npm run prerender` and deploys from `dist/all-the-tools/browser`.

### Netlify Configuration

**Important:** The following packages MUST be in regular `dependencies` (not `devDependencies`) for Netlify builds to work:

- `@netlify/angular-runtime` - Required by Netlify's Angular framework detection
- `@types/express` - Required for TypeScript compilation of server files

Netlify's build process:
1. Auto-detects Angular framework (Runtime: Angular in dashboard)
2. Loads `@netlify/angular-runtime` plugin during onPreBuild
3. Runs `npm ci && npm run prerender`
4. Deploys static files from `dist/all-the-tools/browser`

**Build Settings in Netlify Dashboard:**
- Runtime: `Angular`
- Build command: `npm run prerender`
- Publish directory: `dist/all-the-tools/browser`

## Verify

After deployment, check page source to confirm:
- Full HTML content visible
- Meta tags present (title, description, og:*, twitter:*)

## Adjust SEO Meta Tags

### Update Component Meta Tags

In any component's `ngOnInit()`:

import { MetaService } from '../../core/services/meta.service';

export class YourComponent implements OnInit {
  private metaService = inject(MetaService);

  ngOnInit() {
    this.metaService.updateTags({
      title: 'Page Title | All The Tools',
      description: 'Page description for SEO',
      keywords: ['keyword1', 'keyword2'],
      image: 'https://all-the-tools.netlify.app/assets/og-image.png',
      url: 'https://all-the-tools.netlify.app/your-route'
    });
  }
}

### Add Social Media Images

1. Create image: **1200x630 pixels** (PNG or JPG)
2. Save to: `public/assets/og-[page-name].png`
3. Update component meta tags with image URL
4. Rebuild: `npm run prerender`

### Add New Routes to Prerender

Edit `routes.txt` in project root:

/
/tools
/about
/your-new-route

Then rebuild and deploy.

## Troubleshooting

### Netlify Build Error: "Angular@19 SSR requires '@netlify/angular-runtime'"

**Cause:** Package is in `devDependencies` instead of `dependencies`

**Solution:** Move to regular dependencies:
```bash
npm uninstall @netlify/angular-runtime
npm install --save @netlify/angular-runtime
```

### Netlify Build Error: "Could not find declaration file for module 'express'"

**Cause:** `@types/express` is in `devDependencies`

**Solution:** Move to regular dependencies:
```bash
npm uninstall @types/express
npm install --save @types/express
```

### Testing Social Media Previews

- **Facebook:** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter:** [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn:** Share a link and check the preview
