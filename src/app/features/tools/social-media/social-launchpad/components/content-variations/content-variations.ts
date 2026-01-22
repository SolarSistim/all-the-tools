import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContentVariation } from '../../models/platform.model';
import { ContentVariationService } from '../../services/content-variation.service';

@Component({
  selector: 'app-content-variations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './content-variations.html',
  styleUrl: './content-variations.scss'
})
export class ContentVariationsComponent {
  @Input() variations: ContentVariation[] = [];
  @Input() currentDescription: string = '';
  @Input() currentHashtags: string[] = [];

  @Output() variationCreate = new EventEmitter<void>();
  @Output() variationLoad = new EventEmitter<ContentVariation>();
  @Output() variationDelete = new EventEmitter<string>();

  private variationService = inject(ContentVariationService);

  get canCreateMore(): boolean {
    return this.variationService.canCreateMore();
  }

  onCreateVariation(): void {
    this.variationCreate.emit();
  }

  onLoadVariation(variation: ContentVariation): void {
    this.variationLoad.emit(variation);
  }

  onDeleteVariation(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this variation?');
    if (confirmed) {
      this.variationDelete.emit(id);
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
