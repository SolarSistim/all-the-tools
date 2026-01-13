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
    AdsenseComponent
  ],
  templateUrl: './on-reward-scanner.html',
  styleUrl: './on-reward-scanner.scss',
})
export class OnRewardScanner implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('scannerSection') scannerSection!: ElementRef<HTMLDivElement>;

  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private storageService = inject(OnRewardStorageService);

  // State management
  state = signal<ScannerState>('idle');
  scannedCodes = signal<ScannedRewardCode[]>([]);
  currentScan = signal<{ code: string } | null>(null);
  manualInput = signal<string>('');
  errorMessage = signal<string>('');
  processingProgress = signal<number>(0);

  // Crop region selection
  capturedImage = signal<string | null>(null);
  cropRegion = signal<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 300, height: 100 });
  isDragging = signal<boolean>(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private initialCropX = 0;
  private initialCropY = 0;

  // Tesseract worker and module
  private worker: any = null;
  private Tesseract: any = null;

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
      if (!this.Tesseract) {
        console.log('📦 [INIT] Loading Tesseract.js...');
        this.Tesseract = await import('tesseract.js');
        console.log('✅ [INIT] Tesseract.js loaded');
      }

      this.worker = await this.Tesseract.createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            this.processingProgress.set(Math.round(m.progress * 100));
          }
        },
      });

      // Configure for better accuracy with alphanumeric codes
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
        tessedit_pageseg_mode: this.Tesseract.PSM.SINGLE_BLOCK,
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

    // Strategy 1: Look for pattern with hyphens
    const patternWithHyphens = /[A-Z0-9]{5}-[A-Z0-9]{4}-[A-Z0-9]{4}/g;
    const matchWithHyphens = rawText.toUpperCase().match(patternWithHyphens);
    if (matchWithHyphens && matchWithHyphens.length > 0) {
      console.log('✅ [EXTRACT] Found code with hyphens:', matchWithHyphens[0]);
      return matchWithHyphens[0];
    }

    // Strategy 2: Look for 14-character sequence and add hyphens
    const normalized = rawText.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const patternContinuous = /[A-Z0-9]{14}/g;
    const matchContinuous = normalized.match(patternContinuous);

    if (matchContinuous && matchContinuous.length > 0) {
      const code = matchContinuous[0];
      const formatted = `${code.slice(0,5)}-${code.slice(5,9)}-${code.slice(9,13)}`;
      console.log('✅ [EXTRACT] Found continuous code, formatted:', formatted);
      return formatted;
    }

    // Strategy 3: Look for partial matches and try to reconstruct
    if (normalized.length >= 13 && normalized.length <= 15) {
      // Attempt to extract 14 characters
      const bestGuess = normalized.slice(0, 14);
      if (bestGuess.length === 14) {
        const formatted = `${bestGuess.slice(0,5)}-${bestGuess.slice(5,9)}-${bestGuess.slice(9,13)}`;
        console.log('⚠️ [EXTRACT] Best guess code:', formatted);
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
    if (!this.Tesseract || !this.worker) {
      console.error('❌ [OCR] Tesseract not initialized');
      return null;
    }

    const psmModes = [
      this.Tesseract.PSM.SINGLE_BLOCK,
      this.Tesseract.PSM.SINGLE_LINE,
      this.Tesseract.PSM.SPARSE_TEXT,
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
      tessedit_pageseg_mode: this.Tesseract.PSM.SINGLE_BLOCK,
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
    const saved = this.storageService.saveScan(scan.code);

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
    this.state.set('idle');
    console.log('🔄 [APPROVE] Returned to idle state');
  }

  retryScan(): void {
    console.log('🔄 [RETRY] User requested retry');
    this.currentScan.set(null);
    this.state.set('idle');
    this.processingProgress.set(0);
    console.log('✅ [RETRY] Returned to idle state');
    // Automatically open camera again for retry
    setTimeout(() => this.openNativeCamera(), 100);
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
      const centerX = Math.floor(img.width / 2 - 150);
      const centerY = Math.floor(img.height / 2 - 50);
      this.cropRegion.set({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: 300,
        height: 100
      });

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

    const newX = this.initialCropX + deltaX;
    const newY = this.initialCropY + deltaY;

    // Update crop region (bounds will be checked when cropping)
    this.cropRegion.update(region => ({
      ...region,
      x: newX,
      y: newY
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
      const croppedImageUrl = this.cropImage(img, this.cropRegion());

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

  /**
   * Crop an image to a specific region
   */
  private cropImage(img: HTMLImageElement, region: { x: number; y: number; width: number; height: number }): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Ensure crop region is within image bounds
    const x = Math.max(0, Math.min(region.x, img.width - region.width));
    const y = Math.max(0, Math.min(region.y, img.height - region.height));
    const width = Math.min(region.width, img.width - x);
    const height = Math.min(region.height, img.height - y);

    canvas.width = width;
    canvas.height = height;

    // Draw the cropped portion
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    console.log(`✂️ [CROP] Cropped to: ${width}x${height} at (${x}, ${y})`);

    return canvas.toDataURL('image/png');
  }

  /**
   * Close the scan result overlay without saving
   */
  closeResult(): void {
    console.log('❌ [RESULT] User closed result without saving');
    this.currentScan.set(null);
    this.state.set('idle');
  }

}
