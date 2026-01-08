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

// Type declarations for ImageCapture API
declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  takePhoto(photoSettings?: any): Promise<Blob>;
  getPhotoCapabilities(): Promise<any>;
  getPhotoSettings(): Promise<any>;
}

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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
  private usingVideoScanner = false; // Track if we're using video scanner vs native camera

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
    this.logEnvironmentInfo();
    this.updateMetaTags();
    this.loadScannedBarcodes();
    this.initializeScanner();
  }

  private logEnvironmentInfo(): void {
    console.log('════════════════════════════════════════════════════════');
    console.log('🚀 BARCODE SCANNER - ENVIRONMENT INFO');
    console.log('════════════════════════════════════════════════════════');
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('🌐 Platform:', navigator.platform);
    console.log('🖥️ Screen Resolution:', typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'N/A (SSR)');
    console.log('📐 Viewport Size:', typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A (SSR)');
    console.log('🎥 MediaDevices API:', !!navigator.mediaDevices ? 'Available' : 'Not Available');
    console.log('📸 ImageCapture API:', typeof ImageCapture !== 'undefined' ? 'Available' : 'Not Available');
    console.log('📳 Vibration API:', 'vibrate' in navigator ? 'Available' : 'Not Available');
    console.log('🔒 Secure Context:', typeof window !== 'undefined' && window.isSecureContext ? 'Yes' : 'No');
    console.log('════════════════════════════════════════════════════════');
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

      // FIX: Enable TRY_HARDER to help with blurry/small barcodes
      hints.set(DecodeHintType.TRY_HARDER, true);
      console.log('💪 [INIT] TRY_HARDER mode enabled');

      this.codeReader = new BrowserMultiFormatReader(hints);
      console.log('✅ [INIT] BrowserMultiFormatReader created');

      // Get available cameras
      let devices: MediaDeviceInfo[] = [];
      try {
        devices = await this.codeReader.listVideoInputDevices();
        console.log(`📹 [INIT] Found ${devices.length} video input device(s)`);
        devices.forEach((device, index) => {
          console.log(`  ${index + 1}. ${device.label} (${device.deviceId})`);
        });
      } catch (e) {
        console.error('❌ [INIT] Failed to list video devices:', e);
        devices = [];
      }

      this.availableCameras.set(devices);

      if (devices.length > 0) {
        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        const selected = backCamera?.deviceId || devices[0].deviceId;
        this.selectedCamera.set(selected);
        console.log(`✅ [INIT] Selected camera: ${backCamera ? 'Back camera' : 'Default camera'} (${selected})`);
      } else {
        this.selectedCamera.set('');
        console.warn('⚠️ [INIT] No cameras available');
      }

      console.log('✅ [INIT] Scanner initialization complete');

    } catch (error) {
      console.error('❌ [INIT] Error initializing scanner:', error);
      const errorDetails = error instanceof Error ? error.message : String(error);
      const stackTrace = error instanceof Error && error.stack ? error.stack : 'No stack trace available';
      this.errorMessage.set(`Failed to initialize camera.\n\nError: ${errorDetails}\n\nStack Trace:\n${stackTrace}`);
      this.state.set('error');
    }
  }

  async startScanning(): Promise<void> {
  console.log('🎥 [SCAN] Starting video scanning process...');
  this.usingVideoScanner = true;

  if (!this.codeReader || this.scanningInProgress) {
    console.warn('⚠️ [SCAN] Scanner not ready or already scanning');
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    console.error('❌ [SCAN] Camera API not available');
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
    console.log('📹 [SCAN] Selected camera:', selectedDeviceId || 'default');

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
      width: { ideal: 1920, min: 640 },
      height: { ideal: 1080, min: 480 },
      advanced: [
        { focusMode: 'continuous' }, // Force continuous autofocus
        { zoom: 1.0 }
      ]
    };

    console.log('📋 [SCAN] Requesting video with constraints:', JSON.stringify(videoConstraints, null, 2));

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: videoConstraints
    });

    console.log('✅ [SCAN] Stream acquired successfully');
    this.activeStream = stream;
    videoElem.srcObject = stream;

    // Wait for metadata to load so we can inspect the track capabilities
    await videoElem.play();
    console.log('▶️ [SCAN] Video playback started');

    // POST-LOAD OPTIMIZATION:
    // Some Android devices require applying constraints AFTER the stream has started.
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const capabilities = videoTrack.getCapabilities() as any;

    console.log('📊 [SCAN] Video track settings:', JSON.stringify(settings, null, 2));
    console.log('🔧 [SCAN] Video track capabilities:', JSON.stringify(capabilities, null, 2));

    const advancedConstraints: any = {};

    // If the device supports continuous focus, force it again explicitly
    if (capabilities.focusMode?.includes('continuous')) {
      advancedConstraints.focusMode = 'continuous';
      console.log('🎯 [SCAN] Applying continuous focus mode');
    }

    // If the device supports zoom, we can set it here if the initial constraint failed
    if (capabilities.zoom) {
      // Set zoom to 2.0 or the maximum supported if 2.0 is too high
      advancedConstraints.zoom = Math.min(2.0, capabilities.zoom.max);
      console.log(`🔍 [SCAN] Applying zoom: ${advancedConstraints.zoom} (max: ${capabilities.zoom.max})`);
    }

    if (Object.keys(advancedConstraints).length > 0) {
      try {
        await videoTrack.applyConstraints({ advanced: [advancedConstraints] });
        const newSettings = videoTrack.getSettings();
        console.log('✅ [SCAN] Advanced constraints applied. New settings:', JSON.stringify(newSettings, null, 2));
      } catch (e) {
        console.warn('⚠️ [SCAN] Could not apply advanced focus/zoom constraints:', e);
      }
    }

    // Initialize ImageCapture for high-res photo capture
    try {
      this.imageCapture = new ImageCapture(videoTrack);
      const photoCapabilities = await this.imageCapture.getPhotoCapabilities();
      console.log('📸 [SCAN] ImageCapture API initialized successfully');
      console.log('📸 [SCAN] Photo capabilities:', JSON.stringify(photoCapabilities, null, 2));
    } catch (e) {
      console.warn('⚠️ [SCAN] ImageCapture API not available:', e);
      this.imageCapture = null;
    }

    // Start the ZXing decoding loop
    // This scans the video preview at lower quality to DETECT barcodes
    // When detected, we'll capture a high-res photo for accurate scanning
    console.log('🔄 [SCAN] Starting continuous barcode detection loop...');
    this.codeReader.decodeFromVideoElementContinuously(videoElem, (result) => {
      if (result && this.state() === 'scanning' && !this.isCapturingPhoto) {
        console.log('🎯 [SCAN] Barcode detected in video stream:', result.getText());
        this.handleBarcodeDetection(result.getText(), result.getBarcodeFormat().toString());
      }
    });

  } catch (error) {
    console.error('❌ [SCAN] Camera initialization failed:', error);
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
    console.log('🔍 [DETECT] handleBarcodeDetection called');
    console.log('📝 [DETECT] Code from video:', code);
    console.log('📝 [DETECT] Format from video:', format);

    const now = Date.now();

    // Prevent duplicate rapid scans of the same code
    if (code === this.lastScannedCode && now - this.lastScannedTime < this.DUPLICATE_SCAN_WINDOW) {
      console.log(`⏭️ [DETECT] Skipping duplicate scan (within ${this.DUPLICATE_SCAN_WINDOW}ms window)`);
      return;
    }

    // Prevent multiple simultaneous photo captures
    if (this.isCapturingPhoto) {
      console.log('⏭️ [DETECT] Already capturing photo, skipping');
      return;
    }

    console.log('📸 [DETECT] Starting photo capture process...');
    this.isCapturingPhoto = true;

    try {
      // If ImageCapture API is available, capture high-res photo for accurate scanning
      if (this.imageCapture) {
        console.log('📸 [DETECT] ImageCapture available, taking photo...');
        const startTime = performance.now();
        const blob = await this.imageCapture.takePhoto();
        const captureTime = performance.now() - startTime;
        console.log(`✅ [DETECT] Photo captured in ${captureTime.toFixed(2)}ms`);
        console.log(`📏 [DETECT] Photo blob size: ${(blob.size / 1024).toFixed(2)} KB`);

        console.log('🖼️ [DETECT] Creating ImageBitmap from blob...');
        const imageBitmap = await createImageBitmap(blob);
        console.log(`📐 [DETECT] ImageBitmap dimensions: ${imageBitmap.width}x${imageBitmap.height}`);

        console.log('🔎 [DETECT] Scanning high-res photo with ZXing...');
        const scanStartTime = performance.now();
        const result = await this.codeReader!.decodeFromImageElement(imageBitmap as any);
        const scanTime = performance.now() - scanStartTime;
        console.log(`✅ [DETECT] Photo scanned in ${scanTime.toFixed(2)}ms`);
        console.log('📝 [DETECT] Code from photo:', result.getText());
        console.log('📝 [DETECT] Format from photo:', result.getBarcodeFormat().toString());

        // Use result from high-res photo
        this.handleSuccessfulScan(result.getText(), result.getBarcodeFormat().toString());
      } else {
        // Fallback: use the result from video scanning if ImageCapture isn't available
        console.log('⚠️ [DETECT] ImageCapture not available, using video result');
        this.handleSuccessfulScan(code, format);
      }
    } catch (error) {
      // If photo capture or scanning fails, fall back to video result
      console.error('❌ [DETECT] High-res photo capture/scan failed:', error);
      console.log('🔄 [DETECT] Falling back to video result');
      this.handleSuccessfulScan(code, format);
    } finally {
      this.isCapturingPhoto = false;
      console.log('✅ [DETECT] Photo capture process complete');
    }
  }

  private handleSuccessfulScan(code: string, format: string): void {
    console.log('🎉 [SUCCESS] handleSuccessfulScan called');
    console.log('📝 [SUCCESS] Final code:', code);
    console.log('📝 [SUCCESS] Final format:', format);

    const now = Date.now();

    // Prevent duplicate rapid scans of the same code
    if (code === this.lastScannedCode && now - this.lastScannedTime < this.DUPLICATE_SCAN_WINDOW) {
      console.log(`⏭️ [SUCCESS] Skipping duplicate scan (within ${this.DUPLICATE_SCAN_WINDOW}ms window)`);
      return;
    }

    this.lastScannedCode = code;
    this.lastScannedTime = now;
    console.log('✅ [SUCCESS] Scan accepted, showing result to user');

    // 1. Vibrate for feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
      console.log('📳 [SUCCESS] Vibration triggered');
    }

    // 2. Stop the video feed visually
    this.videoElement.nativeElement.pause();
    console.log('⏸️ [SUCCESS] Video paused');

    // 3. Update state
    this.currentScan.set({
      code: code,
      format: this.formatBarcodeFormat(format)
    });
    this.state.set('scanResult');
    console.log('✅ [SUCCESS] State updated to scanResult');
  }

