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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat, NotFoundException } from '@zxing/library';
import { BarcodeStorageService, ScannedBarcode } from '../services/barcode-storage.service';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

type ScannerState = 'idle' | 'scanning' | 'scanResult' | 'error';

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
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);
  private storageService = inject(BarcodeStorageService);
  private dialog = inject(MatDialog);

  // State management
  state = signal<ScannerState>('idle');
  scannedBarcodes = signal<ScannedBarcode[]>([]);
  currentScan = signal<{ code: string; format: string } | null>(null);
  manualInput = signal<string>('');
  errorMessage = signal<string>('');
  availableCameras = signal<MediaDeviceInfo[]>([]);
  selectedCamera = signal<string>('');

  // Scanner instance
  private codeReader: BrowserMultiFormatReader | null = null;
  private scanningInProgress = false;
  private lastScannedCode = '';
  private lastScannedTime = 0;
  private readonly DUPLICATE_SCAN_WINDOW = 2000; // 2 seconds

  displayedColumns: string[] = ['code', 'format', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadScannedBarcodes();
    this.initializeScanner();
  }

  ngOnDestroy(): void {
    this.stopScanning();
    this.codeReader?.reset();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Barcode Reader - Scan & Store Product Barcodes',
      description: 'Free online barcode scanner tool. Scan UPC, EAN, Code 128, Code 39, and other retail product barcodes using your device camera. Store and manage scanned codes locally.',
      keywords: ['barcode scanner', 'UPC scanner', 'EAN scanner', 'barcode reader', 'product scanner', 'code 128', 'code 39'],
      image: 'https://www.allthethings.dev/meta-images/og-barcode-reader.png',
      url: 'https://www.allthethings.dev/tools/barcode-reader'
    });
  }

  private loadScannedBarcodes(): void {
    const scans = this.storageService.loadScans();
    this.scannedBarcodes.set(scans);
  }

  private async initializeScanner(): Promise<void> {
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
        BarcodeFormat.QR_CODE, // Bonus support
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      hints.set(DecodeHintType.TRY_HARDER, true);

      this.codeReader = new BrowserMultiFormatReader(hints);

      // Get available cameras
      const devices = await this.codeReader.listVideoInputDevices();
      this.availableCameras.set(devices);

      if (devices.length > 0) {
        // Prefer back camera on mobile
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        this.selectedCamera.set(backCamera?.deviceId || devices[0].deviceId);
      }
    } catch (error) {
      console.error('Error initializing scanner:', error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      const stackTrace = error instanceof Error && error.stack ? error.stack : 'No stack trace available';
      this.errorMessage.set(`Failed to initialize camera.\n\nError: ${errorDetails}\n\nStack Trace:\n${stackTrace}`);
      this.state.set('error');
    }
  }

  async startScanning(): Promise<void> {
    if (!this.codeReader || this.scanningInProgress) {
      return;
    }

    if (this.availableCameras().length === 0) {
      this.errorMessage.set('No camera found. Please ensure your device has a camera and permissions are granted.');
      this.state.set('error');
      return;
    }

    try {
      this.state.set('scanning');
      this.scanningInProgress = true;
      this.errorMessage.set('');

      const selectedDeviceId = this.selectedCamera();

      await this.codeReader.decodeFromVideoDevice(
        selectedDeviceId || null,
        this.videoElement.nativeElement,
        (result, error) => {
          if (result) {
            const code = result.getText();
            const format = result.getBarcodeFormat().toString();
            const now = Date.now();

            // Prevent duplicate rapid scans of the same code
            if (code === this.lastScannedCode && now - this.lastScannedTime < this.DUPLICATE_SCAN_WINDOW) {
              return;
            }

            this.lastScannedCode = code;
            this.lastScannedTime = now;

            // Show scan result for approval
            this.currentScan.set({ code, format });
            this.pauseScanning();
            this.state.set('scanResult');

            // Optional: vibrate if available
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
          }

          if (error && !(error instanceof NotFoundException)) {
            console.error('Scan error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      const stackTrace = error instanceof Error && error.stack ? error.stack : 'No stack trace available';
      this.errorMessage.set(`Failed to start camera.\n\nError: ${errorDetails}\n\nStack Trace:\n${stackTrace}`);
      this.state.set('error');
      this.scanningInProgress = false;
    }
  }

  private pauseScanning(): void {
    // Pause the video to freeze the camera feed
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.pause();
    }
  }

  private resumeScanning(): void {
    // Resume the video
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play();
    }
  }

  stopScanning(): void {
    if (this.codeReader) {
      this.codeReader.reset();
    }
    this.scanningInProgress = false;
    this.state.set('idle');
    this.currentScan.set(null);
    this.lastScannedCode = '';
  }

  approveScan(): void {
    const scan = this.currentScan();
    if (!scan) return;

    const saved = this.storageService.saveScan(scan.code, scan.format);

    if (saved) {
      this.snackbar.success('Barcode saved!', 2000);
      this.loadScannedBarcodes();
    } else {
      this.snackbar.warning('Already saved', 2000);
    }

    // Return to scanning state
    this.currentScan.set(null);
    this.resumeScanning();
    this.state.set('scanning');
  }

  retryScan(): void {
    this.currentScan.set(null);
    this.resumeScanning();
    this.state.set('scanning');
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
}
