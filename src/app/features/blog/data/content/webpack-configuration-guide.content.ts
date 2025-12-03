import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
