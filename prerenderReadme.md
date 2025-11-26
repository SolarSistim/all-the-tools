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

# Commit and push
git add .
git commit -m "Your message"
git push origin main

Netlify automatically runs `npm run prerender` and deploys from `dist/all-the-tools/browser`.

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
