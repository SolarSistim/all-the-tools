import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: JavaScript Array Methods: A Complete Reference
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'JavaScript arrays are one of the most commonly used data structures. Understanding array methods is essential for writing clean, efficient code. This guide covers the most important methods you\'ll use daily.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The map() Method',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<code>map()</code> creates a new array by transforming each element. It\'s perfect for converting data from one format to another.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Real-world example: formatting data
const users = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];

const fullNames = users.map(user =>
  \`\${user.firstName} \${user.lastName}\`
);`,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The filter() Method',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<code>filter()</code> creates a new array with elements that pass a test. Use it to remove unwanted items.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

// Real-world example: filtering users
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false },
  { name: 'Bob', age: 35, active: true }
];

const activeUsers = users.filter(user => user.active);`,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The reduce() Method',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<code>reduce()</code> is the Swiss Army knife of array methods. It reduces an array to a single value by applying a function.',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `// Sum of numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Group by category
const products = [
  { name: 'Laptop', category: 'Electronics' },
  { name: 'Shirt', category: 'Clothing' },
  { name: 'Phone', category: 'Electronics' }
];

const grouped = products.reduce((acc, product) => {
  if (!acc[product.category]) {
    acc[product.category] = [];
  }
  acc[product.category].push(product);
  return acc;
}, {});`,
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'Understanding map, filter, and reduce will make you write more declarative, readable code.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Method Chaining',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'One of the powerful features of array methods is that you can chain them together for complex transformations:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'javascript',
      code: `const users = [
  { name: 'John', age: 25, score: 80 },
  { name: 'Jane', age: 30, score: 95 },
  { name: 'Bob', age: 35, score: 70 },
  { name: 'Alice', age: 28, score: 88 }
];

// Get names of users with score > 75, sorted by score
const topPerformers = users
  .filter(user => user.score > 75)
  .sort((a, b) => b.score - a.score)
  .map(user => user.name);

console.log(topPerformers); // ['Jane', 'Alice', 'John']`,
    },
  },
  {
    type: 'divider',
    data: {
      style: 'line',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Practice Exercises',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Try these exercises to master array methods:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'ordered',
      items: [
        'Use <code>map()</code> to convert an array of temperatures from Celsius to Fahrenheit',
        'Use <code>filter()</code> to get all palindromes from an array of strings',
        'Use <code>reduce()</code> to find the product of all numbers in an array',
        'Chain methods to get the average score of students who passed (score ≥ 60)',
      ],
    },
  },
];
