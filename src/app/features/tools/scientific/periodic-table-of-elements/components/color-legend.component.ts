import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorMetric, LegendItem } from '../models/element.interface';
import { ColorMapper } from '../utils/color-mapping.util';
import { COLOR_METRIC_OPTIONS } from '../data/elements.data';

@Component({
  selector: 'app-color-legend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legend-container">
      <div class="legend-title">{{ legendTitle() }}</div>

      @if (isCategorical()) {
        <div class="legend-categorical">
          @for (item of legendItems(); track item.label) {
            <div class="legend-item"
                 (mouseenter)="onItemHover(item)"
                 (mouseleave)="onItemLeave()">
              <div
                class="color-chip"
                [style.background-color]="item.color">
              </div>
              <span class="legend-label">{{ item.label }}</span>
            </div>
          }
        </div>
      } @else {
        <div class="legend-continuous">
          <div class="gradient-bar" [style.background]="gradientBackground()"></div>
          <div class="gradient-labels">
            <span class="label-min">{{ minLabel() }}</span>
            <span class="label-max">{{ maxLabel() }}</span>
          </div>
          @if (hasUnknown()) {
            <div class="unknown-indicator">
              <div class="color-chip" [style.background-color]="unknownColor()"></div>
              <span class="legend-label">Unknown</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .legend-container {
      padding: 1rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      backdrop-filter: blur(10px);
    }

    .legend-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .legend-categorical {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .color-chip {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .legend-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      white-space: nowrap;
    }

    .legend-continuous {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .gradient-bar {
      height: 20px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .gradient-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .unknown-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .legend-categorical {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 0.5rem;
      }

      .legend-label {
        font-size: 0.7rem;
      }
    }
  `]
})
export class ColorLegendComponent {
  metric = input.required<ColorMetric>();
  minValue = input<number | null>(null);
  maxValue = input<number | null>(null);
  hasUnknownValues = input<boolean>(false);

  // Output events for hover interactions
  legendItemHover = output<string | number>();
  legendItemLeave = output<void>();

  private metricOption = computed(() => {
    return COLOR_METRIC_OPTIONS.find(opt => opt.value === this.metric());
  });

  isCategorical = computed(() => {
    return this.metricOption()?.type === 'categorical';
  });

  legendTitle = computed(() => {
    return this.metricOption()?.label || 'Color by';
  });

  legendItems = computed((): LegendItem[] => {
    const metric = this.metric();

    if (metric === 'category') {
      const colors = ColorMapper.getCategoricalColors('category');
      return [
        { color: colors['alkali-metal'], label: 'Alkali Metal', value: 'alkali-metal' },
        { color: colors['alkaline-earth-metal'], label: 'Alkaline Earth', value: 'alkaline-earth-metal' },
        { color: colors['transition-metal'], label: 'Transition Metal', value: 'transition-metal' },
        { color: colors['post-transition-metal'], label: 'Post-Transition', value: 'post-transition-metal' },
        { color: colors['metalloid'], label: 'Metalloid', value: 'metalloid' },
        { color: colors['nonmetal'], label: 'Nonmetal', value: 'nonmetal' },
        { color: colors['halogen'], label: 'Halogen', value: 'halogen' },
        { color: colors['noble-gas'], label: 'Noble Gas', value: 'noble-gas' },
        { color: colors['lanthanide'], label: 'Lanthanide', value: 'lanthanide' },
        { color: colors['actinide'], label: 'Actinide', value: 'actinide' }
      ];
    }

    if (metric === 'state') {
      const colors = ColorMapper.getCategoricalColors('state');
      return [
        { color: colors['solid'], label: 'Solid', value: 'solid' },
        { color: colors['liquid'], label: 'Liquid', value: 'liquid' },
        { color: colors['gas'], label: 'Gas', value: 'gas' },
        { color: colors['unknown'], label: 'Unknown', value: 'unknown' }
      ];
    }

    if (metric === 'block') {
      const colors = ColorMapper.getCategoricalColors('block');
      return [
        { color: colors['s'], label: 's-block', value: 's' },
        { color: colors['p'], label: 'p-block', value: 'p' },
        { color: colors['d'], label: 'd-block', value: 'd' },
        { color: colors['f'], label: 'f-block', value: 'f' }
      ];
    }

    return [];
  });

  gradientBackground = computed(() => {
    const colors = ColorMapper.getGradientStops();
    return `linear-gradient(to right, ${colors.join(', ')})`;
  });

  minLabel = computed(() => {
    const min = this.minValue();
    const unit = this.metricOption()?.unit || '';
    return min !== null ? `${min.toFixed(1)} ${unit}`.trim() : '';
  });

  maxLabel = computed(() => {
    const max = this.maxValue();
    const unit = this.metricOption()?.unit || '';
    return max !== null ? `${max.toFixed(1)} ${unit}`.trim() : '';
  });

  hasUnknown = computed(() => {
    return !this.isCategorical() && this.hasUnknownValues();
  });

  unknownColor = computed(() => {
    return ColorMapper.getUnknownColor();
  });

  onItemHover(item: LegendItem): void {
    if (item.value) {
      this.legendItemHover.emit(item.value);
    }
  }

  onItemLeave(): void {
    this.legendItemLeave.emit();
  }
}
