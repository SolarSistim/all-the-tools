import { Component, OnInit, OnDestroy, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { OnRewardStorageService, ScannedRewardCode } from '../services/on-reward-storage.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { RelatedBlogPosts } from '../../../reusable-components/related-blog-posts/related-blog-posts';

type ScannerState = 'idle' | 'selectRegion' | 'processing' | 'scanResult' | 'error';

@Component({
  selector: 'app-on-reward-scanner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent,
    RelatedBlogPosts
  ],
  templateUrl: './on-reward-scanner.html',
  styleUrl: './on-reward-scanner.scss',
})
export class OnRewardScanner implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('scannerSection') scannerSection!: ElementRef<HTMLDivElement>;

  @ViewChild('capturedImg') capturedImg!: ElementRef<HTMLImageElement>;

private displayedImageRect: DOMRect | null = null;
private capturedNaturalWidth = 0;
private capturedNaturalHeight = 0;
private pendingCropInit = false;

  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private storageService = inject(OnRewardStorageService);

  relatedBlogPosts = [
    {
      title: 'How to Scan Reward Codes: Stop Typing Tiny Codes by Hand',
      slug: 'stop-typing-in-those-tiny-on-reward-codes-by-hand'
    }
  ];

  // State management
  state = signal<ScannerState>('idle');
  scannedCodes = signal<ScannedRewardCode[]>([]);
  currentScan = signal<{ code: string } | null>(null);
  editedCode = signal<string>('');
  isEditingCode = signal<boolean>(false);
  get editedCodeValue(): string {
    return this.editedCode();
  }

  set editedCodeValue(v: string) {
    this.editedCode.set(v.toUpperCase());
  }
  scannedRegionImage = signal<string | null>(null);
  manualInput = signal<string>('');
  errorMessage = signal<string>('');
  processingProgress = signal<number>(0);

  // Crop region selection
  capturedImage = signal<string | null>(null);
  cropRegion = signal<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 420, height: 140 });

  cropSizeLevels = [1, 2, 3, 4, 5];
cropSizeLevel = signal<number>(3);

