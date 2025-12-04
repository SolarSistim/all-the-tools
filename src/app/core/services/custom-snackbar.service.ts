import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbar, SnackbarData } from '../../features/reusable-components/custom-snackbar/custom-snackbar';

@Injectable({
  providedIn: 'root'
})
export class CustomSnackbarService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['custom-snackbar-container']
  };

  /**
   * Show a custom snackbar
   */
  show(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) {
    const data: SnackbarData = {
      message,
      type: type || 'info'
    };

    const config = {
      ...this.defaultConfig,
      duration: duration !== undefined ? duration : this.defaultConfig.duration,
      data
    };

    return this.snackBar.openFromComponent(CustomSnackbar, config);
  }

  /**
   * Show a success snackbar
   */
  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  /**
   * Show an error snackbar
   */
  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  /**
   * Show a warning snackbar
   */
  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  /**
   * Show an info snackbar
   */
  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  /**
   * Show a custom snackbar with custom icon
   */
  showWithIcon(message: string, icon: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) {
    const data: SnackbarData = {
      message,
      type: type || 'info',
      icon
    };

    const config = {
      ...this.defaultConfig,
      duration: duration !== undefined ? duration : this.defaultConfig.duration,
      data
    };

    return this.snackBar.openFromComponent(CustomSnackbar, config);
  }

  /**
   * Dismiss all snackbars
   */
  dismiss() {
    this.snackBar.dismiss();
  }
}
