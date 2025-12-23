import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

interface ColorStop {
  id: number;
  color: string;
  position: number; // 0-100
}

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle: number; // for linear (0-360)
  shape: 'circle' | 'ellipse'; // for radial
  radialPosition: { x: number; y: number }; // for radial (0-100)
  colorStops: ColorStop[];
}

interface GradientPreset {
  name: string;
  gradient: string;
  config: GradientConfig;
}

@Component({
  selector: 'app-gradient-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
    MatChipsModule,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './gradient-generator.html',
  styleUrl: './gradient-generator.scss'
})
export class GradientGenerator implements OnInit {
  private snackbar = inject(CustomSnackbarService);
  private metaService = inject(MetaService);
  private nextColorStopId = 3;

  // Gradient configuration
  gradientConfig = signal<GradientConfig>({
    type: 'linear',
    angle: 90,
    shape: 'circle',
    radialPosition: { x: 50, y: 50 },
    colorStops: [
      { id: 1, color: '#667eea', position: 0 },
      { id: 2, color: '#764ba2', position: 100 }
    ]
  });

  // Computed CSS gradient
  cssGradient = computed(() => {
    const config = this.gradientConfig();
    const stops = config.colorStops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (config.type) {
      case 'linear':
        return `linear-gradient(${config.angle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(${config.shape} at ${config.radialPosition.x}% ${config.radialPosition.y}%, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${config.angle}deg, ${stops})`;
      default:
        return '';
    }
  });