stopScanning(): void {
  console.log('🛑 [STOP] Stopping scanner...');
  this.state.set('idle');
  this.scanningInProgress = false;
  this.currentScan.set(null);
  this.lastScannedCode = '';
  this.isCapturingPhoto = false;
  this.imageCapture = null;
  this.usingVideoScanner = false;

  if (this.codeReader) {
    this.codeReader.reset();
    console.log('✅ [STOP] Code reader reset');
  }

  if (this.activeStream) {
    for (const track of this.activeStream.getTracks()) {
      track.stop();
    }
    this.activeStream = null;
    console.log('✅ [STOP] Stream tracks stopped');
  }

  if (this.videoElement?.nativeElement) {
    this.videoElement.nativeElement.srcObject = null;
    console.log('✅ [STOP] Video element cleared');
  }

  console.log('✅ [STOP] Scanner stopped successfully');
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

    // Return to appropriate state based on scanning method
    this.currentScan.set(null);

    if (this.usingVideoScanner) {
      // Resume video playback for video scanner
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.play();
        console.log('▶️ [APPROVE] Video playback resumed');
      }
      this.state.set('scanning');
      console.log('🔄 [APPROVE] Returned to video scanning state');
    } else {
      // Return to idle for native camera (user will click to scan again)
      this.state.set('idle');
      console.log('🔄 [APPROVE] Returned to idle state');
    }
  }

  retryScan(): void {
    console.log('🔄 [RETRY] User requested retry');
    this.currentScan.set(null);

    if (this.usingVideoScanner) {
      // Resume video playback for video scanner
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.play();
        console.log('▶️ [RETRY] Video playback resumed');
      }
      this.state.set('scanning');
      console.log('✅ [RETRY] Returned to video scanning state');
    } else {
      // Open native camera again
      this.state.set('idle');
      console.log('✅ [RETRY] Returned to idle state');
      // Automatically open camera again for retry
      setTimeout(() => this.openNativeCamera(), 100);
    }
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
   * Opens native camera to capture a photo for scanning
   */
  openNativeCamera(): void {
    console.log('📸 [NATIVE] Opening native camera...');
    this.usingVideoScanner = false;
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

  /**
   * Manually capture photo from video stream for scanning
   */
  async manuallyCapture(): Promise<void> {
    console.log('📸 [MANUAL] User manually triggered photo capture');

    if (!this.imageCapture) {
      console.error('❌ [MANUAL] ImageCapture not available');
      this.snackbar.error('Photo capture not available', 2000);
      return;
    }

    if (this.isCapturingPhoto) {
      console.log('⏭️ [MANUAL] Already capturing, ignoring');
      return;
    }

    this.isCapturingPhoto = true;

    try {
      console.log('📸 [MANUAL] Taking photo...');
      const startTime = performance.now();
      const blob = await this.imageCapture.takePhoto();
      const captureTime = performance.now() - startTime;
      console.log(`✅ [MANUAL] Photo captured in ${captureTime.toFixed(2)}ms`);
      console.log(`📏 [MANUAL] Photo blob size: ${(blob.size / 1024).toFixed(2)} KB`);

      console.log('🖼️ [MANUAL] Converting blob to image element...');
      const imageUrl = URL.createObjectURL(blob);
      const img = new Image();

      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          console.log(`📐 [MANUAL] Image loaded: ${img.width}x${img.height}`);
          resolve();
        };
        img.onerror = () => {
          console.error('❌ [MANUAL] Failed to load image');
          reject(new Error('Failed to load image'));
        };
        img.src = imageUrl;
      });

      console.log('🔎 [MANUAL] Scanning high-res photo with ZXing...');
      const scanStartTime = performance.now();
      const result = await this.codeReader!.decodeFromImageElement(img);
      const scanTime = performance.now() - scanStartTime;
      console.log(`✅ [MANUAL] Photo scanned in ${scanTime.toFixed(2)}ms`);
      console.log('📝 [MANUAL] Code from photo:', result.getText());
      console.log('📝 [MANUAL] Format from photo:', result.getBarcodeFormat().toString());

      // Cleanup
      URL.revokeObjectURL(imageUrl);

      // Pause the video
      this.videoElement.nativeElement.pause();

      // Use result from high-res photo
      this.currentScan.set({
        code: result.getText(),
        format: this.formatBarcodeFormat(result.getBarcodeFormat().toString())
      });
      this.state.set('scanResult');

      // Vibrate for feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
        console.log('📳 [MANUAL] Vibration triggered');
      }

    } catch (error) {
      console.error('❌ [MANUAL] Failed to capture or scan photo:', error);
      this.snackbar.error('No barcode found in photo. Try again with better lighting.', 3000);
    } finally {
      this.isCapturingPhoto = false;
      console.log('✅ [MANUAL] Manual capture process complete');
    }
  }
}
