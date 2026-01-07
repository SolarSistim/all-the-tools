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
      available: true
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
    available: true
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
