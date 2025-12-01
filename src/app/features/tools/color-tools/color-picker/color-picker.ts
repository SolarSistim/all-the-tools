import { Component, inject, signal, computed, effect, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MetaService } from '../../../../core/services/meta.service';

// Color interface
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
})
export class ColorPicker implements OnInit {
  private metaService = inject(MetaService);
  private snackBar = inject(MatSnackBar);

  // Color picker state
  hue = signal<number>(200);
  saturation = signal<number>(100);
  lightness = signal<number>(50);

  // Computed current color in different formats
  currentHSL = computed<HSL>(() => ({
    h: this.hue(),
    s: this.saturation(),
    l: this.lightness()
  }));

  currentRGB = computed<RGB>(() => this.hslToRgb(this.currentHSL()));
  currentHex = computed<string>(() => this.rgbToHex(this.currentRGB()));

  // Input values for manual entry
  hexInput = signal<string>('');
  rgbRInput = signal<number>(0);
  rgbGInput = signal<number>(0);
  rgbBInput = signal<number>(0);
  hslHInput = signal<number>(0);
  hslSInput = signal<number>(0);
  hslLInput = signal<number>(0);

  // Contrast check colors
  foregroundColor = signal<string>('#000000');
  backgroundColor = signal<string>('#FFFFFF');
  contrastRatio = computed<number>(() =>
    this.calculateContrastRatio(this.foregroundColor(), this.backgroundColor())
  );

  // ViewChild references for color pickers
  @ViewChild('hexColorPicker') hexColorPicker!: ElementRef<HTMLInputElement>;
  @ViewChild('foregroundPicker') foregroundPicker!: ElementRef<HTMLInputElement>;
  @ViewChild('backgroundPicker') backgroundPicker!: ElementRef<HTMLInputElement>;

  constructor() {
    // Update inputs when color changes
    effect(() => {
      const hsl = this.currentHSL();
      const rgb = this.currentRGB();
      const hex = this.currentHex();

      this.hexInput.set(hex);
      this.rgbRInput.set(rgb.r);
      this.rgbGInput.set(rgb.g);
      this.rgbBInput.set(rgb.b);
      this.hslHInput.set(Math.round(hsl.h));
      this.hslSInput.set(Math.round(hsl.s));
      this.hslLInput.set(Math.round(hsl.l));

      // Update contrast check with current color
      this.foregroundColor.set(hex);
    });
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Color Picker & Contrast Checker',
      description: 'Advanced color picker tool with multiple color formats (Hex, RGB, HSL) and WCAG contrast checker. Perfect for accessible web design.',
      keywords: ['color picker', 'color palette', 'hex color', 'rgb color', 'hsl color', 'contrast checker', 'wcag contrast', 'color converter', 'accessibility'],
      image: 'https://www.allthethings.dev/meta-images/og-color-picker.png',
      url: 'https://www.allthethings.dev/tools/color-picker'
    });

    // Initialize with a nice blue color
    this.updateFromHex('#3f51b5');
  }

  // ============================================
  // COLOR CONVERSION UTILITIES
  // ============================================

  /**
   * Convert HSL to RGB
   */
  hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Convert RGB to HSL
   */
  rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert RGB to Hex
   */
  rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
      const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Convert Hex to RGB
   */
  hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // ============================================
  // COLOR UPDATE METHODS
  // ============================================

  /**
   * Update color from HSL sliders
   */
  updateFromHSL(): void {
    // Values are already updated through ngModel
  }

  /**
   * Update color from Hex input
   */
  updateFromHex(hex: string): void {
    const rgb = this.hexToRgb(hex);
    if (rgb) {
      const hsl = this.rgbToHsl(rgb);
      this.hue.set(hsl.h);
      this.saturation.set(hsl.s);
      this.lightness.set(hsl.l);
    }
  }

  /**
   * Update color from RGB inputs
   */
  updateFromRGB(): void {
    const rgb = {
      r: this.rgbRInput(),
      g: this.rgbGInput(),
      b: this.rgbBInput()
    };
    const hsl = this.rgbToHsl(rgb);
    this.hue.set(hsl.h);
    this.saturation.set(hsl.s);
    this.lightness.set(hsl.l);
  }

  /**
   * Update color from HSL inputs
   */
  updateFromHSLInput(): void {
    this.hue.set(this.hslHInput());
    this.saturation.set(this.hslSInput());
    this.lightness.set(this.hslLInput());
  }

  // ============================================
  // COLOR PICKER HELPERS
  // ============================================

  /**
   * Open hex color picker
   */
  openHexColorPicker(): void {
    if (this.hexColorPicker) {
      this.hexColorPicker.nativeElement.click();
    }
  }

  // ============================================
  // CONTRAST CHECKING
  // ============================================

  /**
   * Open foreground color picker
   */
  openForegroundColorPicker(): void {
    if (this.foregroundPicker) {
      this.foregroundPicker.nativeElement.click();
    }
  }

  /**
   * Open background color picker
   */
  openBackgroundColorPicker(): void {
    if (this.backgroundPicker) {
      this.backgroundPicker.nativeElement.click();
    }
  }

  /**
   * Calculate relative luminance
   */
  private getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      const normalized = val / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get contrast rating
   */
  getContrastRating(ratio: number): { level: string; description: string; color: string } {
    if (ratio >= 7) {
      return { level: 'AAA', description: 'Excellent', color: '#4caf50' };
    } else if (ratio >= 4.5) {
      return { level: 'AA', description: 'Good', color: '#8bc34a' };
    } else if (ratio >= 3) {
      return { level: 'AA Large', description: 'Fair', color: '#ff9800' };
    } else {
      return { level: 'Fail', description: 'Poor', color: '#f44336' };
    }
  }

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open(`${label} copied to clipboard!`, 'Close', {
        duration: 2000
      });
    } catch (err) {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 2000
      });
    }
  }

  /**
   * Copy color in specific format
   */
  async copyHex(): Promise<void> {
    await this.copyToClipboard(this.currentHex(), 'Hex color');
  }

  async copyRGB(): Promise<void> {
    const rgb = this.currentRGB();
    await this.copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB color');
  }

  async copyHSL(): Promise<void> {
    const hsl = this.currentHSL();
    await this.copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL color');
  }

  // ============================================
  // UI HELPERS
  // ============================================

  /**
   * Get gradient for hue slider
   */
  getHueGradient(): string {
    return 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  }

  /**
   * Get gradient for saturation slider
   */
  getSaturationGradient(): string {
    const hsl = this.currentHSL();
    return `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`;
  }

  /**
   * Get gradient for lightness slider
   */
  getLightnessGradient(): string {
    const hsl = this.currentHSL();
    return `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`;
  }

  /**
   * Format slider label
   */
  formatLabel(value: number): string {
    return `${value}`;
  }

  /**
   * Scroll to section
   */
  scrollToSection(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
