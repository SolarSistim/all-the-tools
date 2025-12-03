# Blog Feature

A complete, production-ready blog system for Angular applications with support for static prerendering.

## Features

- ✅ **Fully Standalone Components** - No NgModules, modern Angular architecture
- ✅ **Static Prerendering Support** - Works perfectly with SSG/SSR
- ✅ **Client-Side Pagination** - SEO-friendly pagination for static sites
- ✅ **Rich Content Blocks** - Paragraphs, images, galleries, code, quotes, CTAs, and more
- ✅ **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, structured data (schema.org)
- ✅ **Light/Dark Theme** - Automatic theme adaptation using CSS custom properties
- ✅ **Accessible** - WCAG compliant with ARIA labels and semantic HTML
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes
- ✅ **Social Sharing** - Facebook, Twitter, LinkedIn, copy link
- ✅ **Affiliate Marketing** - Built-in affiliate link component with disclosure
- ✅ **Image Galleries** - Lightbox support with keyboard navigation
- ✅ **Reading Time** - Automatic calculation of article reading time
- ✅ **Related Articles** - Smart article recommendations
- ✅ **Author Signatures** - Author bio and social links
- ✅ **Print-Friendly** - Optimized styles for printing articles

## Architecture

### Components

#### Parent Components
- **BlogListingComponent** - Paginated article listing with filters
- **BlogArticleComponent** - Complete article page with all metadata

#### Child/Reusable Components
- **ArticleContentComponent** - Renders dynamic content blocks
- **HeroImageComponent** - Large hero image with credits
- **ArticleImageComponent** - Inline images with captions
- **ImageGalleryComponent** - Photo galleries with lightbox
- **BlockquoteComponent** - Styled quotes with citations
- **CodeBlockComponent** - Code blocks with syntax highlighting
- **AffiliateLinkComponent** - Product cards with affiliate disclosure
- **AuthorSignatureComponent** - Author bio section
- **SocialShareButtonsComponent** - Social media share buttons
- **PaginationComponent** - Pagination controls

### Services

- **BlogService** - Manages articles, pagination, filtering
- **MetaService** (core) - SEO meta tags, Open Graph, Twitter Cards
- **StructuredDataService** (core) - JSON-LD structured data for schema.org

### Models

See `models/blog.models.ts` for complete type definitions:
- `Article` - Full article with content blocks
- `ArticlePreview` - Lightweight version for listings
- `Author` - Author information
- `ContentBlock` - Dynamic content types
- `AffiliateProduct` - Product information
- `PaginatedResponse<T>` - Generic pagination wrapper

## Installation & Setup

### 1. Add Blog Routes to Your App

In your `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... other routes
  {
    path: 'blog',
    loadChildren: () =>
      import('./features/blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },
];
```

### 2. Update Prerendering Configuration

If using Angular Universal or static site generation, add blog routes to your prerender list:

```typescript
// In angular.json or server.ts
{
  "prerender": {
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
```

### 3. Import Global Styles (Optional)

In your `styles.scss`:

```scss
@import 'app/features/blog/styles.scss';
```

## Usage

### Creating New Articles

1. **Define your article** in `data/articles.data.ts`:

```typescript
{
  id: '6',
  slug: 'my-new-article',
  title: 'My New Article Title',
  description: 'A brief description',
  author: AUTHORS.john_doe,
  publishedDate: '2025-01-20',
  heroImage: {
    src: 'https://example.com/image.jpg',
    alt: 'Image description',
  },
  tags: ['tag1', 'tag2'],
  category: 'Web Development',
  metaDescription: 'SEO description',
  content: [
    // Content blocks (see below)
  ],
}
```

2. **Add to prerender routes** if using SSG

3. **Test** by navigating to `/blog/my-new-article`

### Content Block Types

#### Paragraph
```typescript
{
  type: 'paragraph',
  data: {
    text: 'Your paragraph text with <strong>HTML</strong> and <code>inline code</code>',
    className: 'lead' // optional: 'lead' for larger intro text
  }
}
```

#### Heading
```typescript
{
  type: 'heading',
  data: {
    level: 2, // 2-6
    text: 'Your Heading',
    id: 'custom-anchor' // optional
  }
}
```

#### Image
```typescript
{
  type: 'image',
  data: {
    src: 'https://example.com/image.jpg',
    alt: 'Image description',
    caption: 'Image caption', // optional
    credit: 'Photographer Name', // optional
    creditUrl: 'https://...', // optional
  }
}
```

#### Gallery
```typescript
{
  type: 'gallery',
  data: {
    layout: 'grid', // 'grid' | 'masonry' | 'slider'
    images: [
      { src: '...', alt: '...', caption: '...' },
      // more images
    ]
  }
}
```

#### Blockquote
```typescript
{
  type: 'blockquote',
  data: {
    text: 'Quote text',
    citation: 'Source Name', // optional
    citationUrl: 'https://...' // optional
  }
}
```

#### Code Block
```typescript
{
  type: 'code',
  data: {
    code: 'const hello = "world";',
    language: 'javascript', // optional
    filename: 'example.js', // optional
  }
}
```

#### List
```typescript
{
  type: 'list',
  data: {
    style: 'unordered', // or 'ordered'
    items: [
      'First item with <strong>HTML</strong>',
      'Second item',
    ]
  }
}
```

#### Call to Action (CTA)
```typescript
{
  type: 'cta',
  data: {
    title: 'CTA Title',
    description: 'CTA description',
    buttonText: 'Click Here',
    buttonUrl: '/destination',
    variant: 'primary' // 'primary' | 'secondary' | 'outline'
  }
}
```

