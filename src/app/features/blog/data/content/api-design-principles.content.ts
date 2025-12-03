import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
