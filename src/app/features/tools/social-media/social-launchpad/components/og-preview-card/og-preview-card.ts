import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OGData } from '../../models/platform.model';

@Component({
  selector: 'app-og-preview-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './og-preview-card.html',
  styleUrl: './og-preview-card.scss'
})
export class OGPreviewCardComponent {
  @Input() ogData: OGData | null = null;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  get hasOGData(): boolean {
    return !!this.ogData;
  }

  get imageDimensions(): string {
    if (!this.ogData?.imageDimensions) {
      return 'Unknown dimensions';
    }
    const { width, height } = this.ogData.imageDimensions;
    return `${width}×${height}`;
  }
}
