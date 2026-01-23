import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ContentVariation } from '../../models/platform.model';
import { ContentVariationService } from '../../services/content-variation.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog';

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
  private dialog = inject(MatDialog);

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
    const dialogData: ConfirmDialogData = {
      title: 'Delete Variation',
      message: 'Are you sure you want to delete this variation?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      icon: 'delete'
    };

    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: dialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.variationDelete.emit(id);
      }
    });
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
