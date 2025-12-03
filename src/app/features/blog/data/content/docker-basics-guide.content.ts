import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
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
];
