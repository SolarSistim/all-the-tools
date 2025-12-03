import { Article } from '../models/blog.models';
import { AUTHORS } from './authors.data';

/**
 * @deprecated This file is deprecated. Article data has been split into:
 * - Metadata: articles-metadata.data.ts
 * - Content: content/ subfolder with individual files per article
 *
 * Use BLOG_ARTICLES_METADATA and loadArticleContent() instead.
 *
 * This file is kept temporarily for reference but is no longer used by the blog service.
 */

/**
 * Articles Data
 * Sample articles for the blog
 */
export const BLOG_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'getting-started-with-web-development-tools',
    title: 'Getting Started with Web Development Tools: A Complete Guide',
    description:
      'Learn about essential web development tools that will boost your productivity and help you build better websites faster.',
    author: AUTHORS.john_doe,
    publishedDate: '2025-01-15',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
      alt: 'Developer working on laptop with code on screen',
      credit: 'Christopher Gower',
      creditUrl: 'https://unsplash.com/@cgower',
    },
    tags: ['web development', 'tools', 'productivity', 'beginner'],
    category: 'Web Development',
    metaDescription:
      'Discover essential web development tools that will boost your productivity. Learn about code editors, version control, debugging tools, and more.',
    metaKeywords: [
      'web development tools',
      'developer productivity',
      'code editor',
      'debugging',
    ],
    featured: true,
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'In the world of web development, having the right tools can make all the difference between a smooth, efficient workflow and a frustrating experience. Whether you\'re just starting out or you\'re a seasoned developer, staying up-to-date with the best tools available is crucial.',
          className: 'lead',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Why Tools Matter',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Modern web development involves juggling multiple technologies, frameworks, and workflows. The right tools help you manage this complexity, catch errors early, and ship code faster. They also make the development process more enjoyable.',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Essential Tool Categories',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            '<strong>Code Editors</strong> - Where you write your code (VS Code, WebStorm, Sublime Text)',
            '<strong>Version Control</strong> - Track changes and collaborate (Git, GitHub, GitLab)',
            '<strong>Package Managers</strong> - Manage dependencies (npm, yarn, pnpm)',
            '<strong>Build Tools</strong> - Bundle and optimize code (Webpack, Vite, esbuild)',
            '<strong>Testing Tools</strong> - Ensure code quality (Jest, Cypress, Playwright)',
            '<strong>DevTools</strong> - Debug and inspect (Chrome DevTools, Firefox DevTools)',
          ],
        },
      },
      {
        type: 'image',
        data: {
          src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
          alt: 'Developer workspace with multiple monitors',
          caption: 'A well-organized developer workspace with multiple tools',
          credit: 'Greg Rakozy',
          creditUrl: 'https://unsplash.com/@grakozy',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Code Editors: Your Primary Tool',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Your code editor is where you\'ll spend most of your time. <strong>Visual Studio Code</strong> has become the industry standard, offering excellent extensions, built-in Git support, and a thriving community. But don\'t be afraid to try alternatives like <em>WebStorm</em> for a full-featured IDE experience.',
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'The best tool is the one you actually use. Don\'t get caught up in tool paralysis - pick something and master it.',
          citation: 'John Doe, Senior Developer',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Version Control with Git',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Git is non-negotiable for modern development. It allows you to track changes, collaborate with others, and revert mistakes. Here are some essential Git commands every developer should know:',
        },
      },
      {
        type: 'code',
        data: {
          language: 'bash',
          filename: 'git-basics.sh',
          code: `# Initialize a new repository
git init

# Stage and commit changes
git add .
git commit -m "Add new feature"

# Create and switch to a new branch
git checkout -b feature/new-feature

# Push changes to remote
git push origin feature/new-feature`,
        },
      },
      {
        type: 'cta',
        data: {
          title: 'Want to Learn More?',
          description:
            'Check out our comprehensive guides on mastering web development tools.',
          buttonText: 'Browse All Guides',
          buttonUrl: '/blog',
          variant: 'primary',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Conclusion',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The web development tooling ecosystem is vast and constantly evolving. Start with the essentials, master them, and gradually add more tools to your arsenal as needed. Remember, tools are meant to serve you - not the other way around.',
        },
      },
    ],
    relatedArticles: ['2', '3'],
  },
  {
    id: '2',
    slug: 'mastering-css-grid-layout',
    title: 'Mastering CSS Grid Layout: From Basics to Advanced Techniques',
    description:
      'Deep dive into CSS Grid Layout with practical examples, best practices, and advanced techniques for building responsive layouts.',
    author: AUTHORS.jane_smith,
    publishedDate: '2025-01-10',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=630&fit=crop',
      alt: 'Colorful grid pattern representing CSS Grid',
      credit: 'Pankaj Patel',
      creditUrl: 'https://unsplash.com/@pankajpatel',
    },
    tags: ['css', 'grid', 'layout', 'responsive design'],
    category: 'CSS & Design',
    metaDescription:
      'Master CSS Grid Layout with this comprehensive guide. Learn grid basics, advanced techniques, and real-world examples.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'CSS Grid Layout is one of the most powerful layout systems available in CSS. It allows you to create complex, responsive layouts with ease, replacing older techniques like floats and positioning.',
          className: 'lead',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Understanding the Grid Container',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'To use CSS Grid, you first need to define a grid container. This is done by setting <code>display: grid</code> on an element. All direct children of this element become grid items.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'css',
          filename: 'grid-basics.css',
          code: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.item {
  background: #3498db;
  padding: 1rem;
  border-radius: 4px;
}`,
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Key Grid Properties',
        },
      },
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: [
            '<code>grid-template-columns</code> - Defines the column structure',
            '<code>grid-template-rows</code> - Defines the row structure',
            '<code>gap</code> - Sets spacing between grid items',
            '<code>grid-column</code> - Controls item column placement',
            '<code>grid-row</code> - Controls item row placement',
          ],
        },
      },
      {
        type: 'gallery',
        data: {
          layout: 'grid',
          images: [
            {
              src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop',
              alt: 'Grid layout example 1',
              caption: 'Basic 3-column grid',
            },
            {
              src: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=400&h=400&fit=crop',
              alt: 'Grid layout example 2',
              caption: 'Responsive grid with auto-fit',
            },
            {
              src: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=400&h=400&fit=crop',
              alt: 'Grid layout example 3',
              caption: 'Complex nested grid',
            },
          ],
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Building a Responsive Gallery',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'One of the most common use cases for CSS Grid is creating responsive image galleries. Here\'s an example that automatically adjusts to screen size:',
        },
      },
      {
        type: 'code',
        data: {
          language: 'css',
          code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}`,
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'CSS Grid is not just about creating grids. It\'s about having precise control over your layouts in both dimensions.',
          citation: 'Rachel Andrew, CSS Expert',
          citationUrl: 'https://rachelandrew.co.uk',
        },
      },
      {
        type: 'divider',
        data: {
          style: 'dots',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Practice Makes Perfect',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The best way to learn CSS Grid is to practice. Try recreating layouts you see on websites, experiment with different grid properties, and don\'t be afraid to break things.',
        },
      },
    ],
    relatedArticles: ['3', '4'],
  },
  {
    id: '3',
    slug: 'productivity-hacks-for-developers',
    title: '10 Productivity Hacks Every Developer Should Know',
    description:
      'Boost your coding efficiency with these proven productivity techniques, keyboard shortcuts, and workflow optimizations.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2025-01-05',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop',
      alt: 'Organized desk with laptop and productivity tools',
      credit: 'Unsplash',
    },
    tags: ['productivity', 'workflow', 'tips', 'efficiency'],
    category: 'Productivity',
    metaDescription:
      '10 proven productivity hacks for developers. Learn keyboard shortcuts, workflow optimizations, and time-saving techniques.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'As developers, we\'re always looking for ways to work smarter, not harder. These 10 productivity hacks will help you write code faster, stay focused, and get more done in less time.',
          className: 'lead',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: '1. Master Your Editor\'s Keyboard Shortcuts',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Learning keyboard shortcuts can save hours each week. Here are some essential VS Code shortcuts:',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            '<code>Ctrl+P</code> - Quick file search',
            '<code>Ctrl+Shift+P</code> - Command palette',
            '<code>Ctrl+D</code> - Multi-cursor selection',
            '<code>Alt+Up/Down</code> - Move line up/down',
            '<code>Ctrl+/</code> - Toggle comment',
          ],
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: '2. Use Code Snippets',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Code snippets save you from typing the same boilerplate code over and over. Create custom snippets for your most common patterns.',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: '3. Embrace the Pomodoro Technique',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Work in focused 25-minute sprints with 5-minute breaks. This helps maintain concentration and prevents burnout.',
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'The key to productivity is not doing more things, but doing the right things.',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: '4. Automate Repetitive Tasks',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Use scripts, aliases, and build tools to automate anything you do more than twice. Here\'s an example of useful Git aliases:',
        },
      },
      {
        type: 'code',
        data: {
          language: 'bash',
          filename: '.gitconfig',
          code: `[alias]
  st = status
  co = checkout
  br = branch
  cm = commit -m
  lg = log --oneline --graph --all`,
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: '5. Keep a Developer Journal',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Document solutions to problems, code patterns you discover, and lessons learned. Future you will thank you.',
        },
      },
      {
        type: 'cta',
        data: {
          title: 'Want More Productivity Tips?',
          description:
            'Subscribe to our newsletter for weekly productivity insights and developer tips.',
          buttonText: 'Subscribe Now',
          buttonUrl: '#',
          variant: 'primary',
        },
      },
    ],
    relatedArticles: ['1', '4'],
  },
  {
    id: '4',
    slug: 'javascript-array-methods-guide',
    title: 'JavaScript Array Methods: A Complete Reference',
    description:
      'Master JavaScript array methods with practical examples. Learn map, filter, reduce, and more modern array manipulation techniques.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-12-28',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&h=630&fit=crop',
      alt: 'JavaScript code on screen',
      credit: 'Unsplash',
    },
    tags: ['javascript', 'arrays', 'programming', 'tutorial'],
    category: 'JavaScript',
    metaDescription:
      'Complete guide to JavaScript array methods. Learn map, filter, reduce, forEach, and modern array manipulation with examples.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'JavaScript arrays are one of the most commonly used data structures. Understanding array methods is essential for writing clean, efficient code. This guide covers the most important methods you\'ll use daily.',
          className: 'lead',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'The map() Method',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: '<code>map()</code> creates a new array by transforming each element. It\'s perfect for converting data from one format to another.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Real-world example: formatting data
