import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: Mastering CSS Grid Layout
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'CSS Grid Layout is one of the most powerful layout systems available in CSS. It allows you to create complex, responsive layouts with ease, replacing older techniques like floats and positioning.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Understanding the Grid Container',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To use CSS Grid, you first need to define a grid container. This is done by setting <code>display: grid</code> on an element. All direct children of this element become grid items.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'css',
      filename: 'grid-basics.css',
      code: `.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.item {
  background: #3498db;
  padding: 1rem;
  border-radius: 4px;
}`,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Key Grid Properties',
    },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: [
        '<code>grid-template-columns</code> - Defines the column structure',
        '<code>grid-template-rows</code> - Defines the row structure',
        '<code>gap</code> - Sets spacing between grid items',
        '<code>grid-column</code> - Controls item column placement',
        '<code>grid-row</code> - Controls item row placement',
      ],
    },
  },
  {
    type: 'gallery',
    data: {
      layout: 'grid',
      images: [
        {
          src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop',
          alt: 'Grid layout example 1',
          caption: 'Basic 3-column grid',
        },
        {
          src: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=400&h=400&fit=crop',
          alt: 'Grid layout example 2',
          caption: 'Responsive grid with auto-fit',
        },
        {
          src: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=400&h=400&fit=crop',
          alt: 'Grid layout example 3',
          caption: 'Complex nested grid',
        },
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Building a Responsive Gallery',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One of the most common use cases for CSS Grid is creating responsive image galleries. Here\'s an example that automatically adjusts to screen size:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'css',
      code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}`,
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'CSS Grid is not just about creating grids. It\'s about having precise control over your layouts in both dimensions.',
      citation: 'Rachel Andrew, CSS Expert',
      citationUrl: 'https://rachelandrew.co.uk',
    },
  },
  {
    type: 'divider',
    data: {
      style: 'dots',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Practice Makes Perfect',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The best way to learn CSS Grid is to practice. Try recreating layouts you see on websites, experiment with different grid properties, and don\'t be afraid to break things.',
    },
  },
];
