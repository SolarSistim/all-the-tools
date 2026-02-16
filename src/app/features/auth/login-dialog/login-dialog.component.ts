import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../core/services/auth.service';
import { AlertSuccess } from '../../reusable-components/alerts/alert-success/alert-success';
import { AlertDanger } from '../../reusable-components/alerts/alert-danger/alert-danger';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    AlertSuccess,
    AlertDanger
  ],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loginForm: FormGroup;
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  signupCompleted = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async onLogin() {
    console.log('[LoginDialog] onLogin called');
    if (this.loginForm.invalid) {
      console.log('[LoginDialog] Form invalid, aborting');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      console.log('[LoginDialog] Calling authService.loginWithEmail');
      await this.authService.loginWithEmail(email, password);
      console.log('[LoginDialog] Login successful, closing dialog');
      this.dialogRef.close();
      // Reload to get fresh authenticated state
      window.location.reload();
    } catch (error: any) {
      console.error('[LoginDialog] Login error:', error);
      this.errorMessage = error.message || 'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  async onSignup() {
    console.log('[LoginDialog] onSignup called');
    if (this.signupForm.invalid) {
      console.log('[LoginDialog] Signup form invalid, aborting');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email, password } = this.signupForm.value;
      console.log('[LoginDialog] Calling authService.signupWithEmail');
      await this.authService.signupWithEmail(email, password);
      console.log('[LoginDialog] Signup successful');
      this.successMessage = 'Account created! Please check your email to confirm your account.';
      this.signupCompleted = true;
      this.signupForm.reset();
    } catch (error: any) {
      console.error('[LoginDialog] Signup error:', error);
      this.errorMessage = error.message || 'Signup failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async onGoogleLogin() {
    console.log('[LoginDialog] onGoogleLogin called');
    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('[LoginDialog] Calling authService.loginWithGoogle');
      await this.authService.loginWithGoogle();
      console.log('[LoginDialog] loginWithGoogle completed, closing dialog');
      this.dialogRef.close();
      // The OAuth flow will redirect and reload the page automatically
    } catch (error: any) {
      console.error('[LoginDialog] Google login error caught:', error);
      this.errorMessage = error.message || 'Google login failed. Please try again.';
      this.loading = false;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
