import { Component, inject, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import JSZip from 'jszip';
import { MetaService } from '../../../../core/services/meta.service';

interface IconSize {
  name: string;
  size: number;
  selected: boolean;
  category: 'favicon' | 'apple' | 'android' | 'windows' | 'custom';
  description: string;
}

@Component({
  selector: 'app-icon-generator',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './icon-generator.html',
  styleUrl: './icon-generator.scss',
})
export class IconGenerator implements AfterViewInit {

  private metaService = inject(MetaService);
  @ViewChild('cropPreviewContainer') cropPreviewContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  uploadedImage: string | null = null;
  originalImage: HTMLImageElement | null = null;
  isDragging = false;
  Math = Math; // Expose Math to template

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  // Crop settings (percentage values 0-100)
  cropX = 50; // Center horizontally by default
  cropY = 50; // Center vertically by default
  cropSize = 80; // Size as percentage of the smaller dimension

  // Interactive crop state
  isDraggingCrop = false;
  isResizingCrop = false;
  resizeHandle: 'nw' | 'ne' | 'sw' | 'se' | null = null;
  dragStartX = 0;
  dragStartY = 0;
  cropStartX = 0;
  cropStartY = 0;
  cropStartSize = 0;
  previewContainerRect: DOMRect | null = null;

  iconSizes: IconSize[] = [
    // Favicon sizes
    { name: 'Favicon 16x16', size: 16, selected: true, category: 'favicon', description: 'Standard browser favicon' },
    { name: 'Favicon 32x32', size: 32, selected: true, category: 'favicon', description: 'Retina browser favicon' },
    { name: 'Favicon 48x48', size: 48, selected: true, category: 'favicon', description: 'Windows site icon' },
    
    // Apple Touch Icons
    { name: 'Apple Touch 57x57', size: 57, selected: false, category: 'apple', description: 'iPhone (non-retina)' },
    { name: 'Apple Touch 60x60', size: 60, selected: true, category: 'apple', description: 'iPhone' },
    { name: 'Apple Touch 72x72', size: 72, selected: false, category: 'apple', description: 'iPad (non-retina)' },
    { name: 'Apple Touch 76x76', size: 76, selected: true, category: 'apple', description: 'iPad' },
    { name: 'Apple Touch 114x114', size: 114, selected: false, category: 'apple', description: 'iPhone (retina)' },
    { name: 'Apple Touch 120x120', size: 120, selected: true, category: 'apple', description: 'iPhone Retina' },
    { name: 'Apple Touch 144x144', size: 144, selected: false, category: 'apple', description: 'iPad (retina)' },
    { name: 'Apple Touch 152x152', size: 152, selected: true, category: 'apple', description: 'iPad Retina' },
    { name: 'Apple Touch 180x180', size: 180, selected: true, category: 'apple', description: 'iPhone 6 Plus' },
    
    // Android
    { name: 'Android 36x36', size: 36, selected: false, category: 'android', description: 'LDPI' },
    { name: 'Android 48x48', size: 48, selected: false, category: 'android', description: 'MDPI' },
    { name: 'Android 72x72', size: 72, selected: true, category: 'android', description: 'HDPI' },
    { name: 'Android 96x96', size: 96, selected: true, category: 'android', description: 'XHDPI' },
    { name: 'Android 144x144', size: 144, selected: true, category: 'android', description: 'XXHDPI' },
    { name: 'Android 192x192', size: 192, selected: true, category: 'android', description: 'XXXHDPI' },
    
    // Windows
    { name: 'Windows 70x70', size: 70, selected: false, category: 'windows', description: 'Small tile' },
    { name: 'Windows 150x150', size: 150, selected: true, category: 'windows', description: 'Medium tile' },
    { name: 'Windows 310x310', size: 310, selected: true, category: 'windows', description: 'Large tile' },
    
    // Custom/Common sizes
    { name: 'Square 64x64', size: 64, selected: true, category: 'custom', description: 'Common icon size' },
    { name: 'Square 128x128', size: 128, selected: true, category: 'custom', description: 'Common icon size' },
    { name: 'Square 256x256', size: 256, selected: true, category: 'custom', description: 'Common icon size' },
    { name: 'Square 512x512', size: 512, selected: true, category: 'custom', description: 'Large icon size' },
  ];

    ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Icon Generator - ICO, PNG, adjust dimensions and download as ZIP.',
      description: 'Convert any image into an icon or transparent PNG using the Icon Generator.',
      keywords: ['icon generator','convert icon','convert ico','convert png'],
      image: 'https://www.allthethings.dev/meta-images/og-icon-generator.png',
      url: 'https://www.allthethings.dev/tools/icon-generator'
    });
  }

  ngAfterViewInit(): void {
    // Set up global mouse event listeners for drag operations (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
      document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this));
    }
  }

  get selectedSizes(): IconSize[] {
    return this.iconSizes.filter(size => size.selected);
  }

  get categorizedSizes() {
    return {
      favicon: this.iconSizes.filter(s => s.category === 'favicon'),
      apple: this.iconSizes.filter(s => s.category === 'apple'),
      android: this.iconSizes.filter(s => s.category === 'android'),
      windows: this.iconSizes.filter(s => s.category === 'windows'),
      custom: this.iconSizes.filter(s => s.category === 'custom'),
    };
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.uploadedImage = e.target?.result as string;
        this.resetCrop();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Interactive crop methods
  onCropMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDraggingCrop = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.cropStartX = this.cropX;
    this.cropStartY = this.cropY;
    
    if (this.cropPreviewContainer) {
      this.previewContainerRect = this.cropPreviewContainer.nativeElement.getBoundingClientRect();
    }
  }

  onResizeHandleMouseDown(event: MouseEvent, handle: 'nw' | 'ne' | 'sw' | 'se'): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizingCrop = true;
    this.resizeHandle = handle;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.cropStartX = this.cropX;
    this.cropStartY = this.cropY;
    this.cropStartSize = this.cropSize;
    
    if (this.cropPreviewContainer) {
      this.previewContainerRect = this.cropPreviewContainer.nativeElement.getBoundingClientRect();
    }
  }

  private onDocumentMouseMove(event: MouseEvent): void {
    if (this.isDraggingCrop) {
      this.handleCropDrag(event);
    } else if (this.isResizingCrop) {
      this.handleCropResize(event);
    }
  }

  private onDocumentMouseUp(event: MouseEvent): void {
    this.isDraggingCrop = false;
    this.isResizingCrop = false;
    this.resizeHandle = null;
    this.previewContainerRect = null;
  }

  private handleCropDrag(event: MouseEvent): void {
    if (!this.originalImage || !this.previewContainerRect) return;

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    // Calculate the image display dimensions and position
    const imageAspect = this.originalImage.width / this.originalImage.height;
    const containerAspect = this.previewContainerRect.width / this.previewContainerRect.height;

    let imageDisplayWidth: number;
    let imageDisplayHeight: number;
    if (imageAspect > containerAspect) {
      imageDisplayWidth = this.previewContainerRect.width;
      imageDisplayHeight = imageDisplayWidth / imageAspect;
    } else {
      imageDisplayHeight = this.previewContainerRect.height;
      imageDisplayWidth = imageDisplayHeight * imageAspect;
    }

    const imageLeft = (this.previewContainerRect.width - imageDisplayWidth) / 2;
    const imageTop = (this.previewContainerRect.height - imageDisplayHeight) / 2;

    const scaleX = imageDisplayWidth / this.originalImage.width;
    const scaleY = imageDisplayHeight / this.originalImage.height;

    // Calculate crop dimensions
    const minDimension = Math.min(this.originalImage.width, this.originalImage.height);
    const cropWidth = (minDimension * this.cropSize) / 100;
    const cropHeight = cropWidth;

    // Calculate position in image coordinates (can go negative or beyond image dimensions)
    // cropX/cropY represent the center position as a percentage of the image dimensions
    // where 0% = left/top edge, 50% = center, 100% = right/bottom edge
    const oldCenterX = (this.originalImage.width * this.cropStartX) / 100;
    const oldCenterY = (this.originalImage.height * this.cropStartY) / 100;
    const oldOverlayLeftPx = imageLeft + (oldCenterX - cropWidth / 2) * scaleX;
    const oldOverlayTopPx = imageTop + (oldCenterY - cropHeight / 2) * scaleY;

    // Calculate new position in pixels (within the container)
    const newOverlayLeftPx = oldOverlayLeftPx + deltaX;
    const newOverlayTopPx = oldOverlayTopPx + deltaY;

    // Convert back to image coordinates (center of crop area)
    const newCenterX = (newOverlayLeftPx - imageLeft) / scaleX + cropWidth / 2;
    const newCenterY = (newOverlayTopPx - imageTop) / scaleY + cropHeight / 2;

    // Convert to percentage (can go negative or above 100%)
    this.cropX = (newCenterX / this.originalImage.width) * 100;
    this.cropY = (newCenterY / this.originalImage.height) * 100;
  }

  private handleCropResize(event: MouseEvent): void {
    if (!this.originalImage || !this.previewContainerRect || !this.resizeHandle) return;

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    let signX = 0;
    let signY = 0;
    switch (this.resizeHandle) {
      case 'se':
        signX = 1;
        signY = 1;
        break;
      case 'sw':
        signX = -1;
        signY = 1;
        break;
      case 'ne':
        signX = 1;
        signY = -1;
        break;
      case 'nw':
        signX = -1;
        signY = -1;
        break;
    }

    const moved = signX * deltaX + signY * deltaY;
    const magnitude = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    const direction = moved >= 0 ? 1 : -1;
    const pixelDelta = direction * magnitude;

    const minContainerDim = Math.min(this.previewContainerRect.width, this.previewContainerRect.height);
    const percentDelta = (pixelDelta / minContainerDim) * 100;

    const imageAspect = this.originalImage.width / this.originalImage.height;
    const containerAspect = this.previewContainerRect.width / this.previewContainerRect.height;

    let imageDisplayWidth: number;
    let imageDisplayHeight: number;
    if (imageAspect > containerAspect) {
      imageDisplayWidth = this.previewContainerRect.width;
      imageDisplayHeight = imageDisplayWidth / imageAspect;
    } else {
      imageDisplayHeight = this.previewContainerRect.height;
      imageDisplayWidth = imageDisplayHeight * imageAspect;
    }

    const sizeRatio = Math.min(imageDisplayWidth, imageDisplayHeight) / minContainerDim;
    const sizeDelta = percentDelta / sizeRatio;

    const newSize = Math.max(10, Math.min(150, this.cropStartSize + sizeDelta));

    const sizeDiff = newSize - this.cropStartSize;

    // In the new coordinate system, cropX/cropY represent the center position.
    // When dragging a corner handle, that handle moves and the opposite corner stays fixed.
    // The center moves by half the size change, in the direction of the handle being dragged.
    // sizeDiff is in terms of percentage of minDimension
    // We need to convert to percentage of image dimensions
    const minDimension = Math.min(this.originalImage.width, this.originalImage.height);
    const sizeChangeInImageSpaceX = (minDimension / this.originalImage.width) * sizeDiff / 2;
    const sizeChangeInImageSpaceY = (minDimension / this.originalImage.height) * sizeDiff / 2;

    let posXDelta = 0;
    let posYDelta = 0;

    switch (this.resizeHandle) {
      case 'nw':
        // Dragging NW (top-left), SE corner fixed, center moves NW as size increases
        posXDelta = -sizeChangeInImageSpaceX;
        posYDelta = -sizeChangeInImageSpaceY;
        break;
      case 'ne':
        // Dragging NE (top-right), SW corner fixed, center moves NE as size increases
        posXDelta = sizeChangeInImageSpaceX;
        posYDelta = -sizeChangeInImageSpaceY;
        break;
      case 'sw':
        // Dragging SW (bottom-left), NE corner fixed, center moves SW as size increases
        posXDelta = -sizeChangeInImageSpaceX;
        posYDelta = sizeChangeInImageSpaceY;
        break;
      case 'se':
        // Dragging SE (bottom-right), NW corner fixed, center moves SE as size increases
        posXDelta = sizeChangeInImageSpaceX;
        posYDelta = sizeChangeInImageSpaceY;
        break;
    }

    this.cropSize = newSize;
    this.cropX = this.cropStartX + posXDelta;
    this.cropY = this.cropStartY + posYDelta;
  }


  selectAll(category?: string): void {
    if (category) {
      this.iconSizes
        .filter(size => size.category === category)
        .forEach(size => size.selected = true);
    } else {
      this.iconSizes.forEach(size => size.selected = true);
    }
  }

  deselectAll(category?: string): void {
    if (category) {
      this.iconSizes
        .filter(size => size.category === category)
        .forEach(size => size.selected = false);
    } else {
      this.iconSizes.forEach(size => size.selected = false);
    }
  }

  private resizeImage(size: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill with transparent background
    ctx.clearRect(0, 0, size, size);

    if (this.originalImage) {
      // Get the smaller dimension of the original image
      const minDimension = Math.min(this.originalImage.width, this.originalImage.height);

      // Calculate crop size based on percentage
      let cropWidth = (minDimension * this.cropSize) / 100;
      let cropHeight = cropWidth; // Always square

      // cropX/cropY represent the center position as a percentage of image dimensions
      const centerX = (this.originalImage.width * this.cropX) / 100;
      const centerY = (this.originalImage.height * this.cropY) / 100;

      // Adjust for border width: The visual border is 3px thick, and users perceive
      // the inner edge as the crop boundary. We need to account for the border on
      // the visual overlay by making the actual crop smaller.
      // Calculate the border size in source image pixels
      const containerRect = this.cropPreviewContainer?.nativeElement.getBoundingClientRect();
      if (containerRect) {
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Calculate scale factor
        const imageAspect = this.originalImage.width / this.originalImage.height;
        const containerAspect = containerWidth / containerHeight;
        let imageDisplayWidth: number;
        let imageDisplayHeight: number;
        if (imageAspect > containerAspect) {
          imageDisplayWidth = containerWidth;
          imageDisplayHeight = containerWidth / imageAspect;
        } else {
          imageDisplayHeight = containerHeight;
          imageDisplayWidth = containerHeight * imageAspect;
        }
        const scale = imageDisplayWidth / this.originalImage.width;

        // Overcorrect significantly to ensure crop extends beyond visual boundary
        // This prevents any edge clipping
        const borderAdjustment = (85 / scale); // Adding 35px (17.5px per side) to overcorrect
        cropWidth = cropWidth + borderAdjustment;
        cropHeight = cropWidth;
      }

      // Calculate actual crop position (top-left corner, can be negative or beyond image bounds)
      const sourceX = centerX - cropWidth / 2;
      const sourceY = centerY - cropHeight / 2;

      // Calculate the intersection between the crop area and the actual image
      const cropLeft = sourceX;
      const cropTop = sourceY;
      const cropRight = sourceX + cropWidth;
      const cropBottom = sourceY + cropHeight;

      const imageLeft = 0;
      const imageTop = 0;
      const imageRight = this.originalImage.width;
      const imageBottom = this.originalImage.height;

      // Find the overlapping region
      const overlapLeft = Math.max(cropLeft, imageLeft);
      const overlapTop = Math.max(cropTop, imageTop);
      const overlapRight = Math.min(cropRight, imageRight);
      const overlapBottom = Math.min(cropBottom, imageBottom);

      // If there's an overlap, draw it
      if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;

        // Calculate where this overlap should be drawn on the canvas
        const destX = ((overlapLeft - cropLeft) / cropWidth) * size;
        const destY = ((overlapTop - cropTop) / cropHeight) * size;
        const destWidth = (overlapWidth / cropWidth) * size;
        const destHeight = (overlapHeight / cropHeight) * size;

        ctx.drawImage(
          this.originalImage,
          overlapLeft, overlapTop, overlapWidth, overlapHeight,
          destX, destY, destWidth, destHeight
        );
      }
    }

    return canvas;
  }

  downloadPNG(size: number, name: string): void {
    if (!this.originalImage) return;

    const canvas = this.resizeImage(size);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }

  async downloadAllPNG(): Promise<void> {
    if (!this.originalImage) return;

    const selectedIcons = this.selectedSizes;

    // If only one icon, download directly without ZIP
    if (selectedIcons.length === 1) {
      this.downloadPNG(selectedIcons[0].size, selectedIcons[0].name);
      return;
    }

    // Multiple icons: create ZIP
    const zip = new JSZip();

    // Generate all icons and add to ZIP
    for (const iconSize of selectedIcons) {
      const canvas = this.resizeImage(iconSize.size);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (blob) {
        const filename = `${iconSize.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        zip.file(filename, blob);
      }
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'icons.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  async downloadICO(): Promise<void> {
    if (!this.originalImage) return;

    // ICO files can contain multiple sizes
    // We'll include the most common favicon sizes: 16, 32, 48
    const icoSizes = [16, 32, 48];
    const zip = new JSZip();

    // Generate all favicon sizes and add to ZIP
    for (const size of icoSizes) {
      const canvas = this.resizeImage(size);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (blob) {
        zip.file(`favicon-${size}x${size}.png`, blob);
      }
    }

    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicons.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  getPreviewUrl(size: number): string {
    if (!this.originalImage) return '';
    const canvas = this.resizeImage(size);
    return canvas.toDataURL('image/png');
  }

  clearImage(): void {
    this.uploadedImage = null;
    this.originalImage = null;
    this.resetCrop();
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement?.click();
  }

  resetCrop(): void {
    this.cropX = 50; // Center horizontally
    this.cropY = 50; // Center vertically
    this.cropSize = 80;
  }

  centerCrop(): void {
    if (!this.originalImage) return;
    
    // Always center the crop
    this.cropX = 50;
    this.cropY = 50;
  }

  getCropOverlayStyle(): any {
  if (!this.originalImage || !this.cropPreviewContainer) return {};

  const containerRect = this.cropPreviewContainer.nativeElement.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  if (!containerWidth || !containerHeight) return {};

  const minDimension = Math.min(this.originalImage.width, this.originalImage.height);
  const cropWidth = (minDimension * this.cropSize) / 100;
  const cropHeight = cropWidth;

  // cropX/cropY now represent the center position as a percentage of image dimensions
  // where 0% = left/top edge, 50% = center, 100% = right/bottom edge
  const centerX = (this.originalImage.width * this.cropX) / 100;
  const centerY = (this.originalImage.height * this.cropY) / 100;

  const sourceX = centerX - cropWidth / 2;
  const sourceY = centerY - cropHeight / 2;

  const imageAspect = this.originalImage.width / this.originalImage.height;
  const containerAspect = containerWidth / containerHeight;

  let imageDisplayWidth: number;
  let imageDisplayHeight: number;
  if (imageAspect > containerAspect) {
    imageDisplayWidth = containerWidth;
    imageDisplayHeight = containerWidth / imageAspect;
  } else {
    imageDisplayHeight = containerHeight;
    imageDisplayWidth = containerHeight * imageAspect;
  }

  const imageLeft = (containerWidth - imageDisplayWidth) / 2;
  const imageTop = (containerHeight - imageDisplayHeight) / 2;

  const scaleX = imageDisplayWidth / this.originalImage.width;
  const scaleY = imageDisplayHeight / this.originalImage.height;

  const overlayWidthPx = cropWidth * scaleX;
  const overlayHeightPx = cropHeight * scaleY;
  const overlayLeftPx = imageLeft + sourceX * scaleX;
  const overlayTopPx = imageTop + sourceY * scaleY;

  const leftPercent = (overlayLeftPx / containerWidth) * 100;
  const topPercent = (overlayTopPx / containerHeight) * 100;
  const widthPercent = (overlayWidthPx / containerWidth) * 100;
  const heightPercent = (overlayHeightPx / containerHeight) * 100;

  return {
    left: leftPercent + '%',
    top: topPercent + '%',
    width: widthPercent + '%',
    height: heightPercent + '%'
  };
}


}