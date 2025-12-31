import { Component, inject, signal, effect, untracked, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { ToolsService } from '../../../../core/services/tools.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import QRCode from 'qrcode';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

type QRCodeType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

interface QRCodeOptions {
  size: number;
  margin: number;
  foreground: string;
  background: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    PageHeaderComponent,
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './qr-code-generator.html',
  styleUrl: './qr-code-generator.scss',
})
export class QrCodeGenerator implements OnInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private snackbar = inject(CustomSnackbarService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  // QR Code Type
  selectedType = signal<QRCodeType>('text');

  // Input fields
  textInput = signal<string>('');
  urlInput = signal<string>('https://');
  emailAddress = signal<string>('');
  emailSubject = signal<string>('');
  emailBody = signal<string>('');
  phoneNumber = signal<string>('');
  smsNumber = signal<string>('');
  smsMessage = signal<string>('');
  wifiSSID = signal<string>('');
  wifiPassword = signal<string>('');
  wifiSecurity = signal<'WPA' | 'WEP' | 'nopass'>('WPA');
  wifiHidden = signal<boolean>(false);
  vcardName = signal<string>('');
  vcardOrganization = signal<string>('');
  vcardPhone = signal<string>('');
  vcardEmail = signal<string>('');
  vcardWebsite = signal<string>('');

  // QR Options
  qrSize = signal<number>(512);
  qrMargin = signal<number>(1);
  qrForeground = signal<string>('#000000');
  qrBackground = signal<string>('#FFFFFF');
  qrErrorCorrection = signal<'L' | 'M' | 'Q' | 'H'>('M');

  // State
  qrDataUrl = signal<string>('');
  encodedData = signal<string>('');
  validationError = signal<string>('');
  isGenerating = signal<boolean>(false);

  constructor() {
    // Auto-generate QR code when any option changes
    effect(() => {
      // Track all input signals
      this.selectedType();
      this.textInput();
      this.urlInput();
      this.emailAddress();
      this.emailSubject();
      this.emailBody();
      this.phoneNumber();
      this.smsNumber();
      this.smsMessage();
      this.wifiSSID();
      this.wifiPassword();
      this.wifiSecurity();
      this.wifiHidden();
      this.vcardName();
      this.vcardOrganization();
      this.vcardPhone();
      this.vcardEmail();
      this.vcardWebsite();
      this.qrSize();
      this.qrMargin();
      this.qrForeground();
      this.qrBackground();
      this.qrErrorCorrection();

      // Generate QR code
      untracked(() => {
        this.generateQRCode();
      });
    });
  }

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'QR Code Generator',
      description: 'Create QR codes for URLs, text, emails, WiFi, vCards, and more. Customize colors, size, and download as PNG or SVG.',
      keywords: ['qr code generator', 'qr code', 'barcode', 'qr scanner', 'wifi qr code'],
      image: 'https://www.allthethings.dev/meta-images/og-qr-code-generator.png',
      url: 'https://www.allthethings.dev/tools/qr-code-generator'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  /**
   * Get the data to encode based on the selected type
   */
  private getEncodedData(): string {
    const type = this.selectedType();

    switch (type) {
      case 'text':
        return this.textInput();

      case 'url':
        return this.urlInput();

      case 'email':
        const email = this.emailAddress();
        const subject = this.emailSubject();
        const body = this.emailBody();
        if (!email) return '';
        let mailto = `mailto:${email}`;
        const params: string[] = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        if (params.length > 0) mailto += `?${params.join('&')}`;
        return mailto;

      case 'phone':
        const phone = this.phoneNumber();
        return phone ? `tel:${phone}` : '';

      case 'sms':
        const smsNum = this.smsNumber();
        const smsMsg = this.smsMessage();
        if (!smsNum) return '';
        return smsMsg ? `smsto:${smsNum}:${smsMsg}` : `smsto:${smsNum}`;

      case 'wifi':
        const ssid = this.wifiSSID();
        const password = this.wifiPassword();
        const security = this.wifiSecurity();
        const hidden = this.wifiHidden();
        if (!ssid) return '';
        return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;

      case 'vcard':
        const name = this.vcardName();
        if (!name) return '';
        const org = this.vcardOrganization();
        const vcardPhone = this.vcardPhone();
        const vcardEmail = this.vcardEmail();
        const website = this.vcardWebsite();

        let vcard = 'BEGIN:VCARD\n';
        vcard += 'VERSION:3.0\n';
        vcard += `FN:${name}\n`;
        if (org) vcard += `ORG:${org}\n`;
        if (vcardPhone) vcard += `TEL:${vcardPhone}\n`;
        if (vcardEmail) vcard += `EMAIL:${vcardEmail}\n`;
        if (website) vcard += `URL:${website}\n`;
        vcard += 'END:VCARD';
        return vcard;

      default:
        return '';
    }
  }

  /**
   * Validate the current input
   */
  private validateInput(): string {
    const type = this.selectedType();

    switch (type) {
      case 'text':
        if (!this.textInput().trim()) return 'Please enter some text';
        break;

      case 'url':
        const url = this.urlInput();
        if (!url.trim()) return 'Please enter a URL';
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return 'URL must start with http:// or https://';
        }
        break;

      case 'email':
        if (!this.emailAddress().trim()) return 'Please enter an email address';
        if (!this.isValidEmail(this.emailAddress())) return 'Please enter a valid email address';
        break;

      case 'phone':
        if (!this.phoneNumber().trim()) return 'Please enter a phone number';
        break;

      case 'sms':
        if (!this.smsNumber().trim()) return 'Please enter a phone number';
        break;

      case 'wifi':
        if (!this.wifiSSID().trim()) return 'Please enter a WiFi network name (SSID)';
        break;

      case 'vcard':
        if (!this.vcardName().trim()) return 'Please enter a name';
        break;
    }

    return '';
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate QR code
   */
  async generateQRCode(): Promise<void> {
    const validationError = this.validateInput();
    if (validationError) {
      this.validationError.set(validationError);
      this.qrDataUrl.set('');
      this.encodedData.set('');
      return;
    }

    this.validationError.set('');
    const data = this.getEncodedData();

    if (!data) {
      this.qrDataUrl.set('');
      this.encodedData.set('');
      return;
    }

    this.encodedData.set(data);
    this.isGenerating.set(true);

    try {
      const options: QRCode.QRCodeToDataURLOptions = {
        width: this.qrSize(),
        margin: this.qrMargin(),
        color: {
          dark: this.qrForeground(),
          light: this.qrBackground()
        },
        errorCorrectionLevel: this.qrErrorCorrection()
      };

      const dataUrl = await QRCode.toDataURL(data, options);
      this.qrDataUrl.set(dataUrl);
    } catch (error) {
      console.error('QR Code generation error:', error);
      this.snackbar.error('Failed to generate QR code', 3000);
    } finally {
      this.isGenerating.set(false);
    }
  }

  /**
   * Download QR code as PNG
   */
  async downloadPNG(): Promise<void> {
    const dataUrl = this.qrDataUrl();
    if (!dataUrl) {
      this.snackbar.warning('No QR code to download', 2000);
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    this.snackbar.success('QR code downloaded!', 2000);
  }

  /**
   * Download QR code as SVG
   */
  async downloadSVG(): Promise<void> {
    const data = this.encodedData();
    if (!data) {
      this.snackbar.warning('No QR code to download', 2000);
      return;
    }

    try {
      const options: QRCode.QRCodeToStringOptions = {
        type: 'svg',
        width: this.qrSize(),
        margin: this.qrMargin(),
        color: {
          dark: this.qrForeground(),
          light: this.qrBackground()
        },
        errorCorrectionLevel: this.qrErrorCorrection()
      };

      const svgString = await QRCode.toString(data, options);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.svg`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);

      this.snackbar.success('QR code downloaded!', 2000);
    } catch (error) {
      console.error('SVG generation error:', error);
      this.snackbar.error('Failed to generate SVG', 3000);
    }
  }

  /**
   * Copy QR code image to clipboard
   */
  async copyImage(): Promise<void> {
    const dataUrl = this.qrDataUrl();
    if (!dataUrl) {
      this.snackbar.warning('No QR code to copy', 2000);
      return;
    }

    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);

      this.snackbar.success('QR code copied to clipboard!', 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
      this.snackbar.error('Failed to copy to clipboard', 3000);
    }
  }

  /**
   * Copy encoded data to clipboard
   */
  async copyData(): Promise<void> {
    const data = this.encodedData();
    if (!data) {
      this.snackbar.warning('No data to copy', 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(data);
      this.snackbar.success('Data copied to clipboard!', 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
      this.snackbar.error('Failed to copy to clipboard', 3000);
    }
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    this.selectedType.set('text');
    this.textInput.set('');
    this.urlInput.set('https://');
    this.emailAddress.set('');
    this.emailSubject.set('');
    this.emailBody.set('');
    this.phoneNumber.set('');
    this.smsNumber.set('');
    this.smsMessage.set('');
    this.wifiSSID.set('');
    this.wifiPassword.set('');
    this.wifiSecurity.set('WPA');
    this.wifiHidden.set(false);
    this.vcardName.set('');
    this.vcardOrganization.set('');
    this.vcardPhone.set('');
    this.vcardEmail.set('');
    this.vcardWebsite.set('');
    this.qrSize.set(512);
    this.qrMargin.set(1);
    this.qrForeground.set('#000000');
    this.qrBackground.set('#FFFFFF');
    this.qrErrorCorrection.set('M');

    this.snackbar.success('Reset to defaults', 2000);
  }

  /**
   * Format slider label
   */
  formatLabel(value: number): string {
    return `${value}`;
  }

  /**
   * Update QR size
   */
  updateSize(value: number): void {
    this.qrSize.set(value);
  }

  /**
   * Update QR margin
   */
  updateMargin(value: number): void {
    this.qrMargin.set(value);
  }

  scrollToGenerator(): void {
    const element = document.querySelector('.qr-generator-layout');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}