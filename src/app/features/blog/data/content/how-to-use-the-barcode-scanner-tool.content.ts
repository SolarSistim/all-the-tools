import { ContentBlock } from '../../models/blog.models';

/**
 * Article Content: How to Use the Barcode Scanner Tool
 */
export const content: ContentBlock[] = [
  {
    type: 'paragraph',
    data: {
      text: 'Scanning barcodes with your phone or computer has never been easier. Our free <a href="/tools/barcode-reader">barcode scanner tool</a> lets you scan product codes instantly using your device camera—no dedicated hardware needed.',
      className: 'lead',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'What is the Barcode Scanner?',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The barcode scanner is a free web-based tool that reads retail product barcodes using your device\'s camera. It supports all major barcode formats including UPC-A, UPC-E, EAN-13, EAN-8, Code 128, Code 39, ITF, and QR codes.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'How to Scan Reward Codes: Stop Typing Tiny Codes by Hand',
          slug: 'stop-typing-in-those-tiny-on-reward-codes-by-hand'
        }
      ]
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Unlike traditional barcode scanners that require expensive hardware, this tool works entirely in your browser. All processing happens locally on your device, which means your scanned codes never leave your computer or phone—perfect for privacy-sensitive inventory management or personal cataloging.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Getting Started',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'To start using the barcode scanner, simply navigate to the <a href="/tools/barcode-reader">barcode reader tool page</a>. No installation, registration, or downloads required.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/how-to-use-the-barcode-scanner-tool/barcode-scanner-01.jpg',
      alt: 'Barcode scanner landing page with hero section and Scan Barcode button',
      caption: 'The barcode scanner tool landing page with the main "Scan Barcode" button',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'How to Scan a Barcode',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Scanning a barcode is straightforward:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Step 1: Click the "Scan Barcode" button</strong><br>On the main page, you\'ll see a large blue button labeled "Scan Barcode" with a camera icon. Click this button to activate your device camera.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/how-to-use-the-barcode-scanner-tool/barcode-scanner-02.jpg',
      alt: 'Scanner interface in idle state ready to scan barcodes',
      caption: 'Scanner ready state showing supported barcode formats and the Scan Barcode button',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Step 2: Allow camera permissions</strong><br>Your browser will ask for permission to access your camera. Click "Allow" to proceed. This is required for the tool to capture barcode images.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Step 3: Position the barcode</strong><br>When your camera activates, point it at the barcode you want to scan. For best results:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• Hold your device steady and parallel to the barcode<br>• Ensure good lighting—avoid shadows or glare<br>• Get close enough that the barcode fills most of the frame<br>• Make sure the barcode is in focus',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Step 4: Capture the photo</strong><br>On mobile devices, tap the camera shutter button to capture. On desktop, click to take the photo. The tool will immediately analyze the image for barcodes.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/how-to-use-the-barcode-scanner-tool/barcode-scanner-03.jpg',
      alt: 'Scan result screen with detected barcode and approval options',
      caption: 'Barcode detected! Review the scanned code and choose to approve and save or retry',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Step 5: Review and approve</strong><br>Once a barcode is detected, you\'ll see a result screen showing the scanned code and its format (e.g., "UPC-A" or "EAN-13"). This approval workflow prevents accidental misreads. You have two options:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• Click <strong>"Approve & Save"</strong> to add the barcode to your collection<br>• Click <strong>"Retry"</strong> if the code is incorrect or you want to scan again',
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
      text: 'Manual Entry Option',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Sometimes a barcode won\'t scan properly—maybe the print quality is poor, the lighting is bad, or the barcode is damaged. For these situations, the tool includes a manual entry option.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Simply scroll down to the "Manual Entry" section, type the barcode numbers directly into the input field, and click "Add". The tool will save it just like a scanned code, but with the format labeled as "manual".',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/how-to-use-the-barcode-scanner-tool/barcode-scanner-04.jpg',
      alt: 'Manual entry interface for typing barcode numbers',
      caption: 'Manual Entry option for when scanning doesn\'t work - just type the barcode and click Add',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Managing Your Scanned Barcodes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'All scanned barcodes are stored locally in your browser with timestamps and format information. The "Scanned Barcodes" section displays a table with all your saved codes.',
    },
  },
  {
    type: 'image',
    data: {
      src: '/assets/blog/how-to-use-the-barcode-scanner-tool/barcode-scanner-05.jpg',
      alt: 'Scanned barcodes table with codes, formats, and timestamps',
      caption: 'All your scanned barcodes in one organized table with copy, download, and delete options',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Individual actions:</strong>',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• <strong>Copy:</strong> Click the copy icon next to any code to copy it to your clipboard<br>• <strong>Delete:</strong> Click the trash icon to remove a specific code from your collection',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Bulk actions:</strong>',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• <strong>Copy All:</strong> Copies all scanned codes to your clipboard as a formatted list<br>• <strong>Download:</strong> Downloads all codes as a text file named with the current date (e.g., <code>barcodes-2026-01-17.txt</code>)<br>• <strong>Clear All:</strong> Deletes all scanned codes after confirmation',
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
    type: 'heading',
    data: {
      level: 2,
      text: 'Tips for Best Results',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Lighting is everything.</strong> Good lighting makes the difference between a successful scan and a failed one. Natural daylight or bright indoor lighting works best. Avoid scanning in dim conditions or with harsh shadows across the barcode.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Hold steady.</strong> Blurry photos lead to failed scans. Brace your arms or rest your device on a stable surface to minimize camera shake. On mobile, use two hands for extra stability.',
    },
  },
  {
    type: 'component',
    data: {
      componentName: 'related-blog-posts',
      posts: [
        {
          title: 'How to Scan Reward Codes: Stop Typing Tiny Codes by Hand',
          slug: 'stop-typing-in-those-tiny-on-reward-codes-by-hand'
        }
      ]
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Fill the frame.</strong> The barcode should take up most of your camera view. Get close enough that the barcode is large and clear, but not so close that it\'s cut off or out of focus.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Avoid glare.</strong> Shiny packaging or laminated barcodes can reflect light directly into your camera, creating bright spots that obscure the barcode. Tilt the product slightly if you see glare.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Clean your camera lens.</strong> Fingerprints and smudges on your camera lens will blur the image. A quick wipe with a soft cloth can dramatically improve scan success rates.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Try different angles.</strong> If a barcode won\'t scan, try rotating your device or the product slightly. Sometimes a different angle helps the scanner recognize the code pattern.',
    },
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
      text: '<strong>Inventory Management</strong><br>Small business owners and warehouse managers use the barcode scanner to quickly catalog inventory without buying expensive handheld scanners. Scan products as they arrive, export the list, and import it into your inventory management system.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Price Comparison Shopping</strong><br>Scan products in one store, then use the barcode numbers to search for better prices online or at competing retailers. Build a shopping list of codes to reference later.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Product Research</strong><br>Researchers and market analysts scan barcodes to build databases of product codes for analysis. The export feature makes it easy to move scanned data into spreadsheets or databases.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Personal Collections</strong><br>Track your book collection, video games, or any other products with barcodes. The timestamp feature helps you remember when you added each item.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Quality Control</strong><br>Manufacturing and QA teams use the scanner to verify product codes during inspections. The duplicate detection prevents accidentally scanning the same item twice.',
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
      text: 'Supported Barcode Formats',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'The scanner automatically detects and reads these barcode formats:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• <strong>UPC-A:</strong> Standard 12-digit retail barcodes used in North America<br>• <strong>UPC-E:</strong> Compressed 6-digit version of UPC-A<br>• <strong>EAN-13:</strong> International retail product codes (13 digits)<br>• <strong>EAN-8:</strong> Shorter version of EAN-13 for small packages<br>• <strong>Code 128:</strong> High-density barcode used in logistics and shipping<br>• <strong>Code 39:</strong> Alphanumeric barcode common in automotive and defense<br>• <strong>ITF (Interleaved 2 of 5):</strong> Used for packaging and distribution<br>• <strong>QR Code:</strong> 2D barcodes that can store URLs, text, and other data',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'You don\'t need to select the format manually—the tool automatically identifies what type of barcode it\'s scanning and displays the format name with each saved code.',
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
    type: 'heading',
    data: {
      level: 2,
      text: 'Privacy and Data Storage',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'All barcode scanning and storage happens entirely in your browser. When you scan a barcode, the image is processed locally on your device using JavaScript—nothing is uploaded to any server.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Scanned codes are saved to your browser\'s localStorage, which means:',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '• Your data persists even if you close the browser or restart your device<br>• Codes are only accessible from the same browser on the same device<br>• Clearing your browser data will delete stored barcodes<br>• No external services or APIs have access to your scanned codes',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'This privacy-first approach makes the tool ideal for scanning confidential inventory, prototype products, or business-sensitive barcodes.',
    },
  },
  {
    type: 'heading',
    data: {
      level: 2,
      text: 'Troubleshooting Common Issues',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>"No barcode found in photo"</strong><br>This means the scanner couldn\'t detect a valid barcode in the image. Check your lighting, make sure the barcode isn\'t blurry, and try getting closer or further from the barcode. If the barcode is damaged or very low quality, use the manual entry option instead.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>"Failed to initialize scanner"</strong><br>This usually means there\'s a problem with camera access. Make sure you\'ve granted camera permissions in your browser settings. On some browsers, camera access only works over HTTPS or on localhost.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>"Barcode already exists"</strong><br>You\'ve already scanned this code. The tool prevents duplicate entries automatically. If you want to re-add a code, delete it from your collection first.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: '<strong>Wrong code detected</strong><br>Sometimes poor image quality or printing defects cause misreads. That\'s why the tool includes an approval step—always verify the scanned code matches the printed barcode before clicking "Approve & Save". If it\'s wrong, click "Retry" and scan again.',
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
      text: 'The barcode scanner tool transforms your phone or computer into a powerful barcode reader without requiring expensive hardware or software installation. Whether you\'re managing inventory, comparing prices, or cataloging a personal collection, the tool\'s approval workflow, duplicate prevention, and local storage make it both reliable and privacy-focused.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Start scanning barcodes instantly at <a href="/tools/barcode-reader">allthethings.dev/tools/barcode-reader</a>.',
    },
  },
];
