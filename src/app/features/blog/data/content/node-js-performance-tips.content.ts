import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
