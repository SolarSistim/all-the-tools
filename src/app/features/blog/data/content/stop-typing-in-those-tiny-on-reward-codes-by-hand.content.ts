import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: Stop Typing In Those Tiny On! Reward Codes By Hand - There's a Better Way
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'You\'ve got a drawer full of empty On! nicotine pouches, maybe a whole shoebox worth, and you keep telling yourself you\'ll enter all those reward codes eventually. "I\'ll do it this weekend," you say, for the fourteenth weekend in a row.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Been there.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Typing out 14-character alphanumeric codes over and over? Mind-numbing. And who has that kind of patience? Definitely not after the third code when your eyes start crossing and you accidentally type a zero instead of the letter O. Again.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'That frustration is why I built the On! Reward Code Scanner over at allthethings.dev.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'How to Use the Barcode Scanner Tool: Complete Guide',
          slug: 'how-to-use-the-barcode-scanner-tool'
        }
      ]
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What\'s the Big Deal?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The On! rewards program is decent - gift cards, headphones, all sorts of gear. But manual entry? Brutal. If you\'re sitting on twenty pouches, there goes your evening.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The scanner flips that process on its head. Point your phone at the code on the bottom of your On! pouch, and boom - OCR magic happens right on you smartphone. Code gets recognized, extracted, and saved.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'What matters most: everything stays private. Your codes never leave your device. No server upload, no data collection. All OCR processing runs locally in your browser.',
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
      text: 'Getting Started: The Step-by-Step',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 1: Find the Tool',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Navigate to allthethings.dev and find the On! Reward Code Scanner, or <a href="/tools/on-reward-scanner">click here to navigate directly to it</a>.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/navigate-to-reward-code-scanner.jpg',
      alt: 'Navigate to the On! Reward Code Scanner tool',
      caption: 'Navigate to the On! Nicotine Rewards Scanner on AllTheThings.dev',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 2: Snap Your Photo',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Scroll down to the "Reward Code Scanner" area and select "Scan Reward Code".',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/click-the-scan-reward-code-button.jpg',
      alt: 'Select the Scan Reward Code button.',
      caption: 'Select the Scan Reward Code button.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Flip your On! pouch over - the reward code\'s on the back, near the top. Frame it, make sure lighting\'s decent.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'This app does not save any data on any servers. All data is only ever saved in your browser\'s local storage. Your reward codes remain completely private.',
      icon: 'shield',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'ON MOBILE: Your camera will pop up, use your mobile device\'s camera to take the picture.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'ON DESKTOP: The Open File dialog will pop up, use it to locate the image of the reward code.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/take-picture-of-nicotine-pouch.jpg',
      alt: 'Take a picture of the nicotine pouch.',
      caption: 'Take a picture of the nicotine pouch.',
    },
  },
  {
    type: 'adsense',
    data: {},
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 3: Position the Crop Box',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'After snapping, you\'ll see a draggable rectangle overlay. Drag it until it\'s sitting over your reward code. Size buttons (1-5) at the bottom let you adjust if needed - level 3 usually works.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Sometimes you\'ll need to select a much larger box that you think - you may have to tinker with it to get it just right.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/position-crop-box.jpg',
      alt: 'Size and position the crop box over the reward code.',
      caption: 'Size and position the crop box over the reward code.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'This is the part that you may have to try a couple times before a successful scan - all mobile devices, cameras and lighting are different, so each case is unique and will have to be adjusted on a per-case basis.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 4: Let OCR Work',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Hit "Scan This Area." You\'ll see a progress bar while processing. Takes a few seconds.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 5: Review and Approve',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You get an approval screen showing:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        'Preview of the scanned area',
        'The detected code',
        'Options to approve, edit, or retry',
      ],
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'If the code wasn\'t recorded correctly, you can tap or select the code to edit it directly. Make your changes, then tap/click the checkmark button to accept them. Finally, select "Approve & Save" to send the code to your saved codes table.',
      icon: 'edit',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/review-and-approve-scan.jpg',
      alt: 'Review and approved reward code scan.',
      caption: 'Review and approved reward code scan.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If OCR got something wrong (happens with poorly framed or unfocused images), tap to edit manually. Fix mistakes, tap the checkmark button, then hit "Approve & Save."',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'How to Use the Barcode Scanner Tool: Complete Guide',
          slug: 'how-to-use-the-barcode-scanner-tool'
        }
      ]
    },
  },
  {
    type: 'heading',
    data: {
      level: 3,
      text: 'Step 6: Keep Going',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Code lands in your saved table with a timestamp. Keep scanning - the workflow\'s designed for rapid-fire entry.',
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
      text: 'Managing Your Collection',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Copy All</strong> grabs every code for your clipboard. Perfect for bulk pasting into SMS or WhatsApp.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Download</strong> exports as a text file. Handy backup.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Individual actions</strong> let you copy or delete specific codes.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/stop-typing-in-those-tiny-on-reward-codes-by-hand/managing-your-codes.jpg',
      alt: 'Managing your reward codes.',
      caption: 'Managing your reward codes.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Best part? Codes persist in local storage. Close the tab, reboot - they stick around until you clear them.',
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
      text: 'When Scanning Doesn\'t Work',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'OCR isn\'t perfect. Bad lighting, faded print, shaky hands - sometimes it struggles.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'No problem. Manual entry field sits right below the scanner. Type in the code (auto-formats and validates the pattern) and hit Add.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'I designed this assuming maybe 80% scan perfectly; the other 20% will probably need help. The goal was making the process less painful, but will not likely achieve perfection.',
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
      text: 'Why This Actually Matters',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Typos eliminated.</strong> VBVTJ-49FZ-7FLB looks a lot like VBV7J-49FZ-7FLB when you\'re tired. Scanner catches it; eyes might not.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Duplicate protection.</strong> Can\'t remember what you\'ve entered? Doesn\'t matter - duplicates get rejected automatically.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Speed.</strong> Twenty codes in five minutes instead of thirty. That\'s the difference between actually doing it and "I\'ll do it this weekend."',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Privacy.</strong> Zero server uploads. All processing happens on your device. Your codes are yours.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Try the On! Reward Code Scanner',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'ve got a pile of On! pouches gathering dust, this tool was built for you. <a href="/tools/on-reward-scanner">Click here to try the On! Reward Code Scanner</a> and start clearing out that drawer.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'No signup. No tracking. Just point, scan, and redeem.',
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
];