const users = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];

const fullNames = users.map(user =>
  \`\${user.firstName} \${user.lastName}\`
);`,
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'The filter() Method',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: '<code>filter()</code> creates a new array with elements that pass a test. Use it to remove unwanted items.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

// Real-world example: filtering users
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false },
  { name: 'Bob', age: 35, active: true }
];

const activeUsers = users.filter(user => user.active);`,
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'The reduce() Method',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: '<code>reduce()</code> is the Swiss Army knife of array methods. It reduces an array to a single value by applying a function.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `// Sum of numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Group by category
const products = [
  { name: 'Laptop', category: 'Electronics' },
  { name: 'Shirt', category: 'Clothing' },
  { name: 'Phone', category: 'Electronics' }
];

const grouped = products.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = [];
  }
  acc[product.category].push(product);
  return acc;
}, {});`,
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'Understanding map, filter, and reduce will make you write more declarative, readable code.',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Method Chaining',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'One of the powerful features of array methods is that you can chain them together for complex transformations:',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `const users = [
  { name: 'John', age: 25, score: 80 },
  { name: 'Jane', age: 30, score: 95 },
  { name: 'Bob', age: 35, score: 70 },
  { name: 'Alice', age: 28, score: 88 }
];

// Get names of users with score > 75, sorted by score
const topPerformers = users
  .filter(user => user.score > 75)
  .sort((a, b) => b.score - a.score)
  .map(user => user.name);