private cropAspectRatio = 4.5;
private cropBaseWidthFraction = 0.50;
private cropSizeScale = [0.7, 0.85, 1, 1.15, 1.3];
  isDragging = signal<boolean>(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private initialCropX = 0;
  private initialCropY = 0;

  // Tesseract worker and module
  private worker: any = null;
  private tesseractModule: any = null;
  private createWorker: any = null;
  private PSM: any = null;

  displayedColumns: string[] = ['code', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.logEnvironmentInfo();
    this.updateMetaTags();
    this.loadScannedCodes();
    this.initializeScanner();
  }

  private logEnvironmentInfo(): void {
  }

  ngOnDestroy(): void {
    // Cleanup Tesseract worker to prevent memory leaks
    if (this.worker) {
      this.worker.terminate();
      console.log('🛑 [CLEANUP] Tesseract worker terminated');
    }
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'On! Reward Code Scanner - Scan Nicotine Reward Codes',
      description: 'Free online On! Nicotine reward code scanner. Scan product packaging with OCR to extract XXXXX-XXXX-XXXX codes. Store and manage codes locally with bulk export options.',
      keywords: ['on nicotine scanner', 'reward code scanner', 'ocr scanner', 'nicotine rewards', 'code reader', 'on rewards'],
      image: 'https://www.allthethings.dev/meta-images/og-on-reward-scanner.png',
      url: 'https://www.allthethings.dev/tools/on-reward-scanner',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'On! Reward Code Scanner - Scan Nicotine Reward Codes',
        description: 'Free online On! Nicotine reward code scanner. Scan product packaging with OCR to extract XXXXX-XXXX-XXXX codes. Store and manage codes locally with bulk export options.',
        url: 'https://www.allthethings.dev/tools/on-reward-scanner',
        image: 'https://www.allthethings.dev/meta-images/og-on-reward-scanner.png'
      })
    });
  }

  private loadScannedCodes(): void {
    const scans = this.storageService.loadScans();
    this.scannedCodes.set(scans);
  }

  private async initializeScanner(): Promise<void> {
    // Only initialize in browser environment
    if (typeof window === 'undefined') {
      console.log('⚠️ [INIT] Skipping initialization (SSR environment)');
      return;
    }

    console.log('🔧 [INIT] Initializing OCR scanner...');
    try {
      // Dynamically import Tesseract.js only in browser
      if (!this.tesseractModule) {
        console.log('📦 [INIT] Loading Tesseract.js...');
        this.tesseractModule = await import('tesseract.js');
        this.createWorker = this.tesseractModule.createWorker ?? this.tesseractModule.default?.createWorker;
        this.PSM = this.tesseractModule.PSM ?? this.tesseractModule.default?.PSM;

        if (!this.createWorker || !this.PSM) {
          throw new Error('Tesseract.js module missing createWorker/PSM exports');
        }
        console.log('✅ [INIT] Tesseract.js loaded');
      }

      this.worker = await this.createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            this.processingProgress.set(Math.round(m.progress * 100));
          }
        },
      });

      // Configure for better accuracy with alphanumeric codes
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
        tessedit_pageseg_mode: this.PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '0',
      });

      console.log('✅ [INIT] Tesseract worker initialized');
      console.log('✅ [INIT] Scanner initialization complete');

    } catch (error) {
      console.error('❌ [INIT] Error initializing scanner:', error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      this.errorMessage.set(`Failed to initialize OCR scanner: ${errorDetails}`);
      this.state.set('error');
    }
  }

  /**
   * Extract reward code from OCR text
   */
  private extractRewardCode(rawText: string): string | null {
  console.log('🔍 [EXTRACT] Raw OCR text:', rawText);

  const lines = rawText
    .toUpperCase()
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const hyphenPattern = /[A-Z0-9]{5}-[A-Z0-9]{4}-[A-Z0-9]{4}/g;

  for (const line of lines) {
    const m = line.match(hyphenPattern);
    if (m && m[0] && /\d/.test(m[0])) {
      console.log('✅ [EXTRACT] Found code with hyphens:', m[0]);
      return m[0];
    }
  }

  for (const line of lines) {
    const normalized = line.replace(/[^A-Z0-9]/g, '');
    const runs = normalized.match(/[A-Z0-9]{13}/g);
    if (!runs || runs.length === 0) continue;

    for (const run of runs) {
      if (!/\d/.test(run)) continue;
      const formatted = `${run.slice(0, 5)}-${run.slice(5, 9)}-${run.slice(9, 13)}`;
      console.log('✅ [EXTRACT] Found continuous code, formatted:', formatted);
      return formatted;
    }
  }

  console.log('❌ [EXTRACT] No valid code pattern found');
  return null;
}




  /**
   * Validate reward code format
   */
  private isValidRewardCode(code: string): boolean {
    const regex = /^[A-Z0-9]{5}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(code);
  }

  /**
   * Preprocess image for better OCR accuracy
   * Converts to grayscale, increases contrast, and sharpens
   */
  private preprocessImage(imageElement: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set canvas size to match image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw original image
    ctx.drawImage(imageElement, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      // Calculate grayscale using luminosity method
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Increase contrast (multiply by factor, then clamp)
      const contrast = 1.5;
      const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
      const enhanced = factor * (gray - 128) + 128;
      const clamped = Math.max(0, Math.min(255, enhanced));

      // Apply to all RGB channels
      data[i] = clamped;
      data[i + 1] = clamped;
      data[i + 2] = clamped;
    }

    // Put processed image back
    ctx.putImageData(imageData, 0, 0);

    // Return as data URL
    return canvas.toDataURL('image/png');
  }

  /**
   * Try OCR with multiple PSM modes for better accuracy
   */
  private async tryMultiplePSMModes(imageUrl: string): Promise<string | null> {
    if (!this.PSM || !this.worker) {
      console.error('❌ [OCR] Tesseract not initialized');
      return null;
    }

    const psmModes = [
      this.PSM.SINGLE_BLOCK,
      this.PSM.SINGLE_LINE,
      this.PSM.SPARSE_TEXT,
    ];

    let bestResult: { code: string; confidence: number } | null = null;

    for (const psmMode of psmModes) {
      try {
        console.log(`🔄 [OCR] Trying PSM mode: ${psmMode}`);
        await this.worker.setParameters({
          tessedit_pageseg_mode: psmMode,
        });

        const result = await this.worker.recognize(imageUrl);
        const code = this.extractRewardCode(result.data.text);

        if (code) {
          const confidence = result.data.confidence;
          console.log(`✅ [OCR] Found code with confidence ${confidence.toFixed(1)}%: ${code}`);

          if (!bestResult || confidence > bestResult.confidence) {
            bestResult = { code, confidence };
          }
        }
      } catch (error) {
        console.warn(`⚠️ [OCR] PSM mode ${psmMode} failed:`, error);
      }
    }

    // Reset to default PSM mode
    await this.worker.setParameters({
      tessedit_pageseg_mode: this.PSM.SINGLE_BLOCK,
    });

    return bestResult?.code || null;
  }

  approveScan(): void {
    console.log('✅ [APPROVE] User approved scan');
    const scan = this.currentScan();
    if (!scan) {
      console.warn('⚠️ [APPROVE] No scan to approve');
      return;
    }

    console.log('💾 [APPROVE] Saving scan:', scan);
    const codeToSave = this.editedCode().trim().toUpperCase();
    const saved = this.storageService.saveScan(codeToSave);

    if (saved) {
      this.snackbar.success('Reward code saved!', 2000);
      this.loadScannedCodes();
      console.log('✅ [APPROVE] Scan saved successfully');
    } else {
      this.snackbar.warning('Already saved', 2000);
      console.log('⚠️ [APPROVE] Scan already exists');
    }

    // Return to idle state
    this.currentScan.set(null);
    this.editedCode.set('');
    this.isEditingCode.set(false);
    this.state.set('idle');
    console.log('🔄 [APPROVE] Returned to idle state');
  }

  retryScan(): void {
    console.log('🔄 [RETRY] User requested retry');
    this.currentScan.set(null);
    this.editedCode.set('');
    this.isEditingCode.set(false);
    this.state.set('idle');
    this.processingProgress.set(0);
    console.log('✅ [RETRY] Returned to idle state');
    // Automatically open camera again for retry
    setTimeout(() => this.openNativeCamera(), 100);
  }

  enableCodeEditing(): void {
    console.log('✏️ [EDIT] Enabling code editing mode');
    this.isEditingCode.set(true);
  }

  confirmCodeEdit(): void {
    console.log('✅ [EDIT] Code edit confirmed');
    const edited = this.editedCode().trim().toUpperCase();

    // Validate format
    if (!this.isValidRewardCode(edited)) {
      this.snackbar.error('Invalid format. Use XXXXX-XXXX-XXXX', 3000);
      return;
    }

    this.editedCode.set(edited);
    this.isEditingCode.set(false);
    console.log('✅ [EDIT] Updated code:', edited);
  }

  addManualCode(): void {
    const code = this.manualInput().trim().toUpperCase();
    if (!code) {
      this.snackbar.warning('Please enter a reward code', 2000);
      return;
    }

    // Validate format
    if (!this.isValidRewardCode(code)) {
      this.snackbar.error('Invalid format. Use XXXXX-XXXX-XXXX', 3000);
      return;
    }

    const saved = this.storageService.saveScan(code);

    if (saved) {
      this.snackbar.success('Reward code added!', 2000);
      this.manualInput.set('');
      this.loadScannedCodes();
    } else {
      this.snackbar.warning('Code already exists', 2000);
    }
  }

  async copyCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.snackbar.success('Copied to clipboard!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  async copyAllCodes(): Promise<void> {
    const text = this.storageService.getAllCodesAsText();
    if (!text) {
      this.snackbar.warning('No codes to copy', 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.success('All codes copied!', 2000);
    } catch (error) {
      this.snackbar.error('Failed to copy', 2000);
    }
  }

  downloadCodes(): void {
    const text = this.storageService.getAllCodesAsText();
    if (!text) {
      this.snackbar.warning('No codes to download', 2000);
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const date = new Date().toISOString().split('T')[0];
    link.download = `on-reward-codes-${date}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.snackbar.success('Downloaded!', 2000);
  }

  clearAllCodes(): void {
    if (this.scannedCodes().length === 0) {
      return;
    }

    const confirmed = confirm('Are you sure you want to clear all scanned reward codes? This cannot be undone.');
    if (confirmed) {
      this.storageService.clearAll();
      this.loadScannedCodes();
      this.snackbar.success('All codes cleared', 2000);
    }
  }

  deleteCode(code: string): void {
    this.storageService.deleteScan(code);
    this.loadScannedCodes();
    this.snackbar.success('Code deleted', 2000);
  }

  formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }

  retryCamera(): void {
    this.errorMessage.set('');
    this.state.set('idle');
    this.initializeScanner();
  }

  /**
   * Scrolls to the scanner section
   */
  scrollToScanner(): void {
    console.log('📍 [SCROLL] Scrolling to scanner section');
    if (this.scannerSection?.nativeElement) {
      this.scannerSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Opens native camera to capture a photo for scanning
   */
  openNativeCamera(): void {
    console.log('📸 [NATIVE] Opening native camera...');
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * Handles photo file selection from native camera or file picker
   */
  async handlePhotoCapture(event: Event): Promise<void> {
    console.log('📷 [NATIVE] Photo capture event triggered');
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('⚠️ [NATIVE] No file selected');
      return;
    }

    const file = input.files[0];
    console.log('📄 [NATIVE] File selected:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    });

    try {
      console.log('🔄 [NATIVE] Converting file to image...');
      const imageUrl = URL.createObjectURL(file);

      // Load image into HTMLImageElement
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log(`📐 [NATIVE] Image loaded: ${img.width}x${img.height}`);
          resolve();
        };
        img.onerror = () => {
          console.error('❌ [NATIVE] Failed to load image');
          reject(new Error('Failed to load image'));
        };
        img.src = imageUrl;
      });

      // Store the captured image
      this.capturedImage.set(imageUrl);

      // Initialize crop region in the center of the image
this.pendingCropInit = true;

      // Show region selection UI
      this.state.set('selectRegion');
      console.log('📍 [SELECT] Region selection mode activated');

    } catch (error) {
      console.error('❌ [OCR] Failed to scan photo:', error);
      this.errorMessage.set('No reward code found in photo. Please ensure the code is clearly visible and in good lighting.');
      this.state.set('error');
    } finally {
      // Reset the input so the same file can be selected again
      input.value = '';
      this.processingProgress.set(0);
    }
  }

private getDisplayedImageBox(): { x: number; y: number; width: number; height: number } | null {
  if (!this.capturedNaturalWidth || !this.capturedNaturalHeight) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const imgAR = this.capturedNaturalWidth / this.capturedNaturalHeight;
  const viewAR = vw / vh;

  let width = 0;
  let height = 0;
  let x = 0;
  let y = 0;

  if (viewAR > imgAR) {
    height = vh;
    width = vh * imgAR;
    x = (vw - width) / 2;
    y = 0;
  } else {
    width = vw;
    height = vw / imgAR;
    x = 0;
    y = (vh - height) / 2;
  }

  return { x, y, width, height };
}

onCapturedImageLoad(): void {
  const el = this.capturedImg?.nativeElement;
  if (!el) return;

  this.displayedImageRect = el.getBoundingClientRect();
  this.capturedNaturalWidth = el.naturalWidth || el.width;
  this.capturedNaturalHeight = el.naturalHeight || el.height;

  const rect = this.displayedImageRect;

  const desiredW = Math.min(300, Math.max(160, rect.width * 0.6));
  const desiredH = Math.min(120, Math.max(80, rect.height * 0.15));

  const x = rect.left + (rect.width - desiredW) / 2;
  const y = rect.top + (rect.height - desiredH) / 2;

  this.cropRegion.set({ x, y, width: desiredW, height: desiredH });
}

setCropSize(level: number): void {
  if (!this.displayedImageRect) return;
  if (level < 1 || level > 5) return;

  this.cropSizeLevel.set(level);
  this.applyCropSize(level, false);
}

private applyCropSize(level: number, centerInImage: boolean): void {
  if (!this.displayedImageRect) return;

  const imgW = this.displayedImageRect.width;
  const imgH = this.displayedImageRect.height;

  const baseW = imgW * this.cropBaseWidthFraction;
  const scale = this.cropSizeScale[level - 1] ?? 1;
  let w = baseW * scale;
  let h = (w / this.cropAspectRatio) * 1.2;

  const maxW = imgW * 0.95;
  const maxH = imgH * 0.5;

  if (w > maxW) {
    w = maxW;
    h = w / this.cropAspectRatio;
  }
  if (h > maxH) {
    h = maxH;
    w = h * this.cropAspectRatio;
  }

  const current = this.cropRegion();
  const cx = centerInImage ? imgW / 2 : current.x + current.width / 2;
  const cy = centerInImage ? imgH / 2 : current.y + current.height / 2;

  let x = cx - w / 2;
  let y = cy - h / 2;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + w > imgW) x = imgW - w;
  if (y + h > imgH) y = imgH - h;

  this.cropRegion.set({ x, y, width: w, height: h });
}


  /**
   * Start dragging the crop region
   */
  startDrag(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.isDragging.set(true);
    this.dragStartX = clientX;
    this.dragStartY = clientY;
    this.initialCropX = this.cropRegion().x;
    this.initialCropY = this.cropRegion().y;

    console.log('🖱️ [DRAG] Started dragging crop region');
  }

  /**
   * Handle dragging the crop region
   */
  onDrag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;

    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - this.dragStartX;
    const deltaY = clientY - this.dragStartY;

    const rect = this.displayedImageRect;
let newX = this.initialCropX + deltaX;
let newY = this.initialCropY + deltaY;

if (rect) {
  const minX = rect.left;
  const minY = rect.top;
  const maxX = rect.right - this.cropRegion().width;
  const maxY = rect.bottom - this.cropRegion().height;

  newX = Math.max(minX, Math.min(maxX, newX));
  newY = Math.max(minY, Math.min(maxY, newY));
}

this.cropRegion.update(region => ({
  ...region,
  x: newX,
  y: newY
}));

    // Update crop region (bounds will be checked when cropping)
const box = this.getDisplayedImageBox();
if (!box) return;

const region = this.cropRegion();
const minX = box.x;
const minY = box.y;
const maxX = box.x + box.width - region.width;
const maxY = box.y + box.height - region.height;

const clampedX = Math.max(minX, Math.min(newX, maxX));
const clampedY = Math.max(minY, Math.min(newY, maxY));

this.cropRegion.update(r => ({
  ...r,
  x: clampedX,
  y: clampedY
}));

  }

  /**
   * Stop dragging the crop region
   */
  stopDrag(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
      console.log('🖱️ [DRAG] Stopped dragging crop region');
    }
  }

  /**
   * Cancel region selection and return to idle
   */
  cancelCrop(): void {
    console.log('❌ [CROP] User cancelled crop selection');
    if (this.capturedImage()) {
      URL.revokeObjectURL(this.capturedImage()!);
    }
    this.capturedImage.set(null);
    this.scannedRegionImage.set(null);
    this.state.set('idle');
  }

  /**
   * Confirm crop selection and process the selected region
   */
  async confirmCrop(): Promise<void> {
    console.log('✅ [CROP] User confirmed crop selection');

    if (!this.capturedImage()) {
      console.error('❌ [CROP] No captured image available');
      return;
    }

    try {
      // Show processing state
      this.state.set('processing');
      this.processingProgress.set(0);

      // Load the captured image
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load captured image'));
        img.src = this.capturedImage()!;
      });

      // Crop the image to the selected region
      console.log('✂️ [CROP] Cropping image to selected region...');
      const rect = this.displayedImageRect;
const region = this.cropRegion();

let scaledRegion = region;

if (rect && this.capturedNaturalWidth && this.capturedNaturalHeight) {
  const scaleX = this.capturedNaturalWidth / rect.width;
  const scaleY = this.capturedNaturalHeight / rect.height;

  scaledRegion = {
    x: (region.x - rect.left) * scaleX,
    y: (region.y - rect.top) * scaleY,
    width: region.width * scaleX,
    height: region.height * scaleY
  };
}

const boundsW = this.capturedNaturalWidth || img.width;
const boundsH = this.capturedNaturalHeight || img.height;

const paddedRegion = this.padRegion(scaledRegion, boundsW, boundsH);
const padded = this.padCropRegionForOcr(scaledRegion);
const croppedImageUrl = this.cropImage(img, this.cropRegion());
this.scannedRegionImage.set(croppedImageUrl);


      // Preprocess cropped image for better OCR accuracy
      const croppedImg = new Image();
      await new Promise<void>((resolve, reject) => {
        croppedImg.onload = () => resolve();
        croppedImg.onerror = () => reject(new Error('Failed to load cropped image'));
        croppedImg.src = croppedImageUrl;
      });

      console.log('🎨 [PREPROCESS] Enhancing cropped image...');
      const processedImageUrl = this.preprocessImage(croppedImg);

      console.log('🔎 [OCR] Running OCR on cropped region...');
      const scanStartTime = performance.now();

      if (!this.worker) {
        throw new Error('OCR worker not initialized');
      }

      // Try multiple PSM modes for better accuracy
      const code = await this.tryMultiplePSMModes(processedImageUrl);
      const scanTime = performance.now() - scanStartTime;

      console.log(`✅ [OCR] OCR completed in ${scanTime.toFixed(2)}ms`);

      if (code) {
        console.log('✅ [OCR] Reward code extracted:', code);

        // Show the result
        this.currentScan.set({ code });
        this.editedCode.set(code);
        this.state.set('scanResult');

        // Vibrate for feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
          console.log('📳 [NATIVE] Vibration triggered');
        }
      } else {
        throw new Error('No valid reward code found in selected region');
      }

      // Cleanup
      URL.revokeObjectURL(this.capturedImage()!);
      this.capturedImage.set(null);

    } catch (error) {
      console.error('❌ [OCR] Failed to process cropped region:', error);
      this.errorMessage.set('No reward code found in the selected area. Please try selecting the code area more precisely.');
      this.state.set('error');

      if (this.capturedImage()) {
        URL.revokeObjectURL(this.capturedImage()!);
        this.capturedImage.set(null);
      }
    } finally {
      this.processingProgress.set(0);
    }
  }

  private padRegion(
  region: { x: number; y: number; width: number; height: number },
  boundsWidth: number,
  boundsHeight: number
): { x: number; y: number; width: number; height: number } {
  const padX = region.width * 0.12;
  const padY = region.height * 0.35;

  const x = Math.max(0, region.x - padX);
  const y = Math.max(0, region.y - padY);

  const width = Math.min(boundsWidth - x, region.width + padX * 2);
  const height = Math.min(boundsHeight - y, region.height + padY * 2);

  return { x, y, width, height };
}

private padCropRegionForOcr(region: { x: number; y: number; width: number; height: number }): { x: number; y: number; width: number; height: number } {
  const padX = region.width * 0.12;
  const padY = region.height * 0.9;

  const x = Math.max(0, region.x - padX);
  const y = Math.max(0, region.y - padY);

  const width = region.width + padX * 2;
  const height = region.height + padY * 2;

  return { x, y, width, height };
}


  /**
   * Crop an image to a specific region
   */
private cropImage(img: HTMLImageElement, region: { x: number; y: number; width: number; height: number }): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let x = region.x;
  let y = region.y;
  let width = region.width;
  let height = region.height;

  if (this.displayedImageRect && this.capturedNaturalWidth && this.capturedNaturalHeight) {
    const scaleX = this.capturedNaturalWidth / this.displayedImageRect.width;
    const scaleY = this.capturedNaturalHeight / this.displayedImageRect.height;

    x = region.x * scaleX;
    y = region.y * scaleY;
    width = region.width * scaleX;
    height = region.height * scaleY;
  }

  const sx = Math.max(0, Math.min(x, img.width - width));
  const sy = Math.max(0, Math.min(y, img.height - height));
  const sw = Math.min(width, img.width - sx);
  const sh = Math.min(height, img.height - sy);

const upscale = 2;
canvas.width = Math.round(sw * upscale);
canvas.height = Math.round(sh * upscale);
ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  console.log(`✂️ [CROP] Cropped to: ${sw}x${sh} at (${sx}, ${sy})`);

  return canvas.toDataURL('image/png');
}



  /**
   * Close the scan result overlay without saving
   */
  closeResult(): void {
    console.log('❌ [RESULT] User closed result without saving');
    this.currentScan.set(null);
    this.scannedRegionImage.set(null);
    this.isEditingCode.set(false);
    this.state.set('idle');
  }

}
