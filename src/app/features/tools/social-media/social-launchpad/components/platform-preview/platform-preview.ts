import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PLATFORM_CONFIGS, PlatformId } from '../../models/platform.model';

export interface PlatformPreviewData {
  platformId: PlatformId;
  formattedText: string;
  characterCount: number;
  shareUrl: string;
}

@Component({
  selector: 'app-platform-preview',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './platform-preview.html',
  styleUrl: './platform-preview.scss'
})
export class PlatformPreviewComponent {
  platformConfig;

  constructor(
    public dialogRef: MatDialogRef<PlatformPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlatformPreviewData
  ) {
    this.platformConfig = PLATFORM_CONFIGS[this.data.platformId];
  }

  async copyText(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.data.formattedText);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  openInPlatform(): void {
    window.open(this.data.shareUrl, '_blank');
  }

  close(): void {
    this.dialogRef.close();
  }
}
