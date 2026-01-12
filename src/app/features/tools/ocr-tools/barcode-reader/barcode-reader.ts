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
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat, NotFoundException } from '@zxing/library';
import { BarcodeStorageService, ScannedBarcode } from '../services/barcode-storage.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

type ScannerState = 'idle' | 'scanResult' | 'error';

@Component({
  selector: 'app-barcode-reader',
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
  templateUrl: './barcode-reader.html',
  styleUrl: './barcode-reader.scss',
})
export class BarcodeReader implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('scannerSection') scannerSection!: ElementRef<HTMLDivElement>;

  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private storageService = inject(BarcodeStorageService);

  // State management
  state = signal<ScannerState>('idle');
  scannedBarcodes = signal<ScannedBarcode[]>([]);
  currentScan = signal<{ code: string; format: string } | null>(null);
  manualInput = signal<string>('');
  errorMessage = signal<string>('');

  // Scanner instance
  private codeReader: BrowserMultiFormatReader | null = null;

  displayedColumns: string[] = ['code', 'format', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.logEnvironmentInfo();
    this.updateMetaTags();
    this.loadScannedBarcodes();
    this.initializeScanner();
  }

  private logEnvironmentInfo(): void {
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Barcode Reader - Scan & Store Product Barcodes',
      description: 'Free online barcode scanner tool. Scan UPC, EAN, Code 128, Code 39, and other retail product barcodes using your device camera. Store and manage scanned codes locally.',
      keywords: ['barcode scanner', 'UPC scanner', 'EAN scanner', 'barcode reader', 'product scanner', 'code 128', 'code 39'],
      image: 'https://www.allthethings.dev/meta-images/og-barcode-reader.png',
      url: 'https://www.allthethings.dev/tools/barcode-reader',
      jsonLd: this.metaService.buildToolJsonLd({
        name: 'Barcode Reader - Scan & Store Product Barcodes',
        description: 'Free online barcode scanner tool. Scan UPC, EAN, Code 128, Code 39, and other retail product barcodes using your device camera. Store and manage scanned codes locally.',
        url: 'https://www.allthethings.dev/tools/barcode-reader',
        image: 'https://www.allthethings.dev/meta-images/og-barcode-reader.png'
      })
    });
  }

  private loadScannedBarcodes(): void {
    const scans = this.storageService.loadScans();
    this.scannedBarcodes.set(scans);
  }

  private async initializeScanner(): Promise<void> {
    console.log('🔧 [INIT] Initializing scanner...');
    try {
      // Configure barcode formats to scan
      const hints = new Map();
      const formats = [
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.ITF,
        BarcodeFormat.QR_CODE,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      console.log('📋 [INIT] Barcode formats configured:', formats.map(f => f.toString()).join(', '));

      // Enable TRY_HARDER to help with blurry/small barcodes
      hints.set(DecodeHintType.TRY_HARDER, true);
      console.log('💪 [INIT] TRY_HARDER mode enabled');

      this.codeReader = new BrowserMultiFormatReader(hints);
      console.log('✅ [INIT] BrowserMultiFormatReader created');
      console.log('✅ [INIT] Scanner initialization complete');

    } catch (error) {
      console.error('❌ [INIT] Error initializing scanner:', error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      this.errorMessage.set(`Failed to initialize scanner: ${errorDetails}`);
      this.state.set('error');
    }
  }



  approveScan(): void {
    console.log('✅ [APPROVE] User approved scan');
    const scan = this.currentScan();
    if (!scan) {
      console.warn('⚠️ [APPROVE] No scan to approve');
      return;
    }

    console.log('💾 [APPROVE] Saving scan:', scan);
    const saved = this.storageService.saveScan(scan.code, scan.format);

    if (saved) {
      this.snackbar.success('Barcode saved!', 2000);
      this.loadScannedBarcodes();
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
    console.log('✅ [RETRY] Returned to idle state');
    // Automatically open camera again for retry
    setTimeout(() => this.openNativeCamera(), 100);
  }

  addManualCode(): void {
    const code = this.manualInput().trim();
    if (!code) {
      this.snackbar.warning('Please enter a barcode', 2000);
      return;
    }

    const saved = this.storageService.saveScan(code, 'manual');

    if (saved) {
      this.snackbar.success('Barcode added!', 2000);
      this.manualInput.set('');
      this.loadScannedBarcodes();
    } else {
      this.snackbar.warning('Barcode already exists', 2000);
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
    link.download = `barcodes-${date}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.snackbar.success('Downloaded!', 2000);
  }

  clearAllCodes(): void {
    if (this.scannedBarcodes().length === 0) {
      return;
    }

    const confirmed = confirm('Are you sure you want to clear all scanned barcodes? This cannot be undone.');
    if (confirmed) {
      this.storageService.clearAll();
      this.loadScannedBarcodes();
      this.snackbar.success('All codes cleared', 2000);
    }
  }

  deleteCode(code: string): void {
    this.storageService.deleteScan(code);
    this.loadScannedBarcodes();
    this.snackbar.success('Code deleted', 2000);
  }

  formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString();
  }

  formatBarcodeFormat(format: string): string {
    // Make format names more readable
    return format
      .replace(/_/g, '-')
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

      console.log('🔎 [NATIVE] Scanning image for barcode...');
      const scanStartTime = performance.now();
      const result = await this.codeReader!.decodeFromImageElement(img);
      const scanTime = performance.now() - scanStartTime;

      console.log(`✅ [NATIVE] Barcode found in ${scanTime.toFixed(2)}ms`);
      console.log('📝 [NATIVE] Code:', result.getText());
      console.log('📝 [NATIVE] Format:', result.getBarcodeFormat().toString());

      // Show the result
      this.currentScan.set({
        code: result.getText(),
        format: this.formatBarcodeFormat(result.getBarcodeFormat().toString())
      });
      this.state.set('scanResult');

      // Vibrate for feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
        console.log('📳 [NATIVE] Vibration triggered');
      }

      // Cleanup
      URL.revokeObjectURL(imageUrl);

    } catch (error) {
      console.error('❌ [NATIVE] Failed to scan photo:', error);
      this.errorMessage.set('No barcode found in photo. Please try again with better lighting or a clearer image.');
      this.state.set('error');
    } finally {
      // Reset the input so the same file can be selected again
      input.value = '';
    }
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
