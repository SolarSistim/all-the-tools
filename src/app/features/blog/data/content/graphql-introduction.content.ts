import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
