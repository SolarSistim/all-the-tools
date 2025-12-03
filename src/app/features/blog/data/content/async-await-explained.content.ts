import { ContentBlock } from '../../models/blog.models';

export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Async/await makes asynchronous code look and behave more like synchronous code.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `async function fetchData() {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  return data;\n}`,
    },
  },
];
