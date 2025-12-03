import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
