import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
