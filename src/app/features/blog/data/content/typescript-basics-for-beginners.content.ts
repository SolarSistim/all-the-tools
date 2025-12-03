import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
