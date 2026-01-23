import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: How to Use Social Media Launchpad: Copy, Paste, Launch Your Social Media Posts
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Posting the same update across multiple social networks is a pain. Switching tabs, reformatting text, counting characters, wondering if you used too many hashtags for LinkedIn but not enough for Instagram. It\'s tedious.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The <a href="/tools/social-media-launchpad">Social Media Launchpad</a> cuts through that. Compose once, copy what you need, paste wherever. Everything runs locally in your browser - no accounts, no servers storing your drafts, no tracking pixels watching what you type. The only thing that touches a server is the optional OG data fetch (when you want to pull a link preview), which is rate-limited to 10 per minute to prevent abuse.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-01.jpg?updatedAt=1769194628239',
      alt: 'Hero section of the Social Media Launchpad showing the rocket icon and title',
      caption: 'The Social Media Launchpad on All The Tools',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Here\'s how it works.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Step 1: Pick Your Platforms',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'On the right side of the <a href="/tools/social-media-launchpad">Social Media Launchpad</a>, you\'ll see platform buttons organized by hashtag tolerance. Reddit and 4chan sit in the "No Hashtags" group - use tags there and you\'re asking for ridicule. Pinterest and Tumblr expect them. Instagram lives somewhere in the middle.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-02.jpg?updatedAt=1769194628110',
      alt: 'Screenshot of the Platform Selector with grouped categories like Regular Use and High Hashtags',
      caption: 'Platform Selector grouped by hashtag usage',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'Pro tip: Hold Ctrl (or Cmd on Mac) while clicking a platform button to open that social network in a new tab. Your cursor will change to a link pointer!',
      icon: 'lightbulb',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Click the platforms you\'re targeting. They light up. Character counters appear at the top, one for each network.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Want to jump straight to a platform to paste your post? Hold Ctrl (Cmd on Mac) and click. Opens in a new tab. Small detail, huge time saver.',
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
      text: 'Step 2: Add Your Link',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Got a URL? Drop it in the field. Hit "Fetch OG Data" if you want the tool to pull in the page title, description, and preview image automatically.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-03.jpg?updatedAt=1769194628240',
      alt: 'The URL input section with the Fetch OG Data button and the (10 per min) hint visible',
      caption: 'URL input with OG Data fetch functionality',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The fetch limit is 10 per minute. Hit that ceiling and you\'ll see a queue number. Annoying if you\'re in a rush, but it keeps the service from getting hammered into dust. I\'ll increase this limit if I have justification to do so.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'The OG Data fetch has a rate limit of 10 requests per minute to keep the service running smoothly for everyone. If you hit the limit, you\'ll see a queue position indicator.',
      icon: 'info',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Step 3: Write Your Post',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Type your message in the description box. Watch the character bars at the top. LinkedIn gives you breathing room - 3,000 characters. X (formerly Twitter) cuts you off at 280. If you go over, the counter turns red.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-04.jpg?updatedAt=1769194628263',
      alt: 'The Content Editor section showing a description being typed and the character counters reacting',
      caption: 'Content Editor with live character count tracking',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'There\'s an emoji picker if you need it. Useful when you\'re blanking on what icon screams "professional excitement" for LinkedIn versus "chaotic energy" for Threads.',
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
      text: 'Step 4: Add Hashtags',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Below the editor is the hashtag field. Type a hastag, hit enter. The counter tracks how many you\'ve added - useful when you\'re trying to remember if three tags or ten is the sweet spot for your chosen platforms.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-05.jpg?updatedAt=1769194628209',
      alt: 'The Hashtag Input area with a few tags added and a Copy Hashtags button below',
      caption: 'Hashtag input with quick copy action',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Step 5: Copy What You Need',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Now for the payoff. You\'ve got options:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>Copy All</strong> – Grabs your URL, description, and hashtags in one shot',
        '<strong>Copy URL</strong> – Just the link',
        '<strong>Copy Description</strong> – Just your post text',
        '<strong>Copy Hashtags</strong> – Just the tags',
      ],
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Social%20Media%20Launchpad/social-media-launchpad-06.jpg?updatedAt=1769194628179',
      alt: 'The three-button layout under the description showing Copy All, Clear All, and Copy Description',
      caption: 'Quick copy actions for your content',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Why the separate buttons? Some platforms don\'t play nice when you paste everything at once. Reddit doesn\'t want your hashtag spam. LinkedIn might choke on the formatting. With individual copy options in the <a href="/tools/social-media-launchpad">Social Media Launchpad</a>, you can grab exactly what each platform needs - paste the URL and description on Facebook, hashtags only on Instagram, whatever works.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I usually hit Copy All, Ctrl+Click to open X or Threads, paste, done. Compare that to manually retyping everything with minor tweaks per platform.',
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
      text: 'Why Use This Over Manually Posting?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Speed, mostly. You compose once instead of five times. The character counters keep you honest - no more discovering you\'re 40 characters over after you\'ve already pasted into Twitter. And the privacy angle is legit; everything stays on your machine unless you explicitly fetch OG data.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Plus that Ctrl+Click shortcut. Once you start using it, going back to right-clicking and selecting "Open in New Tab" feels barbaric.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Try It Yourself',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'re tired of the tab-juggling dance every time you need to post an update, <a href="/tools/social-media-launchpad">give the Social Media Launchpad a shot</a>. No account required. No tracking. Just write, copy, paste.',
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
