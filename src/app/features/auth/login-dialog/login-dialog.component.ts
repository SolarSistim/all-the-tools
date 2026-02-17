import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { AlertDanger } from '../../reusable-components/alerts/alert-danger/alert-danger';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    AlertDanger
  ],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loading = false;
  errorMessage = '';

  async onGoogleLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithGoogle();
      this.dialogRef.close();
    } catch (error: any) {
      this.errorMessage = error.message || 'Google login failed. Please try again.';
      this.loading = false;
    }
  }

  async onGithubLogin() {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithGithub();
      this.dialogRef.close();
    } catch (error: any) {
      this.errorMessage = error.message || 'GitHub login failed. Please try again.';
      this.loading = false;
    }
  }
}
