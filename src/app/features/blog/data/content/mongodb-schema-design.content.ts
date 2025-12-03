import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Good schema design is crucial for MongoDB performance.',
    },
  },
  {
    type: 'heading',
    data: { level: 2, text: 'Key Principles' },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Embed when possible, reference when necessary.',
    },
  },
];
