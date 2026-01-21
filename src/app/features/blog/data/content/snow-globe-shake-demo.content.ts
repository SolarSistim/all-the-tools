import { Article } from '../../models/blog.models';
import { AUTHORS } from '../authors.data';

export const SNOW_GLOBE_SHAKE_DEMO: Article = {
  id: '103',
  title: 'Snow Globe Shake Demo',
  slug: 'snow-globe-shake-demo',
  category: 'Art',
  publishedDate: '01-21-2026',
  description: 'A minimal demo post that showcases my interactive Pixel Art Snowglobe. Click/tap to select the snowglobe and give it a shake!',
  author: AUTHORS.joel_hansen,
  tags: ['Art', 'Interactive', 'Demo', 'Snow Globe'],
  metaDescription: 'Watch the Snow Globe Shake component in action in this minimal demo post.',
  metaKeywords: ['snow globe', 'snowglobe', 'interactive art', 'canvas demo', 'matter.js'],
  heroImage: {
    src: 'https://placehold.co/1200x630/0b1f2a/9be7ff?text=Snow+Globe+Shake',
    alt: 'Snow Globe Shake demo',
  },
  content: [
    {
      type: 'heading',
      data: {
        level: 2,
        text: '↓ Scroll down for the snowglobe',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'This whole thing started with a doodle of a snow globe on a napkin while I thought "maybe I can make that move". I am not a physics programmer, not even close, and I still have to Google what half the Matter.js settings do, so this was a little bit difficult for me. It was messy, kind of ridiculous, and surprisingly fun once I stopped pretending I knew exactly what I was doing.',
        className: 'lead',
      },
    },
    {
      type: 'adsense',
      data: {
        adClient: 'ca-pub-7077792325295668',
        adSlot: '3887470191',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'The core idea is a canvas that renders a 1024 by 1024 scene, then a physics world that keeps a bunch of snowflake particles inside a circular boundary. I used Matter.js because it is approachable, battle tested, and it let me get a "good enough" result without writing my own solver, which would have been a catastrophe. The globe itself is a static body, and the snow is a swarm of tiny circles with just enough friction and air resistance to settle instead of skittering around.',
      },
    },
    {
      type: 'heading',
      data: {
        level: 2,
        text: 'Shake the snowglobe!',
      },
    },
    {
      type: 'component',
      data: {
        componentName: 'snow-globe-shake',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'If you poke around the component, you will see I load a handful of PNG layers and draw them in order, like a little stage play: background, castle, snow, glass, reflection, base. That order matters, and I learned it the hard way when my snowflakes looked like they were floating outside the glass. There is a translation step that keeps the visuals glued to the globe body, which was another humbling lesson in coordinate space.',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Shaking is the fun part, and also the most difficult part. Dragging the globe is basically a controlled cheat, because I pin the globe to the mouse and manually set velocity so the snow gets nudged around. It is not physically pure, but it feels ok, which is the real goal. I tried a more "correct" approach first and the globe just slammed into the floor, which was funny, but not the vibe I was looking for.',
      },
    },
    {
      type: 'adsense',
      data: {
        adClient: 'ca-pub-7077792325295668',
        adSlot: '3887470191',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'The snow behavior is a mix of gravity, drag, and a little sideways sway so the flakes feel alive instead of dead weight. I also added a "sleep" rule for flakes that have settled, because if you keep everything awake forever, the bottom pile starts to jitter and you get a weird popcorn effect, that you can probably still see a little of. That tweak saved the scene from looking too glitchy, and it is the kind of thing you only discover after staring at a wobbly pile of dots for a half hour.',
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'There are still quirks I can see, like the flakes occasionally clustering near the center when you stop shaking. I could probably clean up the math, and maybe I should, but there is something honest about the scrappy parts too. This was a stretch project, and I am okay admitting it was beyond my comfort zone.',
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
        text: 'I learned a lot from this, mostly that I can do more with physics than I thought, but also that patience beats cleverness. There were moments where I wanted to toss the whole thing, particularly when the snow refused to settle or the layering was off by a few pixels, but then it clicked. That feeling, when the flakes finally tumble the way your brain more or less expects, is glorious. So go ahead, drag the globe around, and if it feels like a little winter magic, I will take the win.',
      },
    },
  ],
};
