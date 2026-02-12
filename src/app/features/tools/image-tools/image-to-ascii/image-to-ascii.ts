import { Component, inject, OnInit, ViewChild, ElementRef, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { ImageToAsciiService, ConversionOptions, CharacterSetOption } from './image-to-ascii.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';

@Component({
  selector: 'app-image-to-ascii',
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
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent,
    RelatedBlogPosts
  ],
  templateUrl: './image-to-ascii.html',
  styleUrl: './image-to-ascii.scss',
  host: {
    ngSkipHydration: 'true'
  }
})
export class ImageToAscii implements OnInit {
  private asciiService = inject(ImageToAsciiService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  relatedBlogPosts = [
    {
      title: 'Photo Filter Studio',
      slug: '/tools/photo-filter-studio'
    }
  ];

  // Character sets
  characterSets: CharacterSetOption[] = this.asciiService.getCharacterSets();

  // Core state
  uploadedImageName = signal<string>('');
  sourceImage = signal<HTMLImageElement | null>(null);
  asciiOutput = signal<string>('');
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  isProcessing = signal<boolean>(false);

  // Conversion options
  asciiWidth = signal<number>(100);
  selectedCharSet = signal<string>('standard');
  inverted = signal<boolean>(false);
  fontSize = signal<number>(10);
  preserveAspectRatio = signal<boolean>(true);

  // UI state
  isDragging = signal<boolean>(false);
  viewMode = signal<'preview' | 'text'>('preview');

  // Debounce timer for real-time conversion
  private debounceTimer: any = null;

  ngOnInit(): void {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Image to ASCII Converter - Free Online Tool',
      description: 'Convert images to ASCII art with customizable character sets. Upload any image and transform it into retro text art. Free, fast, and works entirely in your browser.',
      keywords: ['image to ascii', 'ascii art', 'ascii converter', 'text art', 'ascii generator', 'image converter'],
      image: 'https://www.allthethings.dev/meta-images/og-image-to-ascii.png',
      url: 'https://www.allthethings.dev/tools/image-to-ascii',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Image to ASCII Converter',
        description: 'Convert images to ASCII art with customizable character sets. Upload any image and transform it into retro text art.',
        url: 'https://www.allthethings.dev/tools/image-to-ascii',
        image: 'https://www.allthethings.dev/meta-images/og-image-to-ascii.png'
      })
    });
  }

  // File upload handlers
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

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  // Image loading
  private async loadImage(file: File): Promise<void> {
    this.errorMessage.set('');

    // Validate file
    const validation = this.asciiService.validateFile(file);
    if (!validation.valid) {
      this.errorMessage.set(validation.error || 'Invalid file');
      this.snackbar.show(validation.error || 'Invalid file', 'error', 3000);
      return;
    }

    // Show warning for large files
    if (file.size > 5 * 1024 * 1024) {
      this.snackbar.show(`Large file (${(file.size / 1024 / 1024).toFixed(1)}MB). Processing may take a moment.`, 'info', 4000);
    }

    this.isLoading.set(true);
    this.uploadedImageName.set(file.name);

    try {
      const img = await this.asciiService.loadImage(file);
      this.sourceImage.set(img);

      // Automatically convert on upload
      await this.convertImage();

      this.snackbar.show('Image loaded successfully!', 'success', 2000);
    } catch (error) {
      this.errorMessage.set('Failed to load image. Please try a different file.');
      this.snackbar.show('Failed to load image', 'error', 3000);
      this.uploadedImageName.set('');
      this.sourceImage.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  // ASCII conversion
  async convertImage(): Promise<void> {
    const image = this.sourceImage();
    if (!image || !isPlatformBrowser(this.platformId)) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      // Get selected character set
      const charSetOption = this.characterSets.find(cs => cs.id === this.selectedCharSet());
      const charSet = charSetOption?.chars || this.characterSets[0].chars;

      const options: ConversionOptions = {
        width: this.asciiWidth(),
        charSet: charSet,
        inverted: this.inverted(),
        preserveAspectRatio: this.preserveAspectRatio()
      };

      const ascii = await this.asciiService.convertToAscii(image, options);
      this.asciiOutput.set(ascii);
    } catch (error) {
      this.errorMessage.set('Failed to convert image. Please try again.');
      this.snackbar.show('Conversion failed', 'error', 3000);
    } finally {
      this.isProcessing.set(false);
    }
  }

  // Debounced conversion for real-time updates
  updateConversion(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.convertImage();
    }, 300);
  }

  // Option change handlers
  onWidthChange(): void {
    this.updateConversion();
  }

  onCharSetChange(): void {
    this.convertImage();
  }

  onInvertedChange(): void {
    this.convertImage();
  }

  onFontSizeChange(): void {
    // Font size doesn't require re-conversion, just visual update
  }

  // Output actions
  async copyToClipboard(): Promise<void> {
    const ascii = this.asciiOutput();
    if (!ascii) return;

    try {
      await navigator.clipboard.writeText(ascii);
      this.snackbar.show('Copied to clipboard!', 'success', 2000);
    } catch (error) {
      this.snackbar.show('Failed to copy', 'error', 2000);
    }
  }

  downloadAscii(): void {
    const ascii = this.asciiOutput();
    if (!ascii) return;

    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const filename = this.asciiService.getTimestampFilename();
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.snackbar.show('Downloaded as text file!', 'success', 2000);
  }

  changeImage(): void {
    this.openFilePicker();
  }

  resetAll(): void {
    this.sourceImage.set(null);
    this.asciiOutput.set('');
    this.uploadedImageName.set('');
    this.errorMessage.set('');
    this.asciiWidth.set(100);
    this.selectedCharSet.set('standard');
    this.inverted.set(false);
    this.fontSize.set(10);
    this.preserveAspectRatio.set(true);
    this.viewMode.set('preview');

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  scrollToConverter(): void {
    const element = document.querySelector('.upload-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Getters for template
  get selectedCharSetName(): string {
    return this.characterSets.find(cs => cs.id === this.selectedCharSet())?.name || 'Standard';
  }

  get hasImage(): boolean {
    return this.sourceImage() !== null;
  }

  get hasOutput(): boolean {
    return this.asciiOutput().length > 0;
  }
}
