import { Injectable } from '@angular/core';
import { Tool, ToolCategory, ToolCategoryMeta } from '../models/tool.interface';

/**
 * Tools Service
 * Central service for managing and accessing tool metadata
 */
@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  /**
   * Master list of all tools in the application
   * This is the single source of truth for tool metadata
   */
  private tools: Tool[] = [
    // ========================================
    // TEXT TOOLS
    // ========================================
    {
      id: 'word-counter',
      name: 'Word Counter',
      description: 'Count words, characters, sentences, and paragraphs in real-time',
      longDescription: 'Advanced text analysis tool that counts words, characters (with/without spaces), sentences, paragraphs, and estimates reading time. Perfect for writers, students, and content creators.',
      category: 'text',
      icon: 'text_fields',
      route: 'word-counter',
      featured: true,
      tags: ['text', 'writing', 'analysis', 'counter'],
      available: true
    },
    {
      id: 'case-converter',
      name: 'Case Converter',
      description: 'Convert text between different cases (uppercase, lowercase, title case, etc.)',
      category: 'text',
      icon: 'format_size',
      route: 'case-converter',
      featured: true,
      tags: ['text', 'formatting', 'case'],
      available: true
    },
    {
      id: 'ascii-character-reference',
      name: 'ASCII Character Reference',
      description: 'Complete ASCII table with searchable characters, codes (decimal, hex, binary), and copy functionality',
      category: 'text',
      icon: 'table_chart',
      route: 'ascii-character-reference',
      featured: true,
      tags: ['ascii', 'character', 'encoding', 'reference', 'table', 'codes'],
      available: true
    },
    {
      id: 'lorem-ipsum',
      name: 'Lorem Ipsum Generator',
      description: 'Generate customizable placeholder text with adjustable word count (1-1000 words)',
      category: 'generator',
      icon: 'notes',
      route: 'lorem-ipsum',
      featured: false,
      tags: ['text', 'generator', 'placeholder'],
      available: true
    },

    // ========================================
    // MATH TOOLS
    // ========================================
    {
      id: 'percentage-calculator',
      name: 'Percentage Calculator',
      description: 'Calculate percentages, increases, and decreases',
      category: 'math',
      icon: 'percent',
      route: 'percentage-calculator',
      featured: true,
      tags: ['math', 'calculator', 'percentage'],
      available: true
    },
    {
      id: 'tip-calculator',
      name: 'Tip Calculator',
      description: 'Calculate tips and split bills easily',
      category: 'math',
      icon: 'payments',
      route: 'tip-calculator',
      featured: false,
      tags: ['math', 'calculator', 'money'],
      available: true
    },
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator',
      description: 'Calculate Body Mass Index and health metrics',
      category: 'math',
      icon: 'monitor_weight',
      route: 'bmi-calculator',
      featured: false,
      tags: ['math', 'health', 'calculator'],
      available: true
    },
    {
      id: 'roman-numeral-converter',
      name: 'Roman Numeral Converter',
      description: 'Convert regular numbers to Roman numerals instantly',
      longDescription: 'Free online Roman numeral converter. Convert regular numbers (1-3999) to Roman numerals instantly. Save conversions, download as text, and manage your conversion history locally.',
      category: 'math',
      icon: 'history_edu',
      route: 'roman-numeral-converter',
      featured: false,
      tags: ['math', 'converter', 'roman', 'numerals', 'education'],
      available: true
    },
    {
      id: 'base-number-converter',
      name: 'Base Number Converter',
      description: 'Convert numbers between binary, octal, decimal, duodecimal, hexadecimal, and base 36',
      longDescription: 'Convert numbers between different number systems instantly. Supports binary (base 2), octal (base 8), decimal (base 10), duodecimal (base 12), hexadecimal (base 16), and base 36. Uses BigInt internally to handle arbitrarily large integers. Features live conversion, validation with clear error messages, and a reference panel showing all bases simultaneously.',
      category: 'math',
      icon: 'calculate',
      route: 'base-number-converter',
      featured: true,
      tags: ['math', 'converter', 'base', 'binary', 'hex', 'decimal', 'number'],
      available: true,
      hasTutorial: true
    },

    // ========================================
    // CONVERTER TOOLS
    // ========================================
    {
      id: 'unit-converter',
      name: 'Unit Converter',
      description: 'Convert between different units of measurement',
      category: 'converter',
      icon: 'straighten',
      route: 'unit-converter',
      featured: true,
      tags: ['converter', 'units', 'measurement'],
      available: true
    },
    {
      id: 'currency-converter',
      name: 'Currency Converter',
      description: 'Convert between world currencies with live rates',
      category: 'converter',
      icon: 'currency_exchange',
      route: 'currency-converter',
      featured: false,
      tags: ['converter', 'currency', 'money'],
      available: true
    },

    // ========================================
    // COLOR TOOLS
    // ========================================
    {
      id: 'color-picker',
      name: 'Color Picker',
      description: 'Pick colors and get HEX, RGB, HSL values',
      category: 'color',
      icon: 'palette',
      route: 'color-picker',
      featured: true,
      tags: ['color', 'design', 'picker'],
      available: true
    },
    {
      id: 'gradient-generator',
      name: 'Gradient Generator',
      description: 'Create beautiful CSS gradients',
      category: 'color',
      icon: 'gradient',
      route: 'gradient-generator',
      featured: false,
      tags: ['color', 'css', 'generator'],
      available: true,
      hasTutorial: true
    },

    // ========================================
    // GENERATOR TOOLS
    // ========================================
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate strong, secure passwords',
      category: 'generator',
      icon: 'password',
      route: 'password-generator',
      featured: true,
      tags: ['generator', 'security', 'password'],
      available: true
    },
    {
      id: 'qr-code-generator',
      name: 'QR Code Generator',
      description: 'Create QR codes from text or URLs',
      category: 'generator',
      icon: 'qr_code',
      route: 'qr-code-generator',
      featured: false,
      tags: ['generator', 'qr', 'code'],
      available: true
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate universally unique identifiers',
      category: 'generator',
      icon: 'fingerprint',
      route: 'uuid-generator',
      featured: false,
      tags: ['generator', 'uuid', 'development'],
      available: true
    },

    // ========================================
    // TIME TOOLS
    // ========================================
    {
      id: 'timestamp-converter',
      name: 'Timestamp Converter',
      description: 'Convert between Unix timestamps and human-readable dates',
      category: 'time',
      icon: 'schedule',
      route: 'timestamp-converter',
      featured: false,
      tags: ['time', 'converter', 'timestamp'],
      available: true
    },
    {
      id: 'time-zone-converter',
      name: 'Time Zone Converter',
      description: 'Convert times between different time zones',
      category: 'time',
      icon: 'public',
      route: 'time-zone-converter',
      featured: false,
      tags: ['time', 'converter', 'timezone'],
      available: true
    },
    {
      id: 'timer-stopwatch-clock',
      name: 'Timer & Stopwatch',
      description: 'Online countdown timer and stopwatch with lap tracking and custom presets',
      longDescription: 'Full-featured online timer and stopwatch. Countdown timer with custom presets, save unlimited timer configurations. Stopwatch with lap recording, edit/delete laps, and local storage persistence. Audio and visual notifications when timer completes.',
      category: 'time',
      icon: 'timer',
      route: 'timer-stopwatch-clock',
      featured: true,
      tags: ['timer', 'stopwatch', 'countdown', 'clock', 'lap', 'time', 'alarm'],
      available: true
    },
    {
      id: 'online-timer',
      name: 'Online Timer',
      description: 'Free countdown timer with custom presets and audio notifications',
      category: 'time',
      icon: 'hourglass_empty',
      route: 'timer-stopwatch-clock/timer',
      featured: false,
      tags: ['timer', 'countdown', 'alarm', 'preset', 'time'],
      available: true
    },
    {
      id: 'online-stopwatch',
      name: 'Online Stopwatch',
      description: 'Free stopwatch with lap tracking and local storage',
      category: 'time',
      icon: 'av_timer',
      route: 'timer-stopwatch-clock/stopwatch',
      featured: false,
      tags: ['stopwatch', 'lap', 'timer', 'tracking', 'time'],
      available: true
    },

    // ========================================
    // IMAGE TOOLS
    // ========================================
    {
      id: 'icon-generator',
      name: 'Icon Generator',
      description: 'Create custom icons and graphics',
      category: 'image',
      icon: 'add_photo_alternate',
      route: 'icon-generator',
      featured: false,
      tags: ['image', 'icon', 'generator', 'graphics'],
      available: true
    },
    {
      id: 'photo-filter-studio',
      name: 'Photo Filter Studio',
      description: 'Apply professional photo filters and adjustments with real-time preview',
      longDescription: 'Advanced photo editing tool with 8 professionally designed preset filters (Clean, Vivid, Warm Glow, Cool Fade, Matte, Classic, Punch, and Noir) and 8 adjustment sliders (brightness, contrast, saturation, warmth, tint, vignette, and sharpness). Apply filters in real-time with instant canvas preview. Download edited photos as PNG or JPEG with quality control. All processing happens locally in your browser—no files are uploaded or stored anywhere.',
      category: 'image',
      icon: 'image_edit',
      route: 'photo-filter-studio',
      featured: true,
      tags: ['image', 'photo', 'editor', 'filters', 'adjustments', 'editing'],
      available: true,
      hasTutorial: true
    },

    // ========================================
    // HARDWARE TOOLS
    // ========================================
    {
      id: 'roku-compatibility',
      name: 'Roku Compatibility',
      description: 'Check compatibility and features for Roku devices',
      longDescription: 'Comprehensive compatibility checker for Roku devices. View 4K support, HDR capabilities, voice remote features, smart home integration, and more for any Roku model.',
      category: 'hardware',
      icon: 'devices',
      route: 'roku-compatibility',
      featured: false,
      tags: ['hardware', 'roku', 'streaming', 'compatibility'],
      available: true
    },

    // ========================================
    // OCR TOOLS
    // ========================================
    {
      id: 'barcode-reader',
      name: 'Barcode Reader',
      description: 'Scan and store retail product barcodes using your device camera',
      longDescription: 'Powerful barcode scanner tool that scans UPC, EAN, Code 128, Code 39, and other retail product barcodes. Features camera scanning, approval workflow, local storage, and bulk export options.',
      category: 'ocr',
      icon: 'qr_code_scanner',
      route: 'barcode-reader',
      featured: true,
      tags: ['barcode', 'scanner', 'ocr', 'camera', 'inventory'],
      available: true,
      hasTutorial: true
    },
    {
      id: 'on-reward-scanner',
      name: 'On! Reward Code Scanner',
      description: 'Scan and store On! Nicotine reward codes from product packaging',
      longDescription: 'OCR-based reward code scanner for On! Nicotine products. Scan packaging with your camera to extract XXXXX-XXXX-XXXX format codes. Features approval workflow, local storage, and bulk export options.',
      category: 'ocr',
      icon: 'document_scanner',
      route: 'on-reward-scanner',
      featured: true,
      tags: ['ocr', 'scanner', 'camera', 'nicotine', 'rewards'],
      available: true,
      hasTutorial: true
    },

    // ========================================
    // MUSIC & AUDIO TOOLS
    // ========================================
    {
      id: 'spotify-playlist-export',
      name: 'Spotify Playlist Exporter',
      description: 'Export your Spotify playlists to CSV or TXT format',
      longDescription: 'Export your Spotify playlist metadata to CSV or TXT files. Connect with your Spotify account, select a playlist, and download track information including song names, artists, albums, and Spotify URLs. Perfect for backup, sharing, or migration.',
      category: 'music',
      icon: 'library_music',
      route: 'spotify-playlist-export',
      featured: true,
      tags: ['music', 'spotify', 'playlist', 'export', 'backup'],
      available: false
    },
    {
      id: 'morse-code-converter',
      name: 'Morse Code Converter',
      description: 'Convert text to Morse code with real-time translation and audio playback',
      longDescription: 'Convert text to Morse code instantly with real-time translation, audio playback, and visual representation. Supports A-Z letters, 0-9 digits, and common punctuation. Features adjustable WPM speed, frequency, and volume controls. Save conversions and export to text files.',
      category: 'music',
      icon: 'graphic_eq',
      route: 'morse-code-converter',
      featured: true,
      tags: ['morse', 'audio', 'converter', 'code', 'communication', 'radio'],
      available: true
    },

    // ========================================
    // SOCIAL MEDIA TOOLS
    // ========================================
    {
      id: 'social-media-launchpad',
      name: 'Social Media Launchpad',
      description: 'Launch and manage social media posts',
      longDescription: 'A comprehensive dashboard for launching and managing social media content across multiple platforms.',
      category: 'social',
      icon: 'rocket_launch',
      route: 'social-media-launchpad',
      featured: true,
      tags: ['social', 'media', 'launchpad', 'marketing'],
      available: true,
      hasTutorial: true
    },
  ];

  /**
   * Category metadata for UI display
   */
  private categoryMeta: ToolCategoryMeta[] = [
    {
      id: 'math',
      name: 'Math & Calculators',
      description: 'Mathematical calculations and computing tools',
      icon: 'calculate',
      color: 'var(--neon-cyan)'
    },
    {
      id: 'converter',
      name: 'Converters',
      description: 'Convert length, weight, temperature, volume, area and speed.',
      icon: 'swap_horiz',
      color: 'var(--neon-pink)'
    },
    {
      id: 'text',
      name: 'Text Tools',
      description: 'Text manipulation and analysis utilities',
      icon: 'text_fields',
      color: 'var(--amber)'
    },
    {
      id: 'generator',
      name: 'Generators',
      description: 'Generate various types of content and data',
      icon: 'auto_awesome',
      color: 'var(--neon-cyan-bright)'
    },
    {
      id: 'color',
      name: 'Color Tools',
      description: 'Color picking, conversion, and generation',
      icon: 'palette',
      color: 'var(--neon-pink-bright)'
    },
    {
      id: 'time',
      name: 'Time & Date',
      description: 'Time zone and timestamp utilities',
      icon: 'access_time',
      color: 'var(--amber-bright)'
    },
    {
      id: 'image',
      name: 'Image Tools',
      description: 'Image manipulation and generation utilities',
      icon: 'image',
      color: 'var(--neon-cyan)'
    },
    {
      id: 'hardware',
      name: 'Hardware Tools',
      description: 'Hardware compatibility and device utilities',
      icon: 'devices',
      color: 'var(--neon-pink)'
    },
    {
      id: 'ocr',
      name: 'OCR Tools',
      description: 'Optical character recognition and barcode scanning',
      icon: 'qr_code_scanner',
      color: 'var(--neon-cyan-bright)'
    },
    {
      id: 'music',
      name: 'Music & Audio',
      description: 'Music and audio utilities',
      icon: 'library_music',
      color: 'var(--neon-pink)'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Social media tools and utilities',
      icon: 'share',
      color: 'var(--neon-blue)'
    },
    {
      id: 'other',
      name: 'Other Tools',
      description: 'Miscellaneous useful utilities',
      icon: 'more_horiz',
      color: 'var(--text-secondary)'
    }
  ];

  /**
   * High-intent unit conversion pairs for programmatic SEO
   */
  private conversionPairs: Array<{
    from: string;
    to: string;
    fromSlug: string;
    toSlug: string;
    category: string;
    description: string;
    featured?: boolean;
  }> = [
    // Length (Heavy Hitters)
    { from: 'Centimeter', to: 'Inches', fromSlug: 'centimeter', toSlug: 'inch', category: 'length', description: 'Convert centimeters to inches accurately for height, crafts, or screen sizes.', featured: true },
    { from: 'Inches', to: 'cm', fromSlug: 'inch', toSlug: 'centimeter', category: 'length', description: 'Fast inch to centimeter conversion. Perfect for international shipping and sizing.', featured: true },
    { from: 'Miles', to: 'km', fromSlug: 'mile', toSlug: 'kilometer', category: 'length', description: 'Convert miles to kilometers for travel, racing, or road trip planning.', featured: true },
    { from: 'km', to: 'Miles', fromSlug: 'kilometer', toSlug: 'mile', category: 'length', description: 'Switch kilometers to miles instantly. Ideal for marathons and driving abroad.', featured: true },
    { from: 'Feet', to: 'Meters', fromSlug: 'foot', toSlug: 'meter', category: 'length', description: 'Accurate feet to meters conversion for architecture, height, and construction.', featured: true },
    { from: 'Meters', to: 'Feet', fromSlug: 'meter', toSlug: 'foot', category: 'length', description: 'Convert meters to feet and inches for global height and distance standards.', featured: true },

    // Weight & Mass
    { from: 'kg', to: 'lbs', fromSlug: 'kilogram', toSlug: 'pound', category: 'weight', description: 'Kilograms to pounds conversion for fitness goals, gym weights, and luggage.', featured: true },
    { from: 'lbs', to: 'kg', fromSlug: 'pound', toSlug: 'kilogram', category: 'weight', description: 'Convert pounds to kilograms for medical forms, shipping, and travel.', featured: true },
    { from: 'Kilograms', to: 'Grams', fromSlug: 'kilogram', toSlug: 'gram', category: 'weight', description: 'Convert kilograms to grams for recipes, lab work, and packaging.' },
    { from: 'Grams', to: 'Ounces', fromSlug: 'gram', toSlug: 'ounce', category: 'weight', description: 'High-precision grams to ounces conversion for cooking, jewelry, and postage.' },
    { from: 'Ounces', to: 'Grams', fromSlug: 'ounce', toSlug: 'gram', category: 'weight', description: 'Convert oz to grams for recipes and laboratory measurements.' },

    // Temperature
    { from: 'Celsius', to: 'Fahrenheit', fromSlug: 'celsius', toSlug: 'fahrenheit', category: 'temperature', description: 'Convert °C to °F for weather, baking, and travel. Quick and accurate.', featured: true },
    { from: 'Fahrenheit', to: 'Celsius', fromSlug: 'fahrenheit', toSlug: 'celsius', category: 'temperature', description: 'Convert °F to °C for science, cooking temperatures, and climate tracking.', featured: true },

    // Volume
    { from: 'Liters', to: 'Gallons', fromSlug: 'liter', toSlug: 'gallon', category: 'volume', description: 'Convert liters to US gallons for fuel, water tanks, and large-scale liquids.' },
    { from: 'ml', to: 'oz', fromSlug: 'milliliter', toSlug: 'fluidOunce', category: 'volume', description: 'Milliliters to fluid ounces conversion for drinks, medicine, and beauty products.' },
    { from: 'Cups', to: 'ml', fromSlug: 'cup', toSlug: 'milliliter', category: 'volume', description: 'Convert cooking cups to milliliters for international baking and recipes.' },

    // Area
    { from: 'Square Meters', to: 'Square Feet', fromSlug: 'squareMeter', toSlug: 'squareFoot', category: 'area', description: 'Convert m² to ft² for real estate listings and apartment sizing.' },

    // Speed
    { from: 'km/h', to: 'mph', fromSlug: 'kilometerPerHour', toSlug: 'milePerHour', category: 'speed', description: 'Convert kilometers per hour to miles per hour for car speeds and racing.' },
    { from: 'Knots', to: 'mph', fromSlug: 'knot', toSlug: 'milePerHour', category: 'speed', description: 'Convert maritime/aviation knots to miles per hour for sailing and flight.' },
  ];

  /**
   * Base number conversion pairs for programmatic SEO
   */
  private baseNumberPairs: Array<{
    from: string;
    to: string;
    fromBase: number;
    toBase: number;
    fromSlug: string;
    toSlug: string;
    description: string;
    featured?: boolean;
  }> = [
    // Binary conversions (most popular)
    { from: 'Binary', to: 'Decimal', fromBase: 2, toBase: 10, fromSlug: 'binary', toSlug: 'decimal', description: 'Convert binary (base-2) numbers to decimal (base-10). Essential for programmers and computer science students.', featured: true },
    { from: 'Decimal', to: 'Binary', fromBase: 10, toBase: 2, fromSlug: 'decimal', toSlug: 'binary', description: 'Convert decimal numbers to binary. Perfect for learning computer science and digital electronics.', featured: true },
    { from: 'Binary', to: 'Hexadecimal', fromBase: 2, toBase: 16, fromSlug: 'binary', toSlug: 'hexadecimal', description: 'Convert binary to hex (base-16) for compact representation. Used in programming and color codes.', featured: true },
    { from: 'Hexadecimal', to: 'Binary', fromBase: 16, toBase: 2, fromSlug: 'hexadecimal', toSlug: 'binary', description: 'Convert hexadecimal to binary. Essential for low-level programming and debugging.', featured: true },
    { from: 'Binary', to: 'Octal', fromBase: 2, toBase: 8, fromSlug: 'binary', toSlug: 'octal', description: 'Convert binary to octal (base-8). Useful for Unix permissions and legacy systems.', featured: true },
    { from: 'Octal', to: 'Binary', fromBase: 8, toBase: 2, fromSlug: 'octal', toSlug: 'binary', description: 'Convert octal to binary. Common in file permissions and system programming.', featured: true },

    // Hexadecimal conversions (very popular)
    { from: 'Decimal', to: 'Hexadecimal', fromBase: 10, toBase: 16, fromSlug: 'decimal', toSlug: 'hexadecimal', description: 'Convert decimal to hex. Essential for color codes, memory addresses, and programming.', featured: true },
    { from: 'Hexadecimal', to: 'Decimal', fromBase: 16, toBase: 10, fromSlug: 'hexadecimal', toSlug: 'decimal', description: 'Convert hex to decimal. Used in web development, debugging, and data analysis.', featured: true },
    { from: 'Octal', to: 'Hexadecimal', fromBase: 8, toBase: 16, fromSlug: 'octal', toSlug: 'hexadecimal', description: 'Convert octal to hexadecimal for more compact number representation.', featured: true },
    { from: 'Hexadecimal', to: 'Octal', fromBase: 16, toBase: 8, fromSlug: 'hexadecimal', toSlug: 'octal', description: 'Convert hex to octal. Useful for Unix file permissions and system programming.', featured: true },

    // Octal conversions
    { from: 'Decimal', to: 'Octal', fromBase: 10, toBase: 8, fromSlug: 'decimal', toSlug: 'octal', description: 'Convert decimal to octal (base-8). Used in Unix/Linux file permissions.', featured: true },
    { from: 'Octal', to: 'Decimal', fromBase: 8, toBase: 10, fromSlug: 'octal', toSlug: 'decimal', description: 'Convert octal to decimal. Decode Unix permissions and legacy system values.', featured: true },

    // Duodecimal conversions (less common but useful)
    { from: 'Decimal', to: 'Duodecimal', fromBase: 10, toBase: 12, fromSlug: 'decimal', toSlug: 'duodecimal', description: 'Convert decimal to duodecimal (base-12). Used in measurements and alternative math systems.' },
    { from: 'Duodecimal', to: 'Decimal', fromBase: 12, toBase: 10, fromSlug: 'duodecimal', toSlug: 'decimal', description: 'Convert duodecimal (base-12) to decimal. Decode dozenal number representations.' },
    { from: 'Binary', to: 'Duodecimal', fromBase: 2, toBase: 12, fromSlug: 'binary', toSlug: 'duodecimal', description: 'Convert binary to duodecimal (base-12) for alternative number system exploration.' },
    { from: 'Duodecimal', to: 'Binary', fromBase: 12, toBase: 2, fromSlug: 'duodecimal', toSlug: 'binary', description: 'Convert duodecimal to binary representation.' },
    { from: 'Octal', to: 'Duodecimal', fromBase: 8, toBase: 12, fromSlug: 'octal', toSlug: 'duodecimal', description: 'Convert octal to duodecimal (base-12) numbers.' },
    { from: 'Duodecimal', to: 'Octal', fromBase: 12, toBase: 8, fromSlug: 'duodecimal', toSlug: 'octal', description: 'Convert duodecimal to octal representation.' },
    { from: 'Hexadecimal', to: 'Duodecimal', fromBase: 16, toBase: 12, fromSlug: 'hexadecimal', toSlug: 'duodecimal', description: 'Convert hexadecimal to duodecimal (base-12).' },
    { from: 'Duodecimal', to: 'Hexadecimal', fromBase: 12, toBase: 16, fromSlug: 'duodecimal', toSlug: 'hexadecimal', description: 'Convert duodecimal to hexadecimal representation.' },

    // Base-36 conversions (alphanumeric encoding)
    { from: 'Decimal', to: 'Base-36', fromBase: 10, toBase: 36, fromSlug: 'decimal', toSlug: 'base36', description: 'Convert decimal to base-36 (alphanumeric). Used in URL shortening and compact IDs.' },
    { from: 'Base-36', to: 'Decimal', fromBase: 36, toBase: 10, fromSlug: 'base36', toSlug: 'decimal', description: 'Convert base-36 to decimal. Decode short URLs and alphanumeric identifiers.' },
    { from: 'Binary', to: 'Base-36', fromBase: 2, toBase: 36, fromSlug: 'binary', toSlug: 'base36', description: 'Convert binary to base-36 for compact alphanumeric encoding.' },
    { from: 'Base-36', to: 'Binary', fromBase: 36, toBase: 2, fromSlug: 'base36', toSlug: 'binary', description: 'Convert base-36 to binary representation.' },
    { from: 'Octal', to: 'Base-36', fromBase: 8, toBase: 36, fromSlug: 'octal', toSlug: 'base36', description: 'Convert octal to base-36 alphanumeric encoding.' },
    { from: 'Base-36', to: 'Octal', fromBase: 36, toBase: 8, fromSlug: 'base36', toSlug: 'octal', description: 'Convert base-36 to octal representation.' },
    { from: 'Hexadecimal', to: 'Base-36', fromBase: 16, toBase: 36, fromSlug: 'hexadecimal', toSlug: 'base36', description: 'Convert hex to base-36. Useful for compact alphanumeric encoding.' },
    { from: 'Base-36', to: 'Hexadecimal', fromBase: 36, toBase: 16, fromSlug: 'base36', toSlug: 'hexadecimal', description: 'Convert base-36 to hexadecimal representation.' },
    { from: 'Duodecimal', to: 'Base-36', fromBase: 12, toBase: 36, fromSlug: 'duodecimal', toSlug: 'base36', description: 'Convert duodecimal to base-36 encoding.' },
    { from: 'Base-36', to: 'Duodecimal', fromBase: 36, toBase: 12, fromSlug: 'base36', toSlug: 'duodecimal', description: 'Convert base-36 to duodecimal representation.' },
  ];

  /**
   * Percentage calculator variants for programmatic SEO
   */
  private percentageCalculatorVariants: Array<{
    slug: string;
    name: string;
    description: string;
    featured?: boolean;
  }> = [
    {
      slug: 'percentage-increase-decrease',
      name: 'Percentage Increase/Decrease Calculator',
      description: 'Calculate percentage increase or decrease between two values. Perfect for measuring growth rates, price changes, and comparing values over time.',
      featured: true
    },
    {
      slug: 'discount-calculator',
      name: 'Discount Calculator',
      description: 'Calculate final price after discount. Find out how much you save with percentage discounts on any purchase.',
      featured: true
    },
    {
      slug: 'tax-calculator',
      name: 'Sales Tax Calculator',
      description: 'Calculate sales tax amount and total price. Add tax percentage to any purchase to find the final cost.',
      featured: true
    },
    {
      slug: 'profit-margin',
      name: 'Profit Margin Calculator',
      description: 'Calculate profit margin percentage from cost and revenue. Essential for business pricing and profitability analysis.',
      featured: true
    },
    {
      slug: 'markup-calculator',
      name: 'Markup Calculator',
      description: 'Calculate selling price from cost and markup percentage. Determine the right pricing for products and services.',
      featured: true
    }
  ];

  /**
   * Currency converter pairs for programmatic SEO (major currencies only)
   */
  private currencyConverterPairs: Array<{
    from: string;
    to: string;
    fromCode: string;
    toCode: string;
    fromSlug: string;
    toSlug: string;
    description: string;
    featured?: boolean;
  }> = [
    // USD conversions (most popular)
    { from: 'US Dollar', to: 'Euro', fromCode: 'USD', toCode: 'EUR', fromSlug: 'us-dollar', toSlug: 'euro', description: 'Convert US Dollars to Euros. Check USD to EUR exchange rates for travel, shopping, and international transfers.', featured: true },
    { from: 'US Dollar', to: 'British Pound', fromCode: 'USD', toCode: 'GBP', fromSlug: 'us-dollar', toSlug: 'british-pound', description: 'Convert US Dollars to British Pounds. Get current USD to GBP rates for UK travel and purchases.', featured: true },
    { from: 'US Dollar', to: 'Japanese Yen', fromCode: 'USD', toCode: 'JPY', fromSlug: 'us-dollar', toSlug: 'japanese-yen', description: 'Convert US Dollars to Japanese Yen. Check USD to JPY exchange rates for Japan travel and business.', featured: true },
    { from: 'US Dollar', to: 'Canadian Dollar', fromCode: 'USD', toCode: 'CAD', fromSlug: 'us-dollar', toSlug: 'canadian-dollar', description: 'Convert US Dollars to Canadian Dollars. Get current USD to CAD rates for cross-border shopping.' },
    { from: 'US Dollar', to: 'Australian Dollar', fromCode: 'USD', toCode: 'AUD', fromSlug: 'us-dollar', toSlug: 'australian-dollar', description: 'Convert US Dollars to Australian Dollars. Check USD to AUD exchange rates for travel Down Under.' },
    { from: 'US Dollar', to: 'Swiss Franc', fromCode: 'USD', toCode: 'CHF', fromSlug: 'us-dollar', toSlug: 'swiss-franc', description: 'Convert US Dollars to Swiss Francs. Get USD to CHF rates for Swiss travel and investments.' },

    // EUR conversions
    { from: 'Euro', to: 'US Dollar', fromCode: 'EUR', toCode: 'USD', fromSlug: 'euro', toSlug: 'us-dollar', description: 'Convert Euros to US Dollars. Check EUR to USD exchange rates for American travel and shopping.', featured: true },
    { from: 'Euro', to: 'British Pound', fromCode: 'EUR', toCode: 'GBP', fromSlug: 'euro', toSlug: 'british-pound', description: 'Convert Euros to British Pounds. Get current EUR to GBP rates for UK travel and purchases.', featured: true },
    { from: 'Euro', to: 'Japanese Yen', fromCode: 'EUR', toCode: 'JPY', fromSlug: 'euro', toSlug: 'japanese-yen', description: 'Convert Euros to Japanese Yen. Check EUR to JPY exchange rates for Japan travel and business.' },
    { from: 'Euro', to: 'Canadian Dollar', fromCode: 'EUR', toCode: 'CAD', fromSlug: 'euro', toSlug: 'canadian-dollar', description: 'Convert Euros to Canadian Dollars. Get EUR to CAD rates for Canada travel and transfers.' },
    { from: 'Euro', to: 'Australian Dollar', fromCode: 'EUR', toCode: 'AUD', fromSlug: 'euro', toSlug: 'australian-dollar', description: 'Convert Euros to Australian Dollars. Check EUR to AUD exchange rates for Australian travel.' },
    { from: 'Euro', to: 'Swiss Franc', fromCode: 'EUR', toCode: 'CHF', fromSlug: 'euro', toSlug: 'swiss-franc', description: 'Convert Euros to Swiss Francs. Get EUR to CHF rates for Switzerland travel and banking.' },

    // GBP conversions
    { from: 'British Pound', to: 'US Dollar', fromCode: 'GBP', toCode: 'USD', fromSlug: 'british-pound', toSlug: 'us-dollar', description: 'Convert British Pounds to US Dollars. Check GBP to USD exchange rates for American travel.', featured: true },
    { from: 'British Pound', to: 'Euro', fromCode: 'GBP', toCode: 'EUR', fromSlug: 'british-pound', toSlug: 'euro', description: 'Convert British Pounds to Euros. Get current GBP to EUR rates for European travel and shopping.', featured: true },
    { from: 'British Pound', to: 'Japanese Yen', fromCode: 'GBP', toCode: 'JPY', fromSlug: 'british-pound', toSlug: 'japanese-yen', description: 'Convert British Pounds to Japanese Yen. Check GBP to JPY exchange rates for Japan travel.' },
    { from: 'British Pound', to: 'Canadian Dollar', fromCode: 'GBP', toCode: 'CAD', fromSlug: 'british-pound', toSlug: 'canadian-dollar', description: 'Convert British Pounds to Canadian Dollars. Get GBP to CAD rates for Canada travel.' },
    { from: 'British Pound', to: 'Australian Dollar', fromCode: 'GBP', toCode: 'AUD', fromSlug: 'british-pound', toSlug: 'australian-dollar', description: 'Convert British Pounds to Australian Dollars. Check GBP to AUD exchange rates.' },
    { from: 'British Pound', to: 'Swiss Franc', fromCode: 'GBP', toCode: 'CHF', fromSlug: 'british-pound', toSlug: 'swiss-franc', description: 'Convert British Pounds to Swiss Francs. Get GBP to CHF rates for Swiss travel.' },

    // JPY conversions
    { from: 'Japanese Yen', to: 'US Dollar', fromCode: 'JPY', toCode: 'USD', fromSlug: 'japanese-yen', toSlug: 'us-dollar', description: 'Convert Japanese Yen to US Dollars. Check JPY to USD exchange rates for American travel.', featured: true },
    { from: 'Japanese Yen', to: 'Euro', fromCode: 'JPY', toCode: 'EUR', fromSlug: 'japanese-yen', toSlug: 'euro', description: 'Convert Japanese Yen to Euros. Get current JPY to EUR rates for European travel.' },
    { from: 'Japanese Yen', to: 'British Pound', fromCode: 'JPY', toCode: 'GBP', fromSlug: 'japanese-yen', toSlug: 'british-pound', description: 'Convert Japanese Yen to British Pounds. Check JPY to GBP exchange rates for UK travel.' },
    { from: 'Japanese Yen', to: 'Canadian Dollar', fromCode: 'JPY', toCode: 'CAD', fromSlug: 'japanese-yen', toSlug: 'canadian-dollar', description: 'Convert Japanese Yen to Canadian Dollars. Get JPY to CAD rates for Canada travel.' },
    { from: 'Japanese Yen', to: 'Australian Dollar', fromCode: 'JPY', toCode: 'AUD', fromSlug: 'japanese-yen', toSlug: 'australian-dollar', description: 'Convert Japanese Yen to Australian Dollars. Check JPY to AUD exchange rates.' },
    { from: 'Japanese Yen', to: 'Swiss Franc', fromCode: 'JPY', toCode: 'CHF', fromSlug: 'japanese-yen', toSlug: 'swiss-franc', description: 'Convert Japanese Yen to Swiss Francs. Get JPY to CHF rates for Swiss travel.' },

    // CAD conversions
    { from: 'Canadian Dollar', to: 'US Dollar', fromCode: 'CAD', toCode: 'USD', fromSlug: 'canadian-dollar', toSlug: 'us-dollar', description: 'Convert Canadian Dollars to US Dollars. Check CAD to USD exchange rates for cross-border shopping.' },
    { from: 'Canadian Dollar', to: 'Euro', fromCode: 'CAD', toCode: 'EUR', fromSlug: 'canadian-dollar', toSlug: 'euro', description: 'Convert Canadian Dollars to Euros. Get current CAD to EUR rates for European travel.' },
    { from: 'Canadian Dollar', to: 'British Pound', fromCode: 'CAD', toCode: 'GBP', fromSlug: 'canadian-dollar', toSlug: 'british-pound', description: 'Convert Canadian Dollars to British Pounds. Check CAD to GBP exchange rates.' },
    { from: 'Canadian Dollar', to: 'Japanese Yen', fromCode: 'CAD', toCode: 'JPY', fromSlug: 'canadian-dollar', toSlug: 'japanese-yen', description: 'Convert Canadian Dollars to Japanese Yen. Get CAD to JPY rates for Japan travel.' },
    { from: 'Canadian Dollar', to: 'Australian Dollar', fromCode: 'CAD', toCode: 'AUD', fromSlug: 'canadian-dollar', toSlug: 'australian-dollar', description: 'Convert Canadian Dollars to Australian Dollars. Check CAD to AUD exchange rates.' },
    { from: 'Canadian Dollar', to: 'Swiss Franc', fromCode: 'CAD', toCode: 'CHF', fromSlug: 'canadian-dollar', toSlug: 'swiss-franc', description: 'Convert Canadian Dollars to Swiss Francs. Get CAD to CHF rates.' },

    // AUD conversions
    { from: 'Australian Dollar', to: 'US Dollar', fromCode: 'AUD', toCode: 'USD', fromSlug: 'australian-dollar', toSlug: 'us-dollar', description: 'Convert Australian Dollars to US Dollars. Check AUD to USD exchange rates for American travel.' },
    { from: 'Australian Dollar', to: 'Euro', fromCode: 'AUD', toCode: 'EUR', fromSlug: 'australian-dollar', toSlug: 'euro', description: 'Convert Australian Dollars to Euros. Get current AUD to EUR rates for European travel.' },
    { from: 'Australian Dollar', to: 'British Pound', fromCode: 'AUD', toCode: 'GBP', fromSlug: 'australian-dollar', toSlug: 'british-pound', description: 'Convert Australian Dollars to British Pounds. Check AUD to GBP exchange rates.' },
    { from: 'Australian Dollar', to: 'Japanese Yen', fromCode: 'AUD', toCode: 'JPY', fromSlug: 'australian-dollar', toSlug: 'japanese-yen', description: 'Convert Australian Dollars to Japanese Yen. Get AUD to JPY rates for Japan travel.' },
    { from: 'Australian Dollar', to: 'Canadian Dollar', fromCode: 'AUD', toCode: 'CAD', fromSlug: 'australian-dollar', toSlug: 'canadian-dollar', description: 'Convert Australian Dollars to Canadian Dollars. Check AUD to CAD exchange rates.' },
    { from: 'Australian Dollar', to: 'Swiss Franc', fromCode: 'AUD', toCode: 'CHF', fromSlug: 'australian-dollar', toSlug: 'swiss-franc', description: 'Convert Australian Dollars to Swiss Francs. Get AUD to CHF rates.' },

    // CHF conversions
    { from: 'Swiss Franc', to: 'US Dollar', fromCode: 'CHF', toCode: 'USD', fromSlug: 'swiss-franc', toSlug: 'us-dollar', description: 'Convert Swiss Francs to US Dollars. Check CHF to USD exchange rates for American travel.' },
    { from: 'Swiss Franc', to: 'Euro', fromCode: 'CHF', toCode: 'EUR', fromSlug: 'swiss-franc', toSlug: 'euro', description: 'Convert Swiss Francs to Euros. Get current CHF to EUR rates for Eurozone travel.' },
    { from: 'Swiss Franc', to: 'British Pound', fromCode: 'CHF', toCode: 'GBP', fromSlug: 'swiss-franc', toSlug: 'british-pound', description: 'Convert Swiss Francs to British Pounds. Check CHF to GBP exchange rates.' },
    { from: 'Swiss Franc', to: 'Japanese Yen', fromCode: 'CHF', toCode: 'JPY', fromSlug: 'swiss-franc', toSlug: 'japanese-yen', description: 'Convert Swiss Francs to Japanese Yen. Get CHF to JPY rates for Japan travel.' },
    { from: 'Swiss Franc', to: 'Canadian Dollar', fromCode: 'CHF', toCode: 'CAD', fromSlug: 'swiss-franc', toSlug: 'canadian-dollar', description: 'Convert Swiss Francs to Canadian Dollars. Check CHF to CAD exchange rates.' },
    { from: 'Swiss Franc', to: 'Australian Dollar', fromCode: 'CHF', toCode: 'AUD', fromSlug: 'swiss-franc', toSlug: 'australian-dollar', description: 'Convert Swiss Francs to Australian Dollars. Get CHF to AUD rates.' },
  ];

  constructor() {
    // Generate conversion pair tools and add them to the main tools array
    this.generateConversionPairTools();
    this.generateBaseNumberPairTools();
    this.generatePercentageCalculatorVariantTools();
    this.generateCurrencyConverterPairTools();
  }

  /**
   * Convert camelCase to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Generate Tool objects for each conversion pair
   */
  private generateConversionPairTools(): void {
    const conversionTools: Tool[] = this.conversionPairs.map(pair => {
      // Convert slugs to kebab-case for URLs
      const fromSlugKebab = this.toKebabCase(pair.fromSlug);
      const toSlugKebab = this.toKebabCase(pair.toSlug);

      return {
        id: `unit-converter-${fromSlugKebab}-to-${toSlugKebab}`,
        name: `${pair.from} to ${pair.to} Converter`,
        description: pair.description,
        category: 'converter' as ToolCategory,
        icon: 'swap_horiz',
        route: `unit-converter/${fromSlugKebab}-to-${toSlugKebab}`,
        featured: pair.featured || false,
        tags: [
          'converter',
          'units',
          'measurement',
          pair.category,
          fromSlugKebab,
          toSlugKebab,
          `${fromSlugKebab} to ${toSlugKebab}`
        ],
        available: true
      };
    });

    // Add conversion tools to the main tools array
    this.tools.push(...conversionTools);
  }

  /**
   * Generate Tool objects for each base number conversion pair
   */
  private generateBaseNumberPairTools(): void {
    const baseNumberTools: Tool[] = this.baseNumberPairs.map(pair => {
      // Convert slugs to kebab-case for URLs
      const fromSlugKebab = this.toKebabCase(pair.fromSlug);
      const toSlugKebab = this.toKebabCase(pair.toSlug);

      return {
        id: `base-number-converter-${fromSlugKebab}-to-${toSlugKebab}`,
        name: `${pair.from} to ${pair.to} Converter`,
        description: pair.description,
        category: 'math' as ToolCategory,
        icon: 'calculate',
        route: `base-number-converter/${fromSlugKebab}-to-${toSlugKebab}`,
        featured: pair.featured || false,
        tags: [
          'converter',
          'base',
          'number',
          'math',
          'programming',
          fromSlugKebab,
          toSlugKebab,
          `${fromSlugKebab} to ${toSlugKebab}`,
          `base ${pair.fromBase}`,
          `base ${pair.toBase}`
        ],
        available: true
      };
    });

    // Add base number conversion tools to the main tools array
    this.tools.push(...baseNumberTools);
  }

  /**
   * Generate Tool objects for each percentage calculator variant
   */
  private generatePercentageCalculatorVariantTools(): void {
    const percentageTools: Tool[] = this.percentageCalculatorVariants.map(variant => {
      return {
        id: `percentage-calculator-${variant.slug}`,
        name: variant.name,
        description: variant.description,
        category: 'math' as ToolCategory,
        icon: 'percent',
        route: `percentage-calculator/${variant.slug}`,
        featured: variant.featured || false,
        tags: [
          'calculator',
          'percentage',
          'math',
          'finance',
          variant.slug,
          ...variant.slug.split('-')
        ],
        available: true
      };
    });

    // Add percentage calculator tools to the main tools array
    this.tools.push(...percentageTools);
  }

  /**
   * Generate Tool objects for each currency converter pair
   */
  private generateCurrencyConverterPairTools(): void {
    const currencyTools: Tool[] = this.currencyConverterPairs.map(pair => {
      return {
        id: `currency-converter-${pair.fromSlug}-to-${pair.toSlug}`,
        name: `${pair.from} to ${pair.to} Converter`,
        description: pair.description,
        category: 'converter' as ToolCategory,
        icon: 'currency_exchange',
        route: `currency-converter/${pair.fromSlug}-to-${pair.toSlug}`,
        featured: pair.featured || false,
        tags: [
          'converter',
          'currency',
          'money',
          'exchange',
          'forex',
          pair.fromCode.toLowerCase(),
          pair.toCode.toLowerCase(),
          pair.fromSlug,
          pair.toSlug,
          `${pair.fromCode} to ${pair.toCode}`,
          `${pair.fromSlug} to ${pair.toSlug}`
        ],
        available: true
      };
    });

    // Add currency converter tools to the main tools array
    this.tools.push(...currencyTools);
  }

  /**
   * Get all tools
   */
  getAllTools(): Tool[] {
    return [...this.tools];
  }

  /**
   * Get all available (implemented) tools
   */
  getAvailableTools(): Tool[] {
    return this.tools.filter(tool => tool.available !== false);
  }

  /**
   * Get available tools excluding conversion pairs (for navigation menus)
   */
  getAvailableToolsForNav(): Tool[] {
    return this.tools.filter(tool =>
      tool.available !== false && !this.isConversionPair(tool)
    );
  }

  /**
   * Check if a tool is a variant (unit converter, base number converter, percentage calculator, or currency converter)
   */
  private isConversionPair(tool: Tool): boolean {
    return tool.id.startsWith('unit-converter-') ||
           tool.id.startsWith('base-number-converter-') ||
           tool.id.startsWith('percentage-calculator-') ||
           tool.id.startsWith('currency-converter-');
  }

  /**
   * Get featured tools for home page
   */
  getFeaturedTools(): Tool[] {
    return this.tools.filter(tool => tool.featured && tool.available !== false);
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: ToolCategory): Tool[] {
    return this.tools.filter(tool => tool.category === category && tool.available !== false);
  }

  /**
   * Get tools by category excluding conversion pairs (for navigation menus)
   */
  getToolsByCategoryForNav(category: ToolCategory): Tool[] {
    return this.tools.filter(tool =>
      tool.category === category &&
      tool.available !== false &&
      !this.isConversionPair(tool)
    );
  }

  /**
   * Get a single tool by ID
   */
  getToolById(id: string): Tool | undefined {
    return this.tools.find(tool => tool.id === id);
  }

  /**
   * Get a single tool by route
   */
  getToolByRoute(route: string): Tool | undefined {
    return this.tools.find(tool => tool.route === route);
  }

  /**
   * Search tools by name, description, or tags
   */
  searchTools(query: string): Tool[] {
    if (!query || query.trim() === '') {
      return this.getAvailableTools();
    }

    const lowerQuery = query.toLowerCase().trim();

    return this.tools.filter(tool => {
      if (tool.available === false) return false;

      const matchesName = tool.name.toLowerCase().includes(lowerQuery);
      const matchesDescription = tool.description.toLowerCase().includes(lowerQuery);
      const matchesTags = tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchesCategory = tool.category.toLowerCase().includes(lowerQuery);

      return matchesName || matchesDescription || matchesTags || matchesCategory;
    });
  }

  /**
   * Get all category metadata
   */
  getAllCategories(): ToolCategoryMeta[] {
    return [...this.categoryMeta];
  }

  /**
   * Get category metadata by ID
   */
  getCategoryMeta(categoryId: ToolCategory): ToolCategoryMeta | undefined {
    return this.categoryMeta.find(cat => cat.id === categoryId);
  }

  /**
   * Get count of tools in a category
   */
  getToolCountByCategory(category: ToolCategory): number {
    return this.getToolsByCategory(category).length;
  }

  /**
   * Get count of tools in a category excluding conversion pairs (for navigation)
   */
  getToolCountByCategoryForNav(category: ToolCategory): number {
    return this.getToolsByCategoryForNav(category).length;
  }
}
