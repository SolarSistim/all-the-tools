import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: Gradient Generator Tutorial: Create Beautiful CSS Gradients
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Creating the perfect CSS gradient by hand is frustrating. You tweak hex codes, guess at percentages, reload the page, squint at the result, and repeat until your eyes glaze over. By the time you get something passable, you\'ve wasted 20 minutes on what should\'ve been a 2-minute task.',
      className: 'lead',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The <a href="/tools/gradient-generator">Gradient Generator</a> fixes that. Pick your colors, adjust the angle, see the result instantly. Everything runs locally in your browser - no accounts, no uploads, no tracking. When you\'re happy with what you see, copy the CSS and move on with your life.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-01.jpg',
      alt: 'Hero section of the Gradient Generator showing the gradient icon and title',
      caption: 'The Gradient Generator on All The Tools',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Here\'s the complete tutorial.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Step 1: Choose Your Gradient Type',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'At the top of the <a href="/tools/gradient-generator">Gradient Generator</a>, you\'ll see three gradient type options: Linear, Radial, and Conic. Linear gradients flow in a straight line (top to bottom, left to right, or any angle in between). Radial gradients spread outward from a center point in a circular pattern. Conic gradients rotate around a center point like a color wheel.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-02.jpg',
      alt: 'Screenshot showing the three gradient type buttons: Linear, Radial, and Conic',
      caption: 'Gradient type selector with three options',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Click the type you want. The preview updates immediately. Linear is the most common - it\'s what you see in most website backgrounds and buttons. Radial works well for spotlight effects or subtle background accents. Conic gradients are less common but great for progress indicators or decorative elements.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'Pro tip: Linear gradients are the most browser-compatible and render fastest. Use them for critical UI elements where performance matters.',
      icon: 'lightbulb',
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
      text: 'Step 2: Add Your Colors',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Below the gradient type selector, you\'ll see color stops - the points where colors transition. By default, you start with two: one at 0% and one at 100%. Click a color stop to change its color using the color picker.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-03.jpg',
      alt: 'The color stops interface showing two default color stops with position sliders',
      caption: 'Color stops with position controls',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Need more than two colors? Click "Add Color Stop" to insert another point. You can add as many as you want. Each stop can be positioned anywhere along the gradient by dragging its slider or entering a percentage directly.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Want to delete a color stop? Click the trash icon next to it. You can\'t delete the first or last stop - gradients need at least two colors to work.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'For smooth, professional-looking gradients, stick to 2-3 colors. More than that often looks busy and amateurish unless you\'re going for a specific rainbow effect.',
      icon: 'palette',
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
      text: 'Step 3: Adjust the Direction',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'For linear gradients, you can control the angle. The default is 180 degrees (top to bottom). Drag the angle slider or type in a specific degree value. 0 degrees points straight up, 90 degrees goes left to right, 180 degrees goes top to bottom, and 270 degrees goes right to left.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-04.jpg',
      alt: 'The angle control slider showing degrees with a visual representation',
      caption: 'Angle control for linear gradients',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'For radial and conic gradients, you can adjust the position instead of the angle. This controls where the center point of the gradient sits - useful when you want the gradient to emanate from a corner or specific spot rather than dead center.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Step 4: Preview and Refine',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The preview box shows your gradient in real-time. Every change you make - color, position, angle - updates instantly. This is where you fine-tune. Slide colors around. Adjust the angle. Add or remove stops. Keep tweaking until it looks right.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-05.jpg',
      alt: 'Large preview panel showing the live gradient result',
      caption: 'Live gradient preview updates as you make changes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The preview is large enough to actually see what you\'re creating - not some tiny thumbnail that forces you to squint. What you see is what you get.',
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
      text: 'Step 5: Copy the CSS',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Once you\'re satisfied with your gradient, scroll down to the CSS output section. The <a href="/tools/gradient-generator">Gradient Generator</a> shows you the exact CSS code you need, complete with vendor prefixes for maximum browser compatibility.',
    },
  },
  {
    type: 'image',
    data: {
      src: 'https://ik.imagekit.io/allthethingsdev/Gradient%20Generator%20Tutorial/gradient-generator-06.jpg',
      alt: 'CSS output box showing the generated gradient code with a Copy button',
      caption: 'Generated CSS code ready to copy',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Click "Copy CSS" and paste it directly into your stylesheet. No manual formatting. No syntax errors. No wondering if you got the percentages right. It just works.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The code includes fallback colors for older browsers that don\'t support gradients. This means your design degrades gracefully instead of showing nothing to users on outdated browsers.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Why Use This Over Writing CSS By Hand?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Visual feedback. When you\'re typing hex codes and percentages into a text editor, you\'re flying blind until you reload the page. The <a href="/tools/gradient-generator">Gradient Generator</a> shows you the result immediately. No guessing. No trial and error. No reloading.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Plus, the CSS syntax for gradients is finicky. One misplaced comma or percentage sign and the whole thing breaks. The generator handles all that syntax for you. Copy, paste, move on.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'And if you\'re not a CSS gradient expert (most people aren\'t), this tutorial and tool combination lets you create professional results without memorizing the syntax rules for linear-gradient(), radial-gradient(), and conic-gradient().',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'alert-primary',
      content: 'The generator automatically includes vendor prefixes (-webkit-, -moz-, etc.) to ensure your gradients work across all browsers, including older versions of Safari and Firefox.',
      icon: 'code',
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
      text: 'Common Use Cases',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Here are some practical ways to use CSS gradients created with this tool:',
    },
  },
  {
    type: 'list',
    data: {
      style: 'unordered',
      items: [
        '<strong>Hero section backgrounds</strong> - Subtle gradients add depth to website headers without overwhelming the content',
        '<strong>Button hover states</strong> - Gradient shifts on hover create engaging micro-interactions',
        '<strong>Card backgrounds</strong> - Light gradients make content cards pop without distracting from the text',
        '<strong>Loading indicators</strong> - Animated conic gradients work great for progress spinners',
        '<strong>Text overlays</strong> - Dark-to-transparent gradients help white text stay readable over images',
      ],
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The key is subtlety. The best gradients are the ones you barely notice - they enhance the design without screaming for attention.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Try the Tool Yourself',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'If you\'re tired of wrestling with gradient syntax or reloading your page fifty times to get the colors right, <a href="/tools/gradient-generator">give the Gradient Generator a try</a>. This tutorial covered all the basics, but the best way to learn is by experimenting. No account needed. No tracking. Just pick your colors, adjust the settings, and copy the code.',
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
