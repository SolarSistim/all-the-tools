import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface InputDialogData {
  title?: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

@Component({
  selector: 'app-input-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>{{ data.icon || 'edit' }}</mat-icon>
        {{ data.title || 'Enter Value' }}
      </h2>
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
        <mat-form-field appearance="fill" class="input-field">
          <mat-label>{{ data.placeholder || 'Value' }}</mat-label>
          <input matInput [(ngModel)]="inputValue" (keyup.enter)="onConfirm()" autofocus />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!inputValue" class="confirm-button">
          {{ data.confirmText || 'OK' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
      background: var(--bg-elevated, #1a1a1a);
      color: var(--text-primary, #ffffff);
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      min-width: 400px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--neon-cyan) 0%, var(--neon-pink) 100%);
        opacity: 0.7;
      }
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Orbitron', sans-serif !important;
      margin-bottom: 16px;
      color: #ffffff !important;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: #ffffff !important;
      }
    }
    .dialog-content {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary, #b0b0b0);
      margin-bottom: 8px;

      p {
        margin: 0 0 16px 0;
      }
    }
    .input-field {
      width: 100%;
      font-family: 'Space Grotesk', sans-serif !important;
    }
    .dialog-actions {
      padding: 16px 0 0 0;
      gap: 12px;
    }
    .cancel-button {
      font-family: 'Space Grotesk', sans-serif !important;
      font-weight: 600 !important;
      color: var(--text-secondary, #b0b0b0) !important;
    }
    .confirm-button {
      font-family: 'Space Grotesk', sans-serif !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 24px !important;
      height: 44px !important;
      background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-pink) 100%) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(0, 188, 212, 0.4) !important;
      border: none !important;
      transition: all 0.3s ease !important;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 188, 212, 0.5) !important;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `]
})
export class InputDialogComponent {
  inputValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {
    this.inputValue = data.defaultValue || '';
  }

  onConfirm(): void {
    if (this.inputValue) {
      this.dialogRef.close(this.inputValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
