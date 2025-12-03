# Quick Setup Guide

Follow these steps to integrate the blog feature into your application.

## Step 1: Add Blog Routes

In your main app routes file (usually `app.routes.ts` or `app-routing.module.ts`), add the blog routes:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... your existing routes
  {
    path: 'blog',
    loadChildren: () =>
      import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },
];
```

## Step 2: Configure Prerendering (Optional but Recommended)

If you're using Angular Universal or static site generation, add blog routes to prerender:

### In `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "prerender": {
          "options": {
            "routes": [
              "/",
              "/blog",
              "/blog/getting-started-with-web-development-tools",
              "/blog/mastering-css-grid-layout",
              "/blog/productivity-hacks-for-developers",
              "/blog/javascript-array-methods-guide",
              "/blog/building-accessible-websites"
            ]
          }
        }
      }
    }
  }
}
```

### Or in your server/prerender script:

```typescript
const routes = [
  '/',
  '/blog',
  '/blog/getting-started-with-web-development-tools',
  '/blog/mastering-css-grid-layout',
  '/blog/productivity-hacks-for-developers',
  '/blog/javascript-array-methods-guide',
  '/blog/building-accessible-websites',
];
```

## Step 3: Update Blog Configuration

Edit `src/app/features/blog/services/blog.service.ts` and update the configuration:

```typescript
private readonly config: BlogConfig = {
  pageSize: 10, // Articles per page
  baseUrl: 'https://www.allthethings.dev/blog', // Update to your domain
  defaultOgImage: 'https://www.allthethings.dev/meta-images/og-blog.png', // Update to your OG image
};
```

## Step 4: Create Your First Article

1. Open `src/app/features/blog/data/articles.data.ts`
2. Add a new article to the `BLOG_ARTICLES` array:

```typescript
{
  id: 'unique-id',
  slug: 'your-article-slug',
  title: 'Your Article Title',
  description: 'Brief description',
  author: AUTHORS.john_doe, // or create a new author
  publishedDate: '2025-01-20',
  heroImage: {
    src: 'https://images.unsplash.com/photo-...',
    alt: 'Image description',
  },
  tags: ['tag1', 'tag2'],
  category: 'Your Category',
  metaDescription: 'SEO description',
  content: [
    {
      type: 'paragraph',
      data: {
        text: 'Your article content...',
        className: 'lead'
      }
    },
    // Add more content blocks
  ]
}
```

3. If using prerendering, add the new article to your routes list:
   - `/blog/your-article-slug`

## Step 5: Add Navigation Links

Add a link to the blog in your navigation:

```html
<!-- In your header/nav component -->
<a routerLink="/blog">Blog</a>
```

Or with Angular Material:

```html
<button mat-button routerLink="/blog">Blog</button>
```

## Step 6: Test the Blog

1. Start your development server:
   ```bash
   ng serve
   ```

2. Navigate to `http://localhost:4200/blog`

3. Test features:
   - ✅ Article listing loads
   - ✅ Pagination works
   - ✅ Individual articles load
   - ✅ Social share buttons work
   - ✅ Image galleries open lightbox
   - ✅ Theme switching works
   - ✅ Responsive on mobile

## Step 7: Build for Production

### Standard Build
```bash
ng build
```

### With Prerendering
```bash
ng build --configuration production
npm run prerender
```

## Optional Enhancements

### Add Blog Styles to Global Styles

In `src/styles.scss`:

```scss
@import 'app/features/blog/styles.scss';
```

### Create Custom OG Images

1. Create OG images (1200x630px) for each article
2. Save them in `public/meta-images/` or your assets folder
3. Update the `ogImage` property in articles

### Set Up Analytics

Track blog article views:

```typescript
// In BlogArticleComponent
ngOnInit() {
  // ... existing code

  // Track page view
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_path: `/blog/${this.article.slug}`,
      page_title: this.article.title,
    });
  }
}
```

### Add RSS Feed

Generate an RSS feed for your blog:

```typescript
// Create a script to generate feed.xml
import { BLOG_ARTICLES } from './data/articles.data';
import * as fs from 'fs';

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>All The Things Blog</title>
    <link>https://www.allthethings.dev/blog</link>
    <description>Articles about web development</description>
    ${BLOG_ARTICLES.map(article => `
      <item>
        <title>${article.title}</title>
        <link>https://www.allthethings.dev/blog/${article.slug}</link>
        <description>${article.description}</description>
        <pubDate>${new Date(article.publishedDate).toUTCString()}</pubDate>
      </item>
    `).join('')}
  </channel>
</rss>`;

fs.writeFileSync('public/feed.xml', feed);
```

## Troubleshooting

### Issue: Routes not loading
**Solution**: Make sure you're using `loadChildren` (not `loadComponent`) for the blog root route.

### Issue: Styles not applying
**Solution**: Verify that CSS variables are defined in your theme file (`_theme.scss`).

### Issue: Images not loading
**Solution**: Use absolute URLs for images or ensure they're in your public/assets folder.

### Issue: Pagination not working
**Solution**: Check that the `RouterModule` is imported in your components.

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Add your own articles in `data/articles.data.ts`
- Customize styles to match your brand
- Set up analytics and monitoring
- Create custom OG images for social sharing

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review type definitions in `models/blog.models.ts`
- Look at example articles in `data/articles.data.ts`
- Inspect component implementations for usage examples
