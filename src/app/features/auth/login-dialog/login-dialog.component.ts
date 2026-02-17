import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  dialogData = inject<{ recoveryToken?: string } | null>(MAT_DIALOG_DATA, { optional: true });

  loginForm: FormGroup;
  signupForm: FormGroup;
  resetForm: FormGroup;
  recoveryForm: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';
  signupCompleted = false;
  selectedTabIndex = 0;
  showForgotPassword = false;

  resetLoading = false;
  resetErrorMessage = '';
  resetSuccessMessage = '';

  get isRecoveryMode(): boolean {
    return !!this.dialogData?.recoveryToken;
  }

  get dialogTitle(): string {
    if (this.isRecoveryMode) return 'Set New Password';
    if (this.showForgotPassword) return 'Reset Password';
    return this.selectedTabIndex === 0 ? 'Welcome Back' : 'Create Account';
  }

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

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.recoveryForm = this.fb.group({
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
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.loginWithEmail(email, password);
      this.dialogRef.close();
      window.location.reload();
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  async onSignup() {
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email, password } = this.signupForm.value;
      await this.authService.signupWithEmail(email, password);
      this.successMessage = 'Account created! Please check your email to confirm your account.';
      this.signupCompleted = true;
      this.signupForm.reset();
    } catch (error: any) {
      this.errorMessage = error.message || 'Signup failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

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

  openForgotPassword() {
    this.showForgotPassword = true;
    this.resetForm.reset();
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';
    // Pre-fill email if the user already typed it in the login form
    const loginEmail = this.loginForm.get('email')?.value;
    if (loginEmail) {
      this.resetForm.patchValue({ email: loginEmail });
    }
  }

  backToLogin() {
    this.showForgotPassword = false;
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';
  }

  async onResetPassword() {
    if (this.resetForm.invalid) return;

    this.resetLoading = true;
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';

    try {
      const { email } = this.resetForm.value;
      await this.authService.requestPasswordReset(email);
      this.resetSuccessMessage = 'If that email is registered, you\'ll receive a password reset link shortly.';
      this.resetForm.reset();
    } catch (error: any) {
      this.resetErrorMessage = error.message || 'Failed to send reset email. Please try again.';
    } finally {
      this.resetLoading = false;
    }
  }

  async onSetNewPassword() {
    if (this.recoveryForm.invalid || !this.dialogData?.recoveryToken) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { password } = this.recoveryForm.value;
      await this.authService.setNewPassword(this.dialogData.recoveryToken, password);
      this.successMessage = 'Password updated! You are now logged in.';
      setTimeout(() => this.dialogRef.close(), 2000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to update password. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
