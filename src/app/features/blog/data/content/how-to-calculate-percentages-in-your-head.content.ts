import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: How to Calculate Percentages in Your Head (Without Looking Like a Dunce)
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'A lot of us regular folk panic when someone asks them to figure out a percentage on the spot.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Here\'s the thing: calculating percentages in your head isn\'t hard. You just need a couple tricks that actually work.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Start with 10%',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This is your foundation for everything.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To find 10% of any number, move the decimal point one spot to the left.',
    },
  },
  {
    type: 'code',
    data: {
      code: '10% of 80 = 8\n10% of 250 = 25\n10% of 47 = 4.7',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Once you can do this, you can build almost any percentage you need.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Double It for 20%',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Need to tip 20%? Find 10%, then double it.',
    },
  },
  {
    type: 'code',
    data: {
      code: 'Bill is $73?\n10% = $7.30\nDouble that = $14.60',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Done.',
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
      text: 'Use the Benchmark Fractions',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Some percentages are just fractions in disguise:',
    },
  },
  {
    type: 'code',
    data: {
      code: '50% = half\n25% = quarter\n20% = one-fifth\n75% = three-quarters',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Want 25% of 80? That\'s just a quarter. Divide by 4. You get 20.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Need 75% of 80? That\'s 50% plus 25%. Half is 40, quarter is 20. Add them. You get 60.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Flip Trick Changes Everything',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Here\'s the mind-bender that makes hard problems easy:',
    },
  },
  {
    type: 'blockquote',
    data: {
      text: 'X% of Y is the same as Y% of X.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Need 4% of 75? That sounds annoying.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Flip it. 75% of 4. That\'s way easier. Three-quarters of 4 is 3.',
    },
  },
  {
    type: 'code',
    data: {
      code: '4% of 75 = 75% of 4 = 3',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Someone asks you for 38% of 50? Forget that. Do 50% of 38 instead. That\'s just 19.',
    },
  },
  {
    type: 'code',
    data: {
      code: '38% of 50 = 50% of 38 = 19',
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
      text: 'Break Big Percentages into Pieces',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'For something like 35%, split it up.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '35% of 80:',
    },
  },
  {
    type: 'code',
    data: {
      code: '25% of 80 = 20\n10% of 80 = 8\nAdd them: 28',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Or if you want 80% of 70, you could flip it to 70% of 80:',
    },
  },
  {
    type: 'code',
    data: {
      code: '10% of 80 = 8\nMultiply by 7: 56',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'When You Need to Ballpark It Fast',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'re just estimating, grab the first digit of each number and multiply.',
    },
  },
  {
    type: 'code',
    data: {
      code: '30% of 70?\nTake 3 × 7 = 21',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Your bill is $93 and you want to tip 20%? 9 times 2 is 18. Round up to $19 if you\'re feeling generous.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Close enough.',
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
      text: 'For Sales and Discounts',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Something\'s 20% off and costs $52?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Don\'t calculate 20% and then subtract it. That\'s extra work.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Just find 80% directly. Because if it\'s 20% off, you\'re paying 80%.',
    },
  },
  {
    type: 'code',
    data: {
      code: '10% of $52 ≈ $5\nMultiply by 8 for 80%: $40',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'The Messy Ones',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'What about 37% of 284?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Yeah, that one\'s ridiculous. But you can still get close.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Flip it: 284% of 37.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'That\'s 200% of 37 (double it: 74) plus 80% of 37.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'For 80%, you can do 37 minus 20% of 37. 20% is roughly 7. So 80% is about 30.',
    },
  },
  {
    type: 'code',
    data: {
      code: '200% of 37 = 74\n80% of 37 ≈ 30\nAdd them: 104\n\nActual answer: 105.08\nClose enough!',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'When to Just Use Your Phone',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Look, if someone needs an exact percentage of a weird number and it actually matters, pull out the calculator.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'But for tips, sales, quick estimates, and most real-life situations, these tricks get you there faster than typing numbers into your phone.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'And honestly, being able to do it in your head just feels good.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You look competent. You don\'t hold up the table fumbling with your phone. You can figure out if a sale is actually worth it while you\'re standing in the store.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'It\'s not about being a math genius. It\'s about having a handful of shortcuts that work.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
    },
  },
];
