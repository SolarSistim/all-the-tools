import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: I Built a Roku Compatibility Checker (And This Is Why You Might Need It)
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'I\'ve been buying mostly used Rokus for a decade. I now have about a dozen Rokus, one in every room of my house and a bunch sitting in drawers.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Every time I need to see what features a Roku has or what hardware it\'s compatible with, I end up googling for an hour. Will these wireless speakers work? Does this remote have voice commands? Is this soundbar compatible with my Roku Express?',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Why This Sucks',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Roku has made almost 100 different products, and there are about 1300 different 3rd party TV manufacturers.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'When you want to know if your model supports 4K or HDR or Dolby Vision or works with certain accessories, good luck finding out. The information exists somewhere, but also somehow nowhere.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The wireless speaker situation is the worst. I\'ve almost bought the wrong product so many times because manufacturers bury compatibility details in PDF spec sheets or scatter them across random support pages.',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What Finally Made Me Do Something',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Last time I spent two hours trying to figure out if a soundbar would work with one of my older Rokus, I lost it.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I spent the next week compiling specs for every Roku product I could find.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Then I built a simple web tool.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'How It Works',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You pick your Roku model from a dropdown and you\'ll see what features it supports. You\'ll see compatible remotes, speakers, and accessories. You\'ll see whether it has 4K, HDR, or voice controls.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'No hunting through support pages or guessing before you drop the money on a Roku product.',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Some Things You Should Know',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Roku pushes firmware updates that add or remove features, so specs change. I\'ve tried to keep things accurate, but you should still double check before buying.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Use this tool as a companion when you buy a new Roku product, but always double check the Roku\'s specifications. This tool should get you pretty close to the Roku model you need, then use your brain from there.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you spot something wrong or missing, let me know. I update this constantly.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Why I\'m Putting This Out There',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If I have a dozen Rokus, you probably have a few too and you\'ve probably dealt with this same frustration.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'ve ever stood in a store googling whether something works with your Roku, I built this for you.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'It won\'t answer every question, but it gets you most of the way there.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Check it out. Bookmark it. Hopefully it saves you from the same rabbit holes I\'ve been stuck in.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Use the Roku Compatibility Checker Here:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Or <a href="/tools/roku-compatibility">click here to go to the full compatibility checker</a>',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'roku-checker',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
];
