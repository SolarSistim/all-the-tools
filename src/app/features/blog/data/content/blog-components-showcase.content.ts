import { Article } from '../../models/blog.models';
import { AUTHORS } from '../authors.data';

export const BLOG_COMPONENTS_SHOWCASE: Article = {
  id: '100',
  title: 'Blog Components Showcase - Developer Reference',
  slug: 'blog-components-showcase',
  category: 'Documentation',
  publishedDate: '01-19-2026',
  description: 'A comprehensive showcase of all available blog components with JSON examples for easy reference.',
  author: AUTHORS.joel_hansen,
  tags: ['Documentation', 'Reference', 'Components'],
  metaDescription: 'Complete reference guide for all blog components available in the system.',
  metaKeywords: ['blog components', 'documentation', 'reference', 'examples'],
  heroImage: {
    src: 'https://placehold.co/1200x630/1a1f35/00d9ff?text=Component+Showcase',
    alt: 'Blog Components Showcase',
  },
  content: [
    {
      type: 'component',
      data: {
        componentName: 'social-media-links',
        backgroundVariant: 'dark',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'This article showcases all available blog components with working examples and the JSON code you need to use them in your own articles.',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // HEADING COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '1. Heading Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Headings are used to structure your content. Available levels are 2-6.',
      },
    },
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'This is a Level 3 Heading',
      },
    },
    {
      type: 'heading',
      data: {
        level: 4,
        text: 'This is a Level 4 Heading',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'heading',
  data: {
    level: 2,
    text: 'Your Heading Text',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // PARAGRAPH COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '2. Paragraph Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Paragraphs are the basic text blocks. They support HTML formatting like <strong>bold</strong>, <em>italic</em>, and <a href="#">links</a>.',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'paragraph',
  data: {
    text: 'Your paragraph text here. Supports HTML tags.',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // IMAGE COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '3. Image Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Single images with optional captions.',
      },
    },
    {
      type: 'gallery',
      data: {
        images: [
          {
            src: 'https://ik.imagekit.io/allthethingsdev/The%20Remarkable%20Work%20of%20Howard%20Day/USS-Niimiipuu-01.jpg?updatedAt=1768758216429',
            alt: 'Example image',
            caption: 'This is an example image with a caption',
          },
        ],
        layout: 'grid',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'image',
  data: {
    src: 'https://example.com/image.jpg',
    alt: 'Image description',
    caption: 'Optional caption text',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // GALLERY COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '4. Image Gallery Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Display multiple images in a responsive gallery layout.',
      },
    },
    {
      type: 'gallery',
      data: {
        images: [
          {
            src: 'https://ik.imagekit.io/allthethingsdev/The%20Remarkable%20Work%20of%20Howard%20Day/USS-Krakatoa-01.jpg?updatedAt=1768758216413',
            alt: 'Gallery image 1',
            caption: 'First gallery image',
          },
          {
            src: 'https://ik.imagekit.io/allthethingsdev/The%20Remarkable%20Work%20of%20Howard%20Day/USS-Niimiipuu-02.jpg?updatedAt=1768758216483',
            alt: 'Gallery image 2',
            caption: 'Second gallery image',
          },
          {
            src: 'https://ik.imagekit.io/allthethingsdev/The%20Remarkable%20Work%20of%20Howard%20Day/Immobilizer-418-02.jpg?updatedAt=1768758216537',
            alt: 'Gallery image 3',
            caption: 'Third gallery image',
          },
        ],
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'gallery',
  data: {
    images: [
      {
        src: 'https://example.com/image1.jpg',
        alt: 'Image 1 description',
        caption: 'Image 1 caption',
      },
      {
        src: 'https://example.com/image2.jpg',
        alt: 'Image 2 description',
        caption: 'Image 2 caption',
      },
    ],
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // BLOCKQUOTE COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '5. Blockquote Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Use blockquotes to highlight important quotes or statements.',
      },
    },
    {
      type: 'blockquote',
      data: {
        text: 'This is an example blockquote. Use it to highlight important information, quotes from sources, or key takeaways.',
        author: 'Optional Author Name',
        source: 'Optional Source',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'blockquote',
  data: {
    text: 'Your quote text here',
    author: 'Author Name (optional)',
    source: 'Source (optional)',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // CODE BLOCK COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '6. Code Block Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Display syntax-highlighted code blocks.',
      },
    },
    {
      type: 'code',
      data: {
        code: `function example() {
  console.log('This is a code example');
  return true;
}`,
        language: 'javascript',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'code',
  data: {
    code: 'Your code here',
    language: 'javascript', // or 'typescript', 'json', 'html', etc.
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // LIST COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '7. List Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Create ordered or unordered lists.',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: '<strong>Unordered List Example:</strong>',
      },
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'First unordered item',
          'Second unordered item',
          'Third unordered item with <strong>HTML formatting</strong>',
        ],
      },
    },
    {
      type: 'paragraph',
      data: {
        text: '<strong>Ordered List Example:</strong>',
      },
    },
    {
      type: 'list',
      data: {
        style: 'ordered',
        items: [
          'First ordered item',
          'Second ordered item',
          'Third ordered item',
        ],
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'list',
  data: {
    style: 'unordered', // or 'ordered'
    items: [
      'First item',
      'Second item with <strong>HTML</strong>',
      'Third item',
    ],
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // VIDEO EMBED COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '8. Video Embed Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Embed YouTube or Vimeo videos. The component automatically detects the platform.',
      },
    },
    {
      type: 'video',
      data: {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Example Video Title',
        description: 'This is an example of an embedded video.',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'video',
  data: {
    url: 'https://www.youtube.com/watch?v=VIDEO_ID',
    title: 'Video title (optional)',
    description: 'Video description (optional)',
    platform: 'youtube', // optional: 'youtube' or 'vimeo', auto-detected if omitted
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // AUDIO PLAYER COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '9. Audio Player Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Add audio files with a custom player that includes waveform visualization.',
      },
    },
    {
      type: 'audio',
      data: {
        src: 'https://5l50ubfz3u.ucarecd.net/62d7d09b-ddc5-439a-b325-3acaf5b83175/cbeamsthetopdownspaceactionrpgthatgetsit.mp3',
        title: 'Listen to this article',
        description: 'Prefer to listen? Play the audio version of this article.',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'audio',
  data: {
    src: 'https://5l50ubfz3u.ucarecd.net/your-audio-file.mp3',
    title: 'Audio title (optional)',
    description: 'Audio description (optional)',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // CTA COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '10. Call-to-Action (CTA) Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Create prominent call-to-action sections with buttons.',
      },
    },
    {
      type: 'cta',
      data: {
        title: 'Ready to Learn More?',
        description: 'Check out our comprehensive guide to get started with these components.',
        buttonText: 'Get Started',
        buttonUrl: '#',
        variant: 'primary',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'cta',
  data: {
    title: 'CTA Title',
    description: 'CTA description text',
    buttonText: 'Button Text',
    buttonUrl: 'https://example.com',
    variant: 'primary', // or 'secondary'
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // MOVIE POSTER COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '11. Movie Poster Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Display movie posters with captions and custom dimensions.',
      },
    },
    {
      type: 'moviePoster',
      data: {
        src: 'https://ik.imagekit.io/allthethingsdev/How%20Badlands%20Demystifies%20the%20Yautja/predator-badlands-dvd-cover-art.jpg?updatedAt=1768759474134',
        alt: 'Predator: Badlands (2025) Movie Poster',
        caption: 'Example movie poster with custom width and height',
        width: 70,
        height: 105,
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'moviePoster',
  data: {
    src: 'https://example.com/poster.jpg',
    alt: 'Movie poster description',
    caption: 'Optional caption text',
    width: 70, // percentage width
    height: 105, // percentage height
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // ALERT COMPONENTS
    {
      type: 'heading',
      data: {
        level: 2,
        text: '12. Alert Components',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Display alert messages in different styles: primary (info), success, warning, and danger.',
      },
    },

    // Alert Primary
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Alert Primary (Information)',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'alert-primary',
        title: 'Information',
        content: 'This is an informational alert to provide helpful context or guidance.',
        icon: 'info',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'alert-primary',
    title: 'Information',
    content: 'Your alert message here',
    icon: 'info', // optional
  },
}`,
        language: 'json',
      },
    },

    // Alert Success
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Alert Success',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'alert-success',
        title: 'Success!',
        content: 'Operation completed successfully. Your changes have been saved.',
        icon: 'check_circle',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'alert-success',
    title: 'Success!',
    content: 'Your success message here',
    icon: 'check_circle', // optional
  },
}`,
        language: 'json',
      },
    },

    // Alert Warning
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Alert Warning',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'alert-warning',
        title: 'Warning',
        content: 'Please review your input. Some fields may need attention before proceeding.',
        icon: 'warning',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'alert-warning',
    title: 'Warning',
    content: 'Your warning message here',
    icon: 'warning', // optional
  },
}`,
        language: 'json',
      },
    },

    // Alert Danger
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Alert Danger (Error)',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'alert-danger',
        title: 'Error',
        content: 'An error occurred. Please check your input and try again.',
        icon: 'error',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'alert-danger',
    title: 'Error',
    content: 'Your error message here',
    icon: 'error', // optional
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // DIVIDER COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '13. Divider Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Add visual dividers to separate sections. (See the horizontal lines between sections in this article)',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'divider',
  data: {},
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // ADSENSE COMPONENT
    {
      type: 'heading',
      data: {
        level: 2,
        text: '14. AdSense Component',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Insert Google AdSense ads into your content.',
      },
    },
    {
      type: 'adsense',
      data: {
        adClient: 'ca-pub-7077792325295668',
        adSlot: '3887470191',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'adsense',
  data: {
    adClient: 'ca-pub-XXXXXXXXXXXXXXXX',
    adSlot: 'XXXXXXXXXX',
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // CUSTOM COMPONENTS
    {
      type: 'heading',
      data: {
        level: 2,
        text: '15. Other Custom Components',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Several custom components are available for specific use cases.',
      },
    },

    // Email CTA
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Email Newsletter CTA',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'email-cta',
        darkThemeBg: 'secondary',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'email-cta',
    darkThemeBg: 'secondary', // or 'primary'
  },
}`,
        language: 'json',
      },
    },

    // Related Blog Posts
    {
      type: 'heading',
      data: {
        level: 3,
        text: 'Related Blog Posts Component',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'related-blog-posts',
        posts: [
          {
            title: 'One Man, One PC, Cinema-Quality Starships: The Remarkable Work of Howard Day',
            slug: 'one-man-one-pc-cinema-quality-starships-howard-day',
          },
        ],
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component',
  data: {
    componentName: 'related-blog-posts',
    posts: [
      {
        title: 'Article Title',
        slug: 'article-slug',
      },
    ],
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'divider',
      data: {},
    },

    // CONCLUSION
    {
      type: 'heading',
      data: {
        level: 2,
        text: 'Quick Reference',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'All components are defined in your article\'s content array. Each component follows the same pattern:',
      },
    },
    {
      type: 'code',
      data: {
        code: `{
  type: 'component-type',
  data: {
    // component-specific properties
  },
}`,
        language: 'json',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Copy and paste the JSON examples from this page to quickly add components to your articles. Remember to update the data properties with your actual content.',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'social-media-links',
        backgroundVariant: 'dark',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'email-cta',
        darkThemeBg: 'primary',
      },
    },
  ],
};
