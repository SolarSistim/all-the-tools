import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: Building Accessible Websites: A Practical Guide
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Web accessibility means making websites usable by everyone, including people with disabilities. It\'s not just the right thing to do—it\'s often legally required and makes business sense.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Why Accessibility Matters',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Over 1 billion people worldwide have disabilities. By making your site accessible, you reach a larger audience and provide a better experience for everyone.',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Screen reader users need proper semantic HTML',
        'Keyboard-only users need visible focus indicators',
        'Color-blind users need sufficient color contrast',
        'Motor-impaired users need large click targets',
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Semantic HTML',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Using the right HTML elements is the foundation of accessibility. Compare these examples:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'html',
      code: `<!-- Bad: generic div -->
<div onclick="handleClick()">Click me</div>

<!-- Good: semantic button -->
<button onclick="handleClick()">Click me</button>

<!-- Bad: div with click handler -->
<div class="nav-item" onclick="navigate()">Home</div>

<!-- Good: proper navigation -->
<nav>
  <a href="/">Home</a>
</nav>`,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'ARIA Attributes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'ARIA (Accessible Rich Internet Applications) provides additional context for assistive technologies:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'html',
      code: `<!-- Labeling an icon button -->
<button aria-label="Close dialog">
  <span aria-hidden="true">&times;</span>
</button>

<!-- Indicating loading state -->
<button aria-busy="true" aria-live="polite">
  Loading...
</button>

<!-- Describing form inputs -->
<label for="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-help"
/>
<small id="email-help">We'll never share your email</small>`,
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'The first rule of ARIA: Don\'t use ARIA. Use native HTML elements whenever possible.',
      citation: 'ARIA Authoring Practices Guide',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Color Contrast',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'WCAG requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Use tools like the WebAIM Contrast Checker to verify your colors.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=800&h=500&fit=crop',
      alt: 'Color contrast comparison chart',
      caption: 'Example of good vs poor color contrast',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Testing Tools',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Use these tools to test accessibility:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>axe DevTools</strong> - Browser extension for automated testing',
        '<strong>WAVE</strong> - Visual feedback about accessibility',
        '<strong>Lighthouse</strong> - Built into Chrome DevTools',
        '<strong>Screen Readers</strong> - NVDA (Windows), JAWS (Windows), VoiceOver (Mac)',
      ],
    },
  },
  {
    type: 'cta',
    data: {
      title: 'Learn More About Accessibility',
      description:
        'Check out the WCAG guidelines and start making your websites more inclusive today.',
      buttonText: 'View WCAG Guidelines',
      buttonUrl: 'https://www.w3.org/WAI/WCAG21/quickref/',
      variant: 'primary',
    },
  },
  {
    type: 'divider',
    data: {
      style: 'stars',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Start Small',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Don\'t try to fix everything at once. Start with the basics: semantic HTML, keyboard navigation, and alt text for images. Then gradually improve from there.',
    },
  },
];
