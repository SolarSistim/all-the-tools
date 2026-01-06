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
    type: 'heading',
    data: {
      level: 2,
      text: 'The Bottom Line',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I built a free tool that lets you select any Roku model and instantly see its features, compatible accessories, and limitations. No more digging through spec sheets or guessing whether that soundbar will work with your Roku Express. Pick your model, get your answers.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What You Can Check',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Select your Roku model from the dropdown and you\'ll instantly see:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>Video capabilities</strong> – 4K, HDR, and Dolby Vision support',
        '<strong>Remote features</strong> – Voice control, Voice Remote Pro compatibility, hands-free voice, remote finder',
        '<strong>Audio compatibility</strong> – Wireless speakers, wireless bass, Bluetooth headphone mode',
        '<strong>Smart home integration</strong> – Apple AirPlay, Apple HomeKit, Google Assistant, Amazon Alexa',
        '<strong>Connectivity</strong> – Built-in ethernet, ethernet adapter support, WiFi type',
        '<strong>Gaming</strong> – Netflix Games support, gaming console compatibility',
      ],
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
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
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
    type: 'component',
    data: {
      componentName: 'email-cta',
      darkThemeBg: 'primary',
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
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Frequently Asked Questions',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Which Rokus support 4K?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The following Roku streaming players support 4K: Roku Streaming Stick+ (3810, 3811), Roku Streaming Stick 4K (3820), Roku Streaming Stick 4K+ (3821), Roku Express 4K (3940), Roku Express 4K+ (3941), Roku Premiere (3920, 4620), Roku Premiere+ (3921, 4630), Roku 4 (4400, 440), and all Roku Ultra models (4600, 4640, 4660, 4661, 4670, 4800, 4802, 4850). Many Roku TVs also support 4K depending on the model and panel. The basic Roku Express, Roku HD, and older Roku Streaming Sticks do not support 4K.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Which Rokus work with wireless speakers?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Wireless speaker compatibility is limited to select devices. The Roku Ultra (models 4800, 4801, 4802, 4850) supports wireless speakers. Most Roku TVs (depending on model year and series) support wireless speakers as well. The Roku Wireless Speakers (9020R2, 9030) and onn. Roku Wireless Surround Speakers (9040) are designed to work with compatible Roku TVs, Streambars, and Soundbars. Basic streaming players like the Roku Express, Roku Premiere, and Roku Streaming Stick do not support wireless speakers.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Which Roku remotes have voice control?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Almost all current Roku streaming players support the standard Voice Remote. For Voice Remote Pro compatibility (which adds features like hands-free voice, a rechargeable battery, and a remote finder), you\'ll need: Roku Streaming Stick (3840X), Roku Streaming Stick Plus (3830X), Roku Streaming Stick+ (3810, 3811), Roku Streaming Stick 4K (3820), Roku Streaming Stick 4K+ (3821), Roku Ultra (4800, 4801, 4802, 4850), or a recent Roku TV. Older models like the Roku Express, Roku HD, and legacy Roku 2/3 devices support the basic Voice Remote but not the Voice Remote Pro.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'What\'s the difference between Roku Express and Roku Ultra?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The Roku Express is the budget-friendly option: it streams in 1080p HD (no 4K), doesn\'t support wireless speakers or wireless bass, has no built-in ethernet, and works with the standard Voice Remote but not the Voice Remote Pro. It\'s fine for basic streaming on a secondary TV.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The Roku Ultra is the flagship model: it streams in 4K with HDR, supports wireless speakers and wireless bass (on models 4800+), has built-in ethernet, includes Bluetooth audio streaming, supports the Voice Remote Pro with hands-free voice and remote finder, and works with Apple AirPlay and HomeKit. If you want the best performance and accessory compatibility, the Ultra is worth the upgrade.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'What channels are free with Roku?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Roku gives you access to dozens of free streaming channels without any subscription:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>The Roku Channel</strong> – Free movies, TV shows, live news, and entertainment',
        '<strong>Pluto TV</strong> – Live TV channels and on-demand content across many genres',
        '<strong>Tubi</strong> – Large library of free movies and series',
        '<strong>Plex</strong> – Movies, TV shows, and live TV',
        '<strong>Freevee (Amazon)</strong> – Free movies and shows with ads',
        '<strong>Filmrise</strong> – Movies, documentaries, and TV shows',
        '<strong>Redbox</strong> – Free movies and TV',
        '<strong>Crackle</strong> – Free movies and TV shows',
        '<strong>Kanopy/Hoopla</strong> – Free with a library card, great for films and documentaries',
        '<strong>ABC News / NBC News Now / CBS News</strong> – Live breaking news',
        '<strong>Bloomberg TV / Reuters / Cheddar</strong> – Business and world news',
        '<strong>WeatherNation / AccuWeather Now</strong> – Live weather coverage',
        '<strong>The CW</strong> – Current and past network shows',
        '<strong>YouTube / Vevo</strong> – Music videos and user-uploaded content',
        '<strong>PBS & PBS KIDS</strong> – Educational and cultural programming',
        '<strong>TuneIn / Pandora</strong> – Radio and podcasts',
        '<strong>Shout Factory TV</strong> – Classic TV and movies',
      ],
    },
  },
];