#### Affiliate Product
```typescript
{
  type: 'affiliate',
  data: {
    name: 'Product Name',
    description: 'Product description',
    image: 'https://...',
    imageAlt: 'Product image',
    price: '$99.99',
    priceNote: 'at Amazon', // optional
    link: 'https://amazon.com/...',
    buttonText: 'Check Price', // optional
    features: ['Feature 1', 'Feature 2'], // optional
    rating: 4.5, // optional
    reviewCount: 1234, // optional
    disclosure: 'Custom disclosure text' // optional
  }
}
```

#### Divider
```typescript
{
  type: 'divider',
  data: {
    style: 'line' // 'line' | 'dots' | 'stars'
  }
}
```

### Adding New Authors

In `data/authors.data.ts`:

```typescript
export const AUTHORS = {
  // ... existing authors
  new_author: {
    id: 'new_author',
    name: 'Author Name',
    bio: 'Author bio',
    avatar: 'https://...',
    socialLinks: {
      twitter: 'https://...',
      linkedin: 'https://...',
      github: 'https://...',
      website: 'https://...',
    },
  },
};
```

## Pagination Strategy

This blog uses **client-side pagination** - the best approach for static prerendered sites:

### How It Works
1. All article metadata (not full content) loads on initial page load
2. Pagination happens entirely in the browser
3. Uses query parameters (`/blog?page=2`) for navigation
4. No server requests needed for page changes

### Benefits
- ✅ Fast page transitions
- ✅ Works with static hosting (no server needed)
- ✅ All content indexed by search engines
- ✅ Simple to implement and maintain

### Configuration

In `services/blog.service.ts`:

```typescript
private readonly config: BlogConfig = {
  pageSize: 10, // Articles per page
  baseUrl: 'https://www.allthethings.dev/blog',
  defaultOgImage: 'https://www.allthethings.dev/meta-images/og-blog.png',
};
```

## SEO Features

### Meta Tags
Automatically set for each article:
- `<title>` - Article title
- `<meta name="description">` - Article description
- `<meta name="keywords">` - Article tags
- `<link rel="canonical">` - Canonical URL

### Open Graph
- `og:title`
- `og:description`
- `og:image`
- `og:url`
- `og:type` (article)

### Twitter Cards
- `twitter:card` (summary_large_image)
- `twitter:title`
- `twitter:description`
- `twitter:image`

### Structured Data (JSON-LD)
- Article schema with author, publish date, etc.
- BreadcrumbList for navigation
- Organization schema for homepage

## Theme Support

The blog automatically adapts to your light/dark theme using CSS custom properties:

### Required CSS Variables
```scss
--bg-primary        // Main background
--bg-secondary      // Secondary background
--bg-elevated       // Cards, elevated elements
--text-primary      // Primary text color
--text-secondary    // Secondary text color
--text-tertiary     // Tertiary text color
--border-color      // Border color
--shadow-color      // Shadow color
--neon-cyan         // Primary accent color
--neon-cyan-bright  // Bright accent
--neon-cyan-glow    // Glow effect
--neon-pink         // Secondary accent (for affiliate links)
```

These are already defined in your theme file at `src/styles/_theme.scss`.

## Accessibility

The blog is built with accessibility in mind:

- ✅ Semantic HTML (`<article>`, `<nav>`, `<header>`, etc.)
- ✅ ARIA labels for all interactive elements
- ✅ Keyboard navigation support
- ✅ Skip links for screen readers
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus indicators
- ✅ Alt text for all images
- ✅ Proper heading hierarchy

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Lazy load images** - All images use `loading="lazy"` except hero images
2. **Optimize images** - Use WebP format and appropriate sizes
3. **Code splitting** - Routes are lazy-loaded
4. **Prerender** - Use Angular Universal for static generation
5. **Cache** - Implement service worker for offline support

## Customization

### Styling
Override styles by targeting component classes:

```scss
// In your global styles
.article-content {
  font-size: 1.2rem; // Larger body text
}

.article-card {
  border-radius: 16px; // More rounded cards
}
```

### Adding Content Block Types
1. Create a new interface in `models/blog.models.ts`
2. Create a component for the block
3. Add it to `ArticleContentComponent` template
4. Update the union type `ContentBlockType`

### Changing Layout
Components use CSS Grid and Flexbox, making layout changes straightforward. Modify the SCSS files to adjust spacing, columns, etc.

## Troubleshooting

### Articles not showing
- Check that articles are added to `BLOG_ARTICLES` array
- Verify the slug matches the route parameter
- Check browser console for errors

### Images not loading
- Verify image URLs are accessible
- Check CORS if loading from external domains
- Use absolute URLs for images

### Pagination not working
- Ensure query params are enabled in your routes
- Check that `BlogService.getArticlePreviews()` is called correctly
- Verify `pageSize` configuration

### Styles not applying
- Ensure theme CSS variables are defined
- Import blog styles in global `styles.scss`
- Check for CSS specificity conflicts

## Migration from Other Platforms

### From WordPress
1. Export content as JSON
2. Convert to `Article` format
3. Map authors and categories
4. Update image URLs

### From Markdown
1. Parse markdown files
2. Convert to content blocks
3. Extract frontmatter for metadata

## Future Enhancements

Potential additions:
- [ ] Comments system integration
- [ ] Search functionality
- [ ] RSS feed generation
- [ ] Markdown import/export
- [ ] Admin interface for content management
- [ ] Multi-language support (i18n)
- [ ] Tags/categories pages
- [ ] Author archive pages
- [ ] Newsletter integration
- [ ] Analytics integration

## Contributing

When adding features:
1. Maintain standalone component architecture
2. Follow existing naming conventions
3. Add proper TypeScript types
4. Include accessibility features
5. Update this README

## License

This blog feature is part of the All The Things application.

## Support

For issues or questions, please check:
- This README
- Component documentation
- Type definitions in `models/blog.models.ts`
