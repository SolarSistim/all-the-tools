import { ElementCategory, StandardState, ChemicalBlock, ColorMetric } from '../models/element.interface';

export class ColorMapper {
  // Category colors - vibrant palette matching retro-futuristic theme
  private static readonly CATEGORY_COLORS: Record<ElementCategory, string> = {
    'alkali-metal': '#FF6B9D',
    'alkaline-earth-metal': '#FFA07A',
    'transition-metal': '#FFD700',
    'post-transition-metal': '#90EE90',
    'metalloid': '#87CEEB',
    'nonmetal': '#98D8C8',
    'halogen': '#DDA0DD',
    'noble-gas': '#FF69B4',
    'lanthanide': '#FFA500',
    'actinide': '#FF4500'
  };

  // State colors
  private static readonly STATE_COLORS: Record<StandardState, string> = {
    'solid': '#4A90E2',
    'liquid': '#50C878',
    'gas': '#FF6B9D',
    'unknown': '#95A5A6'
  };

  // Block colors
  private static readonly BLOCK_COLORS: Record<ChemicalBlock, string> = {
    's': '#FF6B9D',
    'p': '#4A90E2',
    'd': '#FFD700',
    'f': '#FF4500'
  };

  // Viridis-inspired 5-color gradient for continuous metrics
  private static readonly GRADIENT_COLORS = [
    '#440154', // Deep purple
    '#31688E', // Blue
    '#35B779', // Green
    '#FDE724', // Yellow
    '#FF5733'  // Red-orange
  ];

  private static readonly UNKNOWN_COLOR = '#95A5A6';

  // Color cache for performance
  private static colorCache = new Map<string, string>();

  /**
   * Get color for an element based on the selected metric
   */
  static getColor(
    metric: ColorMetric,
    value: any,
    min?: number,
    max?: number
  ): string {
    if (value === null || value === undefined) {
      return this.UNKNOWN_COLOR;
    }

    const cacheKey = `${metric}-${value}-${min}-${max}`;
    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!;
    }

    let color: string;

    switch (metric) {
      case 'category':
        color = this.CATEGORY_COLORS[value as ElementCategory] || this.UNKNOWN_COLOR;
        break;
      case 'state':
        color = this.STATE_COLORS[value as StandardState] || this.UNKNOWN_COLOR;
        break;
      case 'block':
        color = this.BLOCK_COLORS[value as ChemicalBlock] || this.UNKNOWN_COLOR;
        break;
      default:
        // Continuous metrics
        if (typeof value === 'number' && min !== undefined && max !== undefined) {
          color = this.interpolateGradient(value, min, max);
        } else {
          color = this.UNKNOWN_COLOR;
        }
    }

    this.colorCache.set(cacheKey, color);
    return color;
  }

  /**
   * Interpolate color from gradient based on normalized value (0-1)
   */
  private static interpolateGradient(value: number, min: number, max: number): string {
    // Normalize value to 0-1 range
    const normalized = max === min ? 0.5 : (value - min) / (max - min);
    const clampedValue = Math.max(0, Math.min(1, normalized));

    // Determine which two colors to interpolate between
    const segmentCount = this.GRADIENT_COLORS.length - 1;
    const segment = clampedValue * segmentCount;
    const segmentIndex = Math.floor(segment);
    const segmentProgress = segment - segmentIndex;

    const startColorIndex = Math.min(segmentIndex, segmentCount - 1);
    const endColorIndex = Math.min(startColorIndex + 1, segmentCount);

    const startColor = this.hexToRgb(this.GRADIENT_COLORS[startColorIndex]);
    const endColor = this.hexToRgb(this.GRADIENT_COLORS[endColorIndex]);

    if (!startColor || !endColor) {
      return this.UNKNOWN_COLOR;
    }

    // Interpolate between the two colors
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * segmentProgress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * segmentProgress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * segmentProgress);

    return this.rgbToHex(r, g, b);
  }

  /**
   * Calculate appropriate text color (black or white) for readability based on background
   * Uses WCAG relative luminance formula
   */
  static getTextColor(backgroundColor: string): string {
    const rgb = this.hexToRgb(backgroundColor);
    if (!rgb) return '#FFFFFF';

    const luminance = this.calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  /**
   * Calculate relative luminance using WCAG formula
   */
  private static calculateRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  /**
   * Convert RGB to hex color
   */
  private static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Get all colors for a categorical metric
   */
  static getCategoricalColors(metric: 'category' | 'state' | 'block'): Record<string, string> {
    switch (metric) {
      case 'category':
        return { ...this.CATEGORY_COLORS };
      case 'state':
        return { ...this.STATE_COLORS };
      case 'block':
        return { ...this.BLOCK_COLORS };
    }
  }

  /**
   * Get gradient color stops for continuous metrics
   */
  static getGradientStops(): string[] {
    return [...this.GRADIENT_COLORS];
  }

  /**
   * Clear the color cache (call when metric changes)
   */
  static clearCache(): void {
    this.colorCache.clear();
  }

  /**
   * Get unknown color
   */
  static getUnknownColor(): string {
    return this.UNKNOWN_COLOR;
  }
}
