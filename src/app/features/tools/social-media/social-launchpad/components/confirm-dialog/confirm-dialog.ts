import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>{{ data.icon || 'help_outline' }}</mat-icon>
        {{ data.title || 'Confirm' }}
      </h2>
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-raised-button color="primary" (click)="onConfirm()" class="confirm-button">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-dialog-container {
      border: none !important;
      border-radius: 8px !important;
    }

    ::ng-deep .mat-mdc-dialog-inner-container,
    ::ng-deep .mdc-dialog__container {
      border: none !important;
      border-radius: 0 !important;
    }

    ::ng-deep .mat-mdc-dialog-surface,
    ::ng-deep .mdc-dialog__surface {
      border: none !important;
      border-radius: 8px !important;
    }

    .dialog-container {
      padding: 16px;
      background: var(--bg-elevated, #1a1a1a);
      color: var(--text-primary, #ffffff);
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      min-width: 400px;
      max-width: calc(100vw - 32px);
      border: none;

      @media (max-width: 480px) {
        min-width: unset;
        width: calc(100vw - 32px);
        padding: 12px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg,
          var(--neon-cyan) 0%,
          var(--neon-pink) 50%,
          var(--amber) 100%
        );
      }
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Orbitron', sans-serif !important;
      margin-bottom: 16px;
      color: var(--text-primary, #ffffff) !important;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: var(--text-primary, #ffffff) !important;
      }
    }
    .dialog-content {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary, #b0b0b0);
      margin-bottom: 8px;

      p {
        margin: 0;
      }
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

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 188, 212, 0.5) !important;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
