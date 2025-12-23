# Blog Content Creation Guidelines

This document contains the specifications and guidelines for creating new blog articles. **Claude should always reference this file when creating new articles.**

## AdSense Placement Rules

When creating new articles, ads should be automatically inserted based on the estimated reading time:

### Ad Count by Reading Time
- **≤ 5 minutes**: Insert **2 ads**
- **5-10 minutes**: Insert **3 ads**
- **10-20 minutes**: Insert **4 ads**
- **20+ minutes**: Insert **5 ads**

### Ad Placement Strategy

1. **Even Distribution**: Ads should be spaced evenly throughout the article content
2. **Natural Breaks**: Place ads between logical content sections (after paragraphs, before headings)
3. **Never at Start**: Don't place an ad as the first content block
4. **Never at End**: Don't place an ad as the last content block

### Implementation

Ads are implemented using the `adsense` content block type:

```typescript
{
  type: 'adsense',
  data: {
    adClient: 'ca-pub-7077792325295668',
    adSlot: '3887470191'
  }
}
```

### Example Ad Distribution

For a **7-minute read** (3 ads required) with 12 content blocks:
- Place ad after block 4 (1/3 through)
- Place ad after block 8 (2/3 through)
- Place ad after block 11 (near end, but not last)

## Reading Time Estimation

Estimate reading time based on word count:
- **Average reading speed**: 200 words per minute
- **Formula**: `readingTime = Math.ceil(totalWords / 200)`

Count words in:
- Paragraph blocks (text content)
- List items
- Blockquotes
- Code blocks (approximate)
- Headings

Do NOT count words in:
- Image captions
- CTAs
- Affiliate product descriptions

## Article Structure Best Practices

### Required Elements
1. **Opening paragraph** with `className: 'lead'` for introduction
2. **Multiple headings** (H2, H3) to break up content
3. **Varied content blocks** (paragraphs, images, lists, quotes)
4. **AdSense blocks** inserted per the rules above

### Content Block Order Guidelines
1. Start with a lead paragraph
2. Use H2 headings to separate major sections
3. Mix paragraph and visual content (images, galleries, code blocks)
4. Insert ads at natural transition points
5. End with a conclusion or call-to-action

### Content Block Types to Use

#### Essential Blocks
- **Paragraphs**: Primary text content
- **Headings**: H2 for main sections, H3 for subsections
- **Images**: Break up text, illustrate concepts
- **Lists**: Organize information clearly

#### Engagement Blocks
- **Blockquotes**: Highlight key points or citations
- **CTAs**: Drive user actions
- **Galleries**: Showcase multiple related images
- **Code blocks**: Show technical examples

#### Monetization Blocks
- **AdSense**: Per the placement rules above
- **Affiliate links**: When relevant to content

### Divider Usage
Use dividers sparingly to separate major topic shifts:
```typescript
{
  type: 'divider',
  data: {
    style: 'line' // or 'dots', 'stars'
  }
}
```

## SEO Optimization

### Meta Description
- **Length**: 150-160 characters
- **Include**: Primary keyword, value proposition
- **Format**: Complete sentence(s)

### Tags
- **Count**: 3-5 relevant tags
- **Format**: lowercase, hyphenated if multi-word
- **Examples**: 'web-development', 'javascript', 'productivity'

### Category
- Use existing categories when possible
- Keep consistent across similar articles
- Examples: 'Web Development', 'Design', 'Productivity', 'Technology'

### Hero Image
- **Required**: Every article must have a hero image
- **Size**: Minimum 1200x630px for proper OG display
- **Alt text**: Descriptive, includes context
- **Credits**: Include photographer credit when applicable

### Open Graph Image
- **Custom OG images**: Preferred for each article
- **Format**: 1200x630px
- **Location**: `https://www.allthethings.dev/meta-images/og-{slug}.png`
- **Fallback**: Will use hero image if not provided

## Writing Style Guidelines

### Tone
- Conversational yet professional
- Clear and accessible
- Educational but not condescending
- Engaging and enthusiastic

### Formatting
- **Paragraphs**: 2-4 sentences each
- **Sentences**: Vary length for rhythm
- **Bold text**: Use `<strong>` for emphasis
- **Code**: Use `<code>` for inline code references
- **Links**: Use `<a>` tags with descriptive anchor text

### Technical Content
- Explain jargon on first use
- Provide context for concepts
- Include practical examples
- Show, don't just tell

## Content Block Examples

### Lead Paragraph
```typescript
{
  type: 'paragraph',
  data: {
    text: 'Your engaging opening paragraph that hooks the reader and introduces the topic.',
    className: 'lead'
  }
}
```

### Section with Heading and Content
```typescript
{
  type: 'heading',
  data: {
    level: 2,
    text: 'Your Section Title'
  }
},
{
  type: 'paragraph',
  data: {
    text: 'Section content with <strong>important points</strong> highlighted.'
  }
}
```

### Image with Caption
```typescript
{
  type: 'image',
  data: {
    src: 'https://images.unsplash.com/photo-...',
    alt: 'Descriptive alt text',
    caption: 'Helpful caption explaining the image',
    credit: 'Photographer Name',
    creditUrl: 'https://unsplash.com/@photographer'
  }
}
```

### Key Points List
```typescript
{
  type: 'list',
  data: {
    style: 'unordered',
    items: [
      '<strong>Point 1</strong>: Explanation with details',
      '<strong>Point 2</strong>: Another key insight',
      '<strong>Point 3</strong>: Final important point'
    ]
  }
}
```

## Checklist for New Articles

Before finalizing a new article, verify:

- [ ] Article has proper metadata (title, description, author, date, tags)
- [ ] Hero image is present with alt text
- [ ] Opening paragraph uses `className: 'lead'`
- [ ] Content is broken into logical sections with H2/H3 headings
- [ ] Reading time has been estimated
- [ ] Correct number of ads inserted based on reading time
- [ ] Ads are evenly distributed throughout content
- [ ] No ad is first or last content block
- [ ] Images have alt text and proper credits
- [ ] Lists and code blocks are properly formatted
- [ ] Meta description is 150-160 characters
- [ ] Tags are relevant and properly formatted
- [ ] Slug is URL-friendly (lowercase, hyphenated)
- [ ] Article added to prerender routes (if using SSG)

## Common Mistakes to Avoid

1. **Too many or too few ads**: Always follow the reading time rules
2. **Ads clustered together**: Spread them evenly
3. **Missing lead class**: First paragraph should be larger
4. **No headings**: Long articles need section breaks
5. **Missing image alt text**: Required for accessibility
6. **Too-long meta descriptions**: Keep under 160 characters
7. **Inconsistent formatting**: Follow the style guidelines
8. **Missing hero image**: Every article needs one

## Examples

See existing articles in `data/articles.data.ts` for reference implementations:
- Check the structure and content block order
- Review ad placement patterns
- Study meta description formats
- Examine tag selection

## Updates and Maintenance

This document should be updated when:
- Ad placement strategies change
- New content block types are added
- Style guidelines evolve
- SEO best practices change

---

**Last Updated**: 2025-12-23
**Maintained By**: Content team
**Questions?** Check README.md for full documentation
