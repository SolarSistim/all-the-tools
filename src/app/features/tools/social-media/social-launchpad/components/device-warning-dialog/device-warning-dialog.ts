import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-device-warning-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>desktop_windows</mat-icon>
        Desktop Recommended
      </h2>
      <mat-dialog-content class="dialog-content">
        <p>This tool is best experienced on a desktop PC for optimal layout and platform interaction.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-raised-button color="primary" mat-dialog-close class="understand-button">
          I understand
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
    }
    .dialog-actions {
      padding: 16px 0 0 0;
    }
    .understand-button {
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
export class DeviceWarningDialogComponent { }
