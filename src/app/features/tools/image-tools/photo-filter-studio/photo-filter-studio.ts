import { Component, inject, OnInit, ViewChild, ElementRef, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { PhotoFilterStudioService, FilterAdjustments, FilterPreset } from './photo-filter-studio.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

@Component({
  selector: 'app-photo-filter-studio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './photo-filter-studio.html',
  styleUrl: './photo-filter-studio.scss'
})
export class PhotoFilterStudio implements OnInit {
  private filterService = inject(PhotoFilterStudioService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editorCanvas') editorCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('previewCanvas') previewCanvasRef!: ElementRef<HTMLCanvasElement>;

  uploadedImageName = signal<string>('');
  sourceImage = signal<HTMLImageElement | null>(null);
  adjustments = signal<FilterAdjustments>(this.filterService.getDefaultAdjustments());
  presets = signal<FilterPreset[]>(this.filterService.getPresets());
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  downloadFormat = signal<'png' | 'jpeg'>('png');
  jpegQuality = signal<number>(90);
  canvasWidth = signal<number>(800);
  canvasHeight = signal<number>(600);

  isDragging = signal<boolean>(false);
  isEditorOpen = signal<boolean>(false);

  filteredPresets = computed(() => this.presets());

  ngOnInit(): void {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Photo Filter Studio - Edit Images with Presets Online',
      description: 'Apply beautiful filters and adjustments to your photos. Choose from preset styles or customize brightness, contrast, saturation, and more. Download your edited images instantly.',
      keywords: ['photo editor', 'filters', 'image editing', 'presets', 'brightness', 'contrast'],
      image: 'https://www.allthethings.dev/meta-images/og-photo-filter-studio.png',
      url: 'https://www.allthethings.dev/tools/photo-filter-studio'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadImage(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.loadImage(event.dataTransfer.files[0]);
    }
  }

  private async loadImage(file: File): Promise<void> {
    this.errorMessage.set('');

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      this.errorMessage.set(`File is ${(file.size / 1024 / 1024).toFixed(1)}MB. Large files may take a moment to process.`);
    }

    this.isLoading.set(true);
    this.uploadedImageName.set(file.name);

    try {
      const img = await this.filterService.loadImage(file);
      this.sourceImage.set(img);

      const maxWidth = window.innerWidth > 1200 ? 1200 : window.innerWidth - 40;
      const scale = Math.min(1, maxWidth / img.width);
      this.canvasWidth.set(img.width * scale);
      this.canvasHeight.set(img.height * scale);

      this.adjustments.set(this.filterService.getDefaultAdjustments());

      // Open the editor first
      this.isEditorOpen.set(true);

      // Force change detection to ensure canvas is rendered in the DOM
      this.cdr.detectChanges();

      // Render the canvas after DOM has been updated
      // Use setTimeout to defer rendering until after the DOM update is complete
      setTimeout(() => {
        this.renderCanvas();
      }, 50);
    } catch (error) {
      this.errorMessage.set('Failed to load image. Please try a different file.');
      this.uploadedImageName.set('');
      this.sourceImage.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onAdjustmentChange(): void {
    this.renderCanvas();
  }

  private renderCanvas(): void {
    if (!this.sourceImage()) return;

    // Render to editor canvas if it exists and editor is open
    if (this.isEditorOpen() && this.editorCanvasRef) {
      const canvas = this.editorCanvasRef.nativeElement;
      canvas.width = this.canvasWidth();
      canvas.height = this.canvasHeight();

      this.filterService.applyFiltersToCanvas(
        canvas,
        this.sourceImage()!,
        this.adjustments()
      );
    }

    // Render to preview canvas if it exists and editor is closed
    if (!this.isEditorOpen() && this.previewCanvasRef) {
      const canvas = this.previewCanvasRef.nativeElement;
      canvas.width = this.canvasWidth();
      canvas.height = this.canvasHeight();

      this.filterService.applyFiltersToCanvas(
        canvas,
        this.sourceImage()!,
        this.adjustments()
      );
    }
  }

  applyPreset(preset: FilterPreset): void {
    const newAdjustments = {
      ...this.adjustments(),
      ...preset.adjustments
    };
    this.adjustments.set(newAdjustments);
    this.renderCanvas();
  }

  resetFilters(): void {
    this.adjustments.set(this.filterService.getDefaultAdjustments());
    this.renderCanvas();
    this.snackbar.success('Filters reset', 2000);
  }

  downloadImage(): void {
    // Use editor canvas if open, otherwise preview canvas
    const canvasRef = this.isEditorOpen() ? this.editorCanvasRef : this.previewCanvasRef;
    if (!canvasRef) return;

    const canvas = canvasRef.nativeElement;
    const filename = this.filterService.getTimestampFilename();

    this.filterService.downloadImage(
      canvas,
      filename,
      this.downloadFormat(),
      this.jpegQuality()
    );

    this.snackbar.success('Image downloaded', 2000);
  }

  resetAdjustment(key: keyof FilterAdjustments): void {
    const defaultValue = this.filterService.getDefaultAdjustments()[key];
    const newAdjustments = { ...this.adjustments() };
    newAdjustments[key] = defaultValue;
    this.adjustments.set(newAdjustments);
    this.renderCanvas();
  }

  getAdjustmentLabel(key: keyof FilterAdjustments): string {
    const labels: Record<keyof FilterAdjustments, string> = {
      brightness: 'Brightness',
      contrast: 'Contrast',
      saturation: 'Saturation',
      warmth: 'Warmth',
      tint: 'Tint',
      exposure: 'Exposure',
      vignette: 'Vignette',
      sharpness: 'Sharpness'
    };
    return labels[key];
  }

  hasImage = computed(() => this.sourceImage() !== null);

  openEditor(): void {
    this.isEditorOpen.set(true);
    // Force change detection to ensure editor canvas is in DOM
    this.cdr.detectChanges();
    // Render to the editor canvas after a short delay
    setTimeout(() => {
      this.renderCanvas();
    }, 50);
  }

  closeEditor(): void {
    this.isEditorOpen.set(false);
    // Force change detection to ensure preview canvas is in DOM
    this.cdr.detectChanges();
    // Render to the preview canvas after a short delay
    setTimeout(() => {
      this.renderCanvas();
    }, 50);
  }
}
