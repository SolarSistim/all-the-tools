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
    author: AUTHORS.joel_hansen,
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
      'Discover essential  web development tools that will boost your productivity. Learn about code editors, version control, debugging tools, and more.',
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
  }
];