console.log(topPerformers); // ['Jane', 'Alice', 'John']`,
        },
      },
      {
        type: 'divider',
        data: {
          style: 'line',
        },
      },
      {
        type: 'heading',
        data: {
          level: 2,
          text: 'Practice Exercises',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Try these exercises to master array methods:',
        },
      },
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: [
            'Use <code>map()</code> to convert an array of temperatures from Celsius to Fahrenheit',
            'Use <code>filter()</code> to get all palindromes from an array of strings',
            'Use <code>reduce()</code> to find the product of all numbers in an array',
            'Chain methods to get the average score of students who passed (score ≥ 60)',
          ],
        },
      },
    ],
    relatedArticles: ['1', '5'],
  },
  {
    id: '5',
    slug: 'building-accessible-websites',
    title: 'Building Accessible Websites: A Practical Guide',
    description:
      'Learn how to make your websites accessible to everyone. Discover WCAG guidelines, ARIA attributes, and testing tools.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-12-20',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=630&fit=crop',
      alt: 'Person using assistive technology',
      credit: 'Unsplash',
    },
    tags: ['accessibility', 'a11y', 'wcag', 'inclusive design'],
    category: 'Web Development',
    metaDescription:
      'Learn web accessibility best practices. Make your sites usable for everyone with WCAG guidelines, ARIA, and testing tools.',
    content: [
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
    ],
    relatedArticles: ['2', '3'],
  },
  // Additional placeholder articles for pagination testing
  {
    id: '6',
    slug: 'typescript-basics-for-beginners',
    title: 'TypeScript Basics for Beginners',
    description: 'Learn the fundamentals of TypeScript and how it enhances JavaScript development.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-12-15',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
      alt: 'TypeScript code',
    },
    tags: ['typescript', 'javascript', 'programming'],
    category: 'JavaScript',
    metaDescription: 'Introduction to TypeScript for JavaScript developers.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and class-based object-oriented programming to the language.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Why Use TypeScript?' },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: ['Catch errors at compile time', 'Better IDE support', 'Improved code documentation'],
        },
      },
    ],
  },
  {
    id: '7',
    slug: 'css-flexbox-quick-guide',
    title: 'CSS Flexbox Quick Guide',
    description: 'Master Flexbox layout in minutes with this quick reference guide.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-12-12',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop',
      alt: 'CSS code',
    },
    tags: ['css', 'flexbox', 'layout'],
    category: 'CSS & Design',
    metaDescription: 'Quick guide to CSS Flexbox layout system.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'css',
          code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
        },
      },
    ],
  },
  {
    id: '8',
    slug: 'git-workflow-best-practices',
    title: 'Git Workflow Best Practices',
    description: 'Essential Git workflows and best practices for team collaboration.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2024-12-10',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=630&fit=crop',
      alt: 'Git branches visualization',
    },
    tags: ['git', 'version control', 'workflow'],
    category: 'Web Development',
    metaDescription: 'Learn Git workflow best practices for teams.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'A good Git workflow makes collaboration easier and keeps your codebase clean.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Key Practices' },
      },
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: ['Use feature branches', 'Write meaningful commit messages', 'Review before merging'],
        },
      },
    ],
  },
  {
    id: '9',
    slug: 'responsive-design-tips',
    title: 'Responsive Design Tips for 2025',
    description: 'Modern responsive design techniques that work across all devices.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-12-08',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=1200&h=630&fit=crop',
      alt: 'Responsive design mockup',
    },
    tags: ['responsive design', 'css', 'mobile'],
    category: 'CSS & Design',
    metaDescription: 'Modern responsive design tips and techniques.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Responsive design ensures your website looks great on all screen sizes.',
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'Mobile-first design is no longer optional - it\'s essential.',
        },
      },
    ],
  },
  {
    id: '10',
    slug: 'api-design-principles',
    title: 'RESTful API Design Principles',
    description: 'Learn how to design clean, maintainable REST APIs.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-12-05',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
      alt: 'API documentation',
    },
    tags: ['api', 'rest', 'backend'],
    category: 'Web Development',
    metaDescription: 'RESTful API design principles and best practices.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Good API design makes your API easy to use and maintain.',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: ['Use proper HTTP methods', 'Version your API', 'Return consistent responses'],
        },
      },
    ],
  },
  {
    id: '11',
    slug: 'debugging-javascript-errors',
    title: 'Debugging JavaScript Like a Pro',
    description: 'Essential debugging techniques every JavaScript developer should know.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2024-12-03',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=630&fit=crop',
      alt: 'Debugging code',
    },
    tags: ['javascript', 'debugging', 'devtools'],
    category: 'JavaScript',
    metaDescription: 'Master JavaScript debugging with these pro techniques.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Debugging is an essential skill for every developer. Learn to use browser DevTools effectively.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Common Techniques' },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Use console.log, breakpoints, and the debugger statement.',
        },
      },
    ],
  },
  {
    id: '12',
    slug: 'sass-vs-less-comparison',
    title: 'Sass vs Less: Which CSS Preprocessor?',
    description: 'Comparing the two most popular CSS preprocessors.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-12-01',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=1200&h=630&fit=crop',
      alt: 'CSS preprocessor code',
    },
    tags: ['sass', 'less', 'css'],
    category: 'CSS & Design',
    metaDescription: 'Sass vs Less CSS preprocessor comparison.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Both Sass and Less are powerful CSS preprocessors, but they have different features.',
        },
      },
      {
        type: 'divider',
        data: { style: 'line' },
      },
    ],
  },
  {
    id: '13',
    slug: 'async-await-explained',
    title: 'Async/Await in JavaScript Explained',
    description: 'Understanding asynchronous JavaScript with async/await.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-11-28',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=630&fit=crop',
      alt: 'JavaScript async code',
    },
    tags: ['javascript', 'async', 'promises'],
    category: 'JavaScript',
    metaDescription: 'Learn async/await in JavaScript.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Async/await makes asynchronous code look and behave more like synchronous code.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `async function fetchData() {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  return data;\n}`,
        },
      },
    ],
  },
  {
    id: '14',
    slug: 'docker-basics-guide',
    title: 'Docker Basics: Getting Started',
    description: 'Introduction to Docker containerization for developers.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2024-11-25',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=630&fit=crop',
      alt: 'Docker containers',
    },
    tags: ['docker', 'containers', 'devops'],
    category: 'Web Development',
    metaDescription: 'Getting started with Docker containerization.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Docker makes it easy to package and deploy applications consistently.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Why Docker?' },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Consistency across environments and easy deployment.',
        },
      },
    ],
  },
  {
    id: '15',
    slug: 'webpack-configuration-guide',
    title: 'Webpack Configuration Made Simple',
    description: 'Learn how to configure Webpack for your projects.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-11-22',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop',
      alt: 'Webpack configuration',
    },
    tags: ['webpack', 'build tools', 'javascript'],
    category: 'Web Development',
    metaDescription: 'Simple guide to Webpack configuration.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Webpack is a powerful module bundler for JavaScript applications.',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: ['Configure entry points', 'Set up loaders', 'Add plugins'],
        },
      },
    ],
  },
  {
    id: '16',
    slug: 'react-vs-angular-comparison',
    title: 'React vs Angular: Framework Comparison',
    description: 'Comparing two popular frontend frameworks.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-11-20',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      alt: 'React and Angular logos',
    },
    tags: ['react', 'angular', 'frameworks'],
    category: 'Web Development',
    metaDescription: 'React vs Angular framework comparison.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Both React and Angular are excellent choices for building web applications.',
        },
      },
      {
        type: 'blockquote',
        data: {
          text: 'Choose the framework that best fits your team and project needs.',
        },
      },
    ],
  },
  {
    id: '17',
    slug: 'node-js-performance-tips',
    title: 'Node.js Performance Optimization',
    description: 'Tips to improve your Node.js application performance.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2024-11-18',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&h=630&fit=crop',
      alt: 'Node.js code',
    },
    tags: ['nodejs', 'performance', 'backend'],
    category: 'Web Development',
    metaDescription: 'Node.js performance optimization tips.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Optimize your Node.js applications for better performance and scalability.',
        },
      },
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: ['Use async operations', 'Implement caching', 'Optimize database queries'],
        },
      },
    ],
  },
  {
    id: '18',
    slug: 'mongodb-schema-design',
    title: 'MongoDB Schema Design Best Practices',
    description: 'Learn how to design efficient MongoDB schemas.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-11-15',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop',
      alt: 'Database design',
    },
    tags: ['mongodb', 'database', 'nosql'],
    category: 'Web Development',
    metaDescription: 'MongoDB schema design best practices.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Good schema design is crucial for MongoDB performance.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Key Principles' },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Embed when possible, reference when necessary.',
        },
      },
    ],
  },
  {
    id: '19',
    slug: 'vue-composition-api',
    title: 'Vue 3 Composition API Guide',
    description: 'Getting started with Vue 3 Composition API.',
    author: AUTHORS.jane_smith,
    publishedDate: '2024-11-12',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=630&fit=crop',
      alt: 'Vue.js code',
    },
    tags: ['vue', 'javascript', 'frontend'],
    category: 'JavaScript',
    metaDescription: 'Learn Vue 3 Composition API.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'The Composition API provides better code organization and reusability.',
        },
      },
      {
        type: 'code',
        data: {
          language: 'javascript',
          code: `import { ref, computed } from 'vue';\n\nconst count = ref(0);\nconst doubled = computed(() => count.value * 2);`,
        },
      },
    ],
  },
  {
    id: '20',
    slug: 'graphql-introduction',
    title: 'GraphQL: A Modern API Approach',
    description: 'Introduction to GraphQL and why it matters.',
    author: AUTHORS.alex_johnson,
    publishedDate: '2024-11-10',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
      alt: 'GraphQL schema',
    },
    tags: ['graphql', 'api', 'backend'],
    category: 'Web Development',
    metaDescription: 'Introduction to GraphQL API.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'GraphQL provides a more efficient, powerful alternative to REST.',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: ['Request exactly what you need', 'Single endpoint', 'Strong typing'],
        },
      },
    ],
  },
  {
    id: '21',
    slug: 'web-security-essentials',
    title: 'Web Security Essentials Every Developer Should Know',
    description: 'Critical security practices for web development.',
    author: AUTHORS.john_doe,
    publishedDate: '2024-11-08',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
      alt: 'Security lock',
    },
    tags: ['security', 'web development', 'best practices'],
    category: 'Web Development',
    metaDescription: 'Essential web security practices for developers.',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Security should be a top priority in every web application.',
        },
      },
      {
        type: 'heading',
        data: { level: 2, text: 'Common Vulnerabilities' },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: ['XSS attacks', 'SQL injection', 'CSRF', 'Authentication flaws'],
        },
      },
    ],
  },
];
