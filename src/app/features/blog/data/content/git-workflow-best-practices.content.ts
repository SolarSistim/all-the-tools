import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'A good Git workflow makes collaboration easier and keeps your codebase clean.',
    },
  },
  {
    type: 'heading',
    data: { level: 2, text: 'Key Practices' },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: ['Use feature branches', 'Write meaningful commit messages', 'Review before merging'],
    },
  },
];
