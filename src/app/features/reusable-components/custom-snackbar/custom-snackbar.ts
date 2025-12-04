import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface SnackbarData {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  icon?: string;
  action?: string;
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss'
})
export class CustomSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    public snackBarRef: MatSnackBarRef<CustomSnackbar>
  ) {
    // Set default icon based on type if not provided
    if (!this.data.icon) {
      this.data.icon = this.getDefaultIcon(this.data.type);
    }
  }

  private getDefaultIcon(type?: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
