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
  private activeStream: MediaStream | null = null;
  private lastScannedCode = '';
  private lastScannedTime = 0;
  private readonly DUPLICATE_SCAN_WINDOW = 2000; // 2 seconds
  private imageCapture: ImageCapture | null = null;
  private isCapturingPhoto = false;

  displayedColumns: string[] = ['code', 'format', 'timestamp', 'actions'];

  ngOnInit(): void {
    this.updateMetaTags();
    this.loadScannedBarcodes();
    this.initializeScanner();
  }

  ngOnDestroy(): void {
    this.stopScanning();
    this.codeReader?.reset();

    // Ensure camera stream is stopped
    if (this.videoElement?.nativeElement?.srcObject) {
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
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
        BarcodeFormat.QR_CODE,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      
      // FIX: Enable TRY_HARDER to help with blurry/small barcodes
      hints.set(DecodeHintType.TRY_HARDER, true); 

      this.codeReader = new BrowserMultiFormatReader(hints);

      // Get available cameras
      let devices: MediaDeviceInfo[] = [];
      try {
        devices = await this.codeReader.listVideoInputDevices();
      } catch (e) {
        devices = [];
      }

      this.availableCameras.set(devices);

      if (devices.length > 0) {
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        this.selectedCamera.set(backCamera?.deviceId || devices[0].deviceId);
      } else {
        this.selectedCamera.set('');
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

  if (!navigator.mediaDevices?.getUserMedia) {
    this.errorMessage.set('Camera API not available in this browser/context.');
    this.state.set('error');
    return;
  }

  try {
    this.state.set('scanning');
    this.scanningInProgress = true;
    this.errorMessage.set('');

    // Small delay to ensure the DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!this.videoElement?.nativeElement) {
      throw new Error('Video element not found in DOM.');
    }

    const videoElem = this.videoElement.nativeElement;
    videoElem.muted = true;
    videoElem.setAttribute('playsinline', 'true');
    videoElem.playsInline = true;

    const selectedDeviceId = this.selectedCamera();
    
    /**
     * ADVANCED CONSTRAINTS
     * We request high resolution AND advanced focus/zoom properties.
     * Note: 'advanced' constraints are often ignored by browsers if they aren't supported,
     * so we include them safely here.
     */
    const videoConstraints: any = {
      ...(selectedDeviceId && selectedDeviceId.trim().length > 0 
          ? { deviceId: { exact: selectedDeviceId } } 
          : { facingMode: { ideal: 'environment' } }),
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      advanced: [
        { focusMode: 'continuous' }, // Force continuous autofocus
        { zoom: 1.0 }                // Start with a 2x zoom so users hold the phone further back
      ]
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: videoConstraints
    });

    this.activeStream = stream;
    videoElem.srcObject = stream;

    // Wait for metadata to load so we can inspect the track capabilities
    await videoElem.play();

    // POST-LOAD OPTIMIZATION:
    // Some Android devices require applying constraints AFTER the stream has started.
    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities() as any;

    const advancedConstraints: any = {};

    // If the device supports continuous focus, force it again explicitly
    if (capabilities.focusMode?.includes('continuous')) {
      advancedConstraints.focusMode = 'continuous';
    }

    // If the device supports zoom, we can set it here if the initial constraint failed
    if (capabilities.zoom) {
      // Set zoom to 2.0 or the maximum supported if 2.0 is too high
      advancedConstraints.zoom = Math.min(2.0, capabilities.zoom.max);
    }

    if (Object.keys(advancedConstraints).length > 0) {
      try {
        await videoTrack.applyConstraints({ advanced: [advancedConstraints] });
      } catch (e) {
        console.warn('Could not apply advanced focus/zoom constraints:', e);
      }
    }

    // Initialize ImageCapture for high-res photo capture
    try {
      this.imageCapture = new ImageCapture(videoTrack);
    } catch (e) {
      console.warn('ImageCapture API not available:', e);
      this.imageCapture = null;
    }

    // Start the ZXing decoding loop
    // This scans the video preview at lower quality to DETECT barcodes
    // When detected, we'll capture a high-res photo for accurate scanning
    this.codeReader.decodeFromVideoElementContinuously(videoElem, (result) => {
      if (result && this.state() === 'scanning' && !this.isCapturingPhoto) {
        this.handleBarcodeDetection(result.getText(), result.getBarcodeFormat().toString());
      }
    });

  } catch (error) {
    console.error('Camera initialization failed:', error);
    const errorDetails = error instanceof Error ? error.message : String(error);
    this.errorMessage.set(`Failed to start camera: ${errorDetails}`);
    this.state.set('error');
    this.scanningInProgress = false;
  }
}

  /**
   * Called when ZXing detects a barcode in the video preview.
   * Triggers high-res photo capture for accurate scanning.
   */
  private async handleBarcodeDetection(code: string, format: string): Promise<void> {
    const now = Date.now();

    // Prevent duplicate rapid scans of the same code
    if (code === this.lastScannedCode && now - this.lastScannedTime < this.DUPLICATE_SCAN_WINDOW) {
      return;
    }

    // Prevent multiple simultaneous photo captures
    if (this.isCapturingPhoto) {
      return;
    }

    this.isCapturingPhoto = true;

    try {
      // If ImageCapture API is available, capture high-res photo for accurate scanning
      if (this.imageCapture) {
        const blob = await this.imageCapture.takePhoto();
        const imageBitmap = await createImageBitmap(blob);

        // Scan the high-res photo with ZXing
        const result = await this.codeReader!.decodeFromImageElement(imageBitmap as any);

        // Use result from high-res photo
        this.handleSuccessfulScan(result.getText(), result.getBarcodeFormat().toString());
      } else {
        // Fallback: use the result from video scanning if ImageCapture isn't available
        this.handleSuccessfulScan(code, format);
      }
    } catch (error) {
      // If photo capture or scanning fails, fall back to video result
      console.warn('High-res photo capture failed, using video result:', error);
      this.handleSuccessfulScan(code, format);
    } finally {
      this.isCapturingPhoto = false;
    }
  }

  private handleSuccessfulScan(code: string, format: string): void {
    const now = Date.now();

    // Prevent duplicate rapid scans of the same code
    if (code === this.lastScannedCode && now - this.lastScannedTime < this.DUPLICATE_SCAN_WINDOW) {
      return;
    }

    this.lastScannedCode = code;
    this.lastScannedTime = now;

    // 1. Vibrate for feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    // 2. Stop the video feed visually
    this.videoElement.nativeElement.pause();

    // 3. Update state
    this.currentScan.set({
      code: code,
      format: this.formatBarcodeFormat(format)
    });
    this.state.set('scanResult');
  }

stopScanning(): void {
  this.state.set('idle');
  this.scanningInProgress = false;
  this.currentScan.set(null);
  this.lastScannedCode = '';
  this.isCapturingPhoto = false;
  this.imageCapture = null;

  if (this.codeReader) {
    this.codeReader.reset();
  }

  if (this.activeStream) {
    for (const track of this.activeStream.getTracks()) {
      track.stop();
    }
    this.activeStream = null;
  }

  if (this.videoElement?.nativeElement) {
    this.videoElement.nativeElement.srcObject = null;
  }
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

    // Resume video playback
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play();
    }

    this.state.set('scanning');
  }

  retryScan(): void {
    this.currentScan.set(null);

    // Resume video playback
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play();
    }

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
