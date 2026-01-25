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

  constructor() { }

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
}
