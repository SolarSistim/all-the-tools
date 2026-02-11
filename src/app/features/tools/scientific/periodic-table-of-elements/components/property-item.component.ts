import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomSnackbarService } from '../../../../../core/services/custom-snackbar.service';

@Component({
  selector: 'app-property-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="property-item">
      <div class="property-label">{{ label() }}</div>
      <div class="property-value-wrapper">
        <span class="property-value" [class.highlighted]="highlighted()">
          {{ formattedValue() }}
        </span>
        @if (copyable() && value() !== null && value() !== undefined) {
          <button
            mat-icon-button
            class="copy-btn"
            (click)="copyValue()"
            matTooltip="Copy to clipboard"
            aria-label="Copy value to clipboard">
            <mat-icon>content_copy</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .property-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      &:last-child {
        border-bottom: none;
      }
    }

    .property-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
    }

    .property-value-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .property-value {
      font-size: 1rem;
      color: #fff;
      font-weight: 600;
      transition: all 0.3s ease;

      &.highlighted {
        color: #FFD700;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
      }
    }

    .copy-btn {
      opacity: 0;
      transition: opacity 0.2s ease;

      ::ng-deep .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .property-item:hover .copy-btn {
      opacity: 1;
    }
  `]
})
export class PropertyItemComponent {
  label = input.required<string>();
  value = input.required<any>();
  unit = input<string>('');
  highlighted = input<boolean>(false);
  copyable = input<boolean>(true);

  private snackbarService = inject(CustomSnackbarService);

  formattedValue(): string {
    const val = this.value();

    if (val === null || val === undefined) {
      return 'Unknown';
    }

    if (Array.isArray(val)) {
      return val.join(', ');
    }

    const unitStr = this.unit();
    if (typeof val === 'number') {
      // Don't format years with commas
      const isYear = this.label().toLowerCase().includes('year');
      const formattedNumber = isYear ? val.toString() : val.toLocaleString();
      return unitStr ? `${formattedNumber} ${unitStr}` : formattedNumber;
    }

    return unitStr ? `${val} ${unitStr}` : String(val);
  }

  copyValue(): void {
    const val = this.value();
    if (val === null || val === undefined) return;

    const textToCopy = Array.isArray(val) ? val.join(', ') : String(val);

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.snackbarService.success(`Copied: ${textToCopy}`);
    }).catch(() => {
      this.snackbarService.error('Failed to copy to clipboard');
    });
  }
}