  // Preset gradients
  presets: GradientPreset[] = [
    {
      name: 'Sunset',
      gradient: 'linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%)',
      config: {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#ff6b6b', position: 0 },
          { id: 2, color: '#feca57', position: 50 },
          { id: 3, color: '#ee5a6f', position: 100 }
        ]
      }
    },
    {
      name: 'Ocean',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      config: {
        type: 'linear',
        angle: 135,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#667eea', position: 0 },
          { id: 2, color: '#764ba2', position: 100 }
        ]
      }
    },
    {
      name: 'Forest',
      gradient: 'linear-gradient(90deg, #134e5e 0%, #71b280 100%)',
      config: {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#134e5e', position: 0 },
          { id: 2, color: '#71b280', position: 100 }
        ]
      }
    },
    {
      name: 'Fire',
      gradient: 'linear-gradient(45deg, #f12711 0%, #f5af19 100%)',
      config: {
        type: 'linear',
        angle: 45,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#f12711', position: 0 },
          { id: 2, color: '#f5af19', position: 100 }
        ]
      }
    },
    {
      name: 'Purple Dream',
      gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      config: {
        type: 'linear',
        angle: 135,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#c471f5', position: 0 },
          { id: 2, color: '#fa71cd', position: 100 }
        ]
      }
    },
    {
      name: 'Aurora',
      gradient: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
      config: {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#00c6ff', position: 0 },
          { id: 2, color: '#0072ff', position: 100 }
        ]
      }
    },
    {
      name: 'Peach',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      config: {
        type: 'linear',
        angle: 135,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#ffecd2', position: 0 },
          { id: 2, color: '#fcb69f', position: 100 }
        ]
      }
    },
    {
      name: 'Neon',
      gradient: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
      config: {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#fa709a', position: 0 },
          { id: 2, color: '#fee140', position: 100 }
        ]
      }
    },
    {
      name: 'Cool Sky',
      gradient: 'radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%)',
      config: {
        type: 'radial',
        angle: 0,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#a1c4fd', position: 0 },
          { id: 2, color: '#c2e9fb', position: 100 }
        ]
      }
    },
    {
      name: 'Rainbow',
      gradient: 'conic-gradient(from 0deg, #ff0000 0%, #ff7f00 14%, #ffff00 28%, #00ff00 42%, #0000ff 57%, #4b0082 71%, #9400d3 85%, #ff0000 100%)',
      config: {
        type: 'conic',
        angle: 0,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#ff0000', position: 0 },
          { id: 2, color: '#ff7f00', position: 14 },
          { id: 3, color: '#ffff00', position: 28 },
          { id: 4, color: '#00ff00', position: 42 },
          { id: 5, color: '#0000ff', position: 57 },
          { id: 6, color: '#4b0082', position: 71 },
          { id: 7, color: '#9400d3', position: 85 },
          { id: 8, color: '#ff0000', position: 100 }
        ]
      }
    },
    {
      name: 'Mint Fresh',
      gradient: 'linear-gradient(135deg, #0fd850 0%, #f9f047 100%)',
      config: {
        type: 'linear',
        angle: 135,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#0fd850', position: 0 },
          { id: 2, color: '#f9f047', position: 100 }
        ]
      }
    },
    {
      name: 'Coral Reef',
      gradient: 'linear-gradient(90deg, #ff9a56 0%, #ff6a88 50%, #ff99ac 100%)',
      config: {
        type: 'linear',
        angle: 90,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#ff9a56', position: 0 },
          { id: 2, color: '#ff6a88', position: 50 },
          { id: 3, color: '#ff99ac', position: 100 }
        ]
      }
    },
    {
      name: 'Deep Space',
      gradient: 'radial-gradient(circle, #4158d0 0%, #c850c0 46%, #ffcc70 100%)',
      config: {
        type: 'radial',
        angle: 0,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#4158d0', position: 0 },
          { id: 2, color: '#c850c0', position: 46 },
          { id: 3, color: '#ffcc70', position: 100 }
        ]
      }
    },
    {
      name: 'Golden Hour',
      gradient: 'linear-gradient(45deg, #ffd89b 0%, #19547b 100%)',
      config: {
        type: 'linear',
        angle: 45,
        shape: 'circle',
        radialPosition: { x: 50, y: 50 },
        colorStops: [
          { id: 1, color: '#ffd89b', position: 0 },
          { id: 2, color: '#19547b', position: 100 }
        ]
      }
    }
  ];

  // Showcase gradients for header display
  showcaseGradients = [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { gradient: 'linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%)' },
    { gradient: 'radial-gradient(circle at center, #a1c4fd 0%, #c2e9fb 100%)' },
    { gradient: 'conic-gradient(from 0deg, #ff0000 0%, #ff7f00 14%, #ffff00 28%, #00ff00 42%, #0000ff 57%, #4b0082 71%, #9400d3 85%, #ff0000 100%)' },
    { gradient: 'linear-gradient(45deg, #f12711 0%, #f5af19 100%)' },
    { gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
    { gradient: 'radial-gradient(ellipse at top, #00c6ff 0%, #0072ff 100%)' },
    { gradient: 'linear-gradient(90deg, #134e5e 0%, #71b280 100%)' },
    { gradient: 'conic-gradient(from 90deg, #667eea, #764ba2, #f093fb, #667eea)' }
  ];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Gradient Generator - CSS Linear & Radial Gradients',
      description: 'Create beautiful CSS gradients with our visual gradient generator. Support for linear, radial, and conic gradients with live preview and one-click CSS copy.',
      keywords: ['gradient generator', 'css gradients', 'linear gradient', 'radial gradient', 'conic gradient', 'gradient tool', 'color gradients', 'css generator'],
      image: 'https://www.allthethings.dev/meta-images/og-gradient-generator.png',
      url: 'https://www.allthethings.dev/tools/gradient-generator'
    });
  }

  /**
   * Add a new color stop
   */
  addColorStop(): void {
    const config = this.gradientConfig();
    const newPosition = config.colorStops.length > 0
      ? Math.min(100, Math.max(...config.colorStops.map(s => s.position)) + 10)
      : 50;

    const newStop: ColorStop = {
      id: this.nextColorStopId++,
      color: '#ff0000',
      position: newPosition
    };

    this.gradientConfig.set({
      ...config,
      colorStops: [...config.colorStops, newStop]
    });
  }

  /**
   * Remove a color stop
   */
  removeColorStop(id: number): void {
    const config = this.gradientConfig();
    if (config.colorStops.length <= 2) {
      this.snackbar.warning('Must have at least 2 color stops', 2000);
      return;
    }

    this.gradientConfig.set({
      ...config,
      colorStops: config.colorStops.filter(stop => stop.id !== id)
    });
  }

  /**
   * Update a color stop
   */
  updateColorStop(id: number, updates: Partial<ColorStop>): void {
    const config = this.gradientConfig();
    this.gradientConfig.set({
      ...config,
      colorStops: config.colorStops.map(stop =>
        stop.id === id ? { ...stop, ...updates } : stop
      )
    });
  }

  /**
   * Update gradient type
   */
  updateGradientType(type: 'linear' | 'radial' | 'conic'): void {
    const config = this.gradientConfig();
    this.gradientConfig.set({ ...config, type });
  }

  /**
   * Update gradient angle
   */
  updateAngle(angle: number): void {
    const config = this.gradientConfig();
    this.gradientConfig.set({ ...config, angle });
  }

  /**
   * Update radial shape
   */
  updateShape(shape: 'circle' | 'ellipse'): void {
    const config = this.gradientConfig();
    this.gradientConfig.set({ ...config, shape });
  }

  /**
   * Update radial position
   */
  updateRadialPosition(axis: 'x' | 'y', value: number): void {
    const config = this.gradientConfig();
    this.gradientConfig.set({
      ...config,
      radialPosition: {
        ...config.radialPosition,
        [axis]: value
      }
    });
  }

  /**
   * Apply a preset gradient
   */
  applyPreset(preset: GradientPreset): void {
    this.nextColorStopId = Math.max(...preset.config.colorStops.map(s => s.id)) + 1;
    this.gradientConfig.set({ ...preset.config });
    this.snackbar.success(`Applied "${preset.name}" preset`, 2000);
  }

  /**
   * Copy CSS to clipboard
   */
  async copyCss(): Promise<void> {
    const css = this.cssGradient();
    try {
      await navigator.clipboard.writeText(css);
      this.snackbar.success('CSS copied to clipboard!', 2000);
    } catch (err) {
      this.snackbar.error('Failed to copy CSS', 2000);
    }
  }

  /**
   * Copy full CSS property to clipboard
   */
  async copyFullCss(): Promise<void> {
    const css = `background: ${this.cssGradient()};`;
    try {
      await navigator.clipboard.writeText(css);
      this.snackbar.success('Full CSS property copied!', 2000);
    } catch (err) {
      this.snackbar.error('Failed to copy CSS', 2000);
    }
  }

  /**
   * Randomize gradient
   */
  randomizeGradient(): void {
    const types: ('linear' | 'radial' | 'conic')[] = ['linear', 'radial', 'conic'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAngle = Math.floor(Math.random() * 360);
    const numStops = Math.floor(Math.random() * 3) + 2; // 2-4 stops

    const colorStops: ColorStop[] = [];
    for (let i = 0; i < numStops; i++) {
      colorStops.push({
        id: this.nextColorStopId++,
        color: this.randomColor(),
        position: Math.round((100 / (numStops - 1)) * i)
      });
    }

    this.gradientConfig.set({
      type: randomType,
      angle: randomAngle,
      shape: Math.random() > 0.5 ? 'circle' : 'ellipse',
      radialPosition: {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100)
      },
      colorStops
    });

    this.snackbar.success('Random gradient generated!', 2000);
  }

  /**
   * Generate random color
   */
  private randomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  /**
   * Get angle direction label
   */
  getAngleLabel(angle: number): string {
    if (angle === 0) return 'to top';
    if (angle === 45) return 'to top right';
    if (angle === 90) return 'to right';
    if (angle === 135) return 'to bottom right';
    if (angle === 180) return 'to bottom';
    if (angle === 225) return 'to bottom left';
    if (angle === 270) return 'to left';
    if (angle === 315) return 'to top left';
    return `${angle}°`;
  }

  /**
   * Track by function for color stops
   */
  trackByStopId(index: number, stop: ColorStop): number {
    return stop.id;
  }

  /**
   * Scroll to gradient generator
   */
  scrollToGenerator(): void {
    const element = document.querySelector('.preset-gradient');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}