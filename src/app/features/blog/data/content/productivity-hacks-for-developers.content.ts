import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: 10 Productivity Hacks Every Developer Should Know
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'As developers, we\'re always looking for ways to work smarter, not harder. These 10 productivity hacks will help you write code faster, stay focused, and get more done in less time.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: '1. Master Your Editor\'s Keyboard Shortcuts',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Learning keyboard shortcuts can save hours each week. Here are some essential VS Code shortcuts:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<code>Ctrl+P</code> - Quick file search',
        '<code>Ctrl+Shift+P</code> - Command palette',
        '<code>Ctrl+D</code> - Multi-cursor selection',
        '<code>Alt+Up/Down</code> - Move line up/down',
        '<code>Ctrl+/</code> - Toggle comment',
      ],
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: '2. Use Code Snippets',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Code snippets save you from typing the same boilerplate code over and over. Create custom snippets for your most common patterns.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: '3. Embrace the Pomodoro Technique',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Work in focused 25-minute sprints with 5-minute breaks. This helps maintain concentration and prevents burnout.',
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'The key to productivity is not doing more things, but doing the right things.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: '4. Automate Repetitive Tasks',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Use scripts, aliases, and build tools to automate anything you do more than twice. Here\'s an example of useful Git aliases:',
    },
  },
  {
    type: 'code',
    data: {
      language: 'bash',
      filename: '.gitconfig',
      code: `[alias]
  st = status
  co = checkout
  br = branch
  cm = commit -m
  lg = log --oneline --graph --all`,
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: '5. Keep a Developer Journal',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Document solutions to problems, code patterns you discover, and lessons learned. Future you will thank you.',
    },
  },
  {
    type: 'cta',
    data: {
      title: 'Want More Productivity Tips?',
      description:
        'Subscribe to our newsletter for weekly productivity insights and developer tips.',
      buttonText: 'Subscribe Now',
      buttonUrl: '#',
      variant: 'primary',
    },
  },
];
