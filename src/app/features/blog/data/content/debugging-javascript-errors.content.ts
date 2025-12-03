import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
