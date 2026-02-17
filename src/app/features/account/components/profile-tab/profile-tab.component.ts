import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountService } from '../../services/account.service';

/**
 * Confirmation Dialog Component — styled to match the Sign In dialog.
 */
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="accent-glow"></div>

      <h2 mat-dialog-title>
        <span class="title-text">Delete Account</span>
        <button mat-icon-button (click)="dialogRef.close(false)" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </h2>

      <mat-dialog-content>
        <div class="dialog-body">
          <div class="warning-icon-wrap">
            <mat-icon class="warning-icon">warning_amber</mat-icon>
          </div>
          <p class="warning-title">Are you absolutely sure?</p>
          <p class="warning-text">
            All your data will be permanently deleted and cannot be recovered.
          </p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-flat-button class="cancel-btn" (click)="dialogRef.close(false)">
          Cancel
        </button>
        <button mat-flat-button class="delete-btn" (click)="dialogRef.close(true)">
          <mat-icon>delete_forever</mat-icon>
          Delete My Account
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      position: relative;
      overflow: hidden;

      .accent-glow {
        position: absolute;
        top: -100px;
        right: -100px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(211, 47, 47, 0.2) 0%, transparent 70%);
        z-index: 0;
        pointer-events: none;
      }

      ::ng-deep h2[mat-dialog-title] {
        padding: 0.5rem 0 1.5rem !important;
        margin: 0 !important;
        border-bottom: none !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .title-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          flex: 1;
          margin-left: 20px;
        }

        .close-button {
          background: transparent;
          mat-icon {
            font-size: 20px;
            color: var(--text-primary);
          }
        }
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 0.5rem 0 1.5rem;

        .warning-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(211, 47, 47, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.25rem;

          .warning-icon {
            font-size: 38px;
            width: 38px;
            height: 38px;
            color: #ef5350;
          }
        }

        .warning-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .warning-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 300px;
        }
      }

      ::ng-deep mat-dialog-actions {
        padding: 0 !important;
        margin: 0 !important;
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .cancel-btn {
        height: 48px;
        border-radius: 12px !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.08)) !important;
        color: var(--text-primary) !important;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
      }

      .delete-btn {
        height: 48px;
        border-radius: 12px !important;
        background: #d32f2f !important;
        color: #fff !important;
        font-weight: 600;
        transition: background 0.2s ease;

        mat-icon {
          color: #fff !important;
          margin-right: 4px;
        }

        &:hover {
          background: #b71c1c !important;
        }
      }
    }

    :host-context(body.light-theme) {
      .cancel-btn {
        background: rgba(0, 0, 0, 0.04) !important;
        border-color: rgba(0, 0, 0, 0.12) !important;

        &:hover {
          background: rgba(0, 0, 0, 0.08) !important;
        }
      }
    }
  `]
})
export class ConfirmDeleteDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent>);
}

/**
 * Profile Tab Component
 * User profile information and account management
 */
@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  template: `
    <div class="profile-tab">
      <div class="tab-header">
        <h2>Profile & Account</h2>
      </div>

      @if (user$ | async; as user) {
        <!-- Profile Information Section -->
        <mat-card class="profile-section">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              Profile Information
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="profile-field">
              <label>Email</label>
              <div class="field-value">{{ user.email }}</div>
            </div>

            <div class="profile-field">
              <label>Name</label>
              <div class="field-value">
                {{ getUserName(user) }}
              </div>
            </div>

            <div class="profile-field">
              <label>Account Created</label>
              <div class="field-value">{{ formatDate(user.created_at) }}</div>
            </div>

            <div class="profile-field">
              <label>Sign-in Method</label>
              <div class="field-value provider-field">
                @if (getProvider(user) === 'google') {
                  <svg class="provider-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                } @else if (getProvider(user) === 'github') {
                  <svg class="provider-icon github-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                } @else {
                  <span>{{ getProvider(user) || 'Unknown' }}</span>
                }
              </div>
            </div>

            <div class="profile-field">
              <label>Current session</label>
              <div class="field-value">
                <button mat-button class="logout-link" (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  Log Out
                </button>
              </div>
            </div>

            <div class="profile-field">
              <label>Role</label>
              <div class="field-value">
                <mat-chip-set>
                  @for (role of getUserRoles(); track role) {
                    <mat-chip [class.admin-chip]="role === 'admin'">
                      {{ role }}
                    </mat-chip>
                  }
                </mat-chip-set>
              </div>
            </div>

            <div class="profile-field">
              <label>Status</label>
              <div class="field-value">
                <mat-chip class="ad-free-badge" highlighted>
                  <mat-icon class="status-icon">check_circle</mat-icon>
                  Ad-Free Active
                </mat-chip>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Account Management Section -->
        <mat-card class="profile-section danger-section">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>warning</mat-icon>
              Danger Zone
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-checkbox class="danger-confirm" (change)="confirmDelete = $event.checked">
              I understand that this will permanently delete my account and all associated data. This action cannot be undone.
            </mat-checkbox>
            <button mat-flat-button class="delete-button" [disabled]="!confirmDelete" (click)="deleteAccount()">
              <mat-icon>delete_forever</mat-icon>
              Delete My Account
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .profile-tab {
      padding: 1rem 0;
    }

    .tab-header {
      margin-bottom: 1.5rem;

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }
    }

    .profile-section {
      margin-bottom: 1.5rem;

      mat-card-header {
        margin-bottom: 1rem;

        mat-card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;

          mat-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      }

      mat-card-content {
        .section-description {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
        }
      }
    }

    .profile-field {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      &:last-child {
        border-bottom: none;
      }

      label {
        font-weight: 500;
        color: var(--text-secondary);
      }

      .field-value {
        color: var(--text-primary);
      }
    }

    .logout-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0 0.5rem 0 0;
      color: var(--text-primary);
      font-size: 0.9rem;
      min-width: unset;
      height: unset;
      line-height: unset;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &:hover {
        color: #f44336;
        background: transparent;

        mat-icon {
          color: #f44336;
        }
      }
    }

    .provider-field {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .provider-icon {
        display: block;
      }

      .github-icon {
        color: #fff;
      }
    }

    ::ng-deep .admin-chip {
      border: 1px solid rgba(255, 255, 255, 0.45) !important;
    }

    .ad-free-badge {
      .status-icon {
        color: #4caf50 !important;
        position: relative;
        top: 5px;
        margin-right: 0.25rem;
      }

      ::ng-deep .mdc-evolution-chip__action {
        padding-left: 0 !important;
      }
    }

    .danger-section {
      border: 2px solid #f44336;

      mat-card-header mat-card-title {
        color: #f44336;
      }

      mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
    }

    .danger-confirm {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .delete-button {
      align-self: flex-start;
      background-color: #d32f2f !important;
      color: #fff !important;

      mat-icon {
        color: #fff !important;
      }

      &[disabled] {
        background-color: rgba(211, 47, 47, 0.3) !important;
        color: rgba(255, 255, 255, 0.4) !important;

        mat-icon {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      }
    }

    @media (max-width: 768px) {
      .profile-field {
        grid-template-columns: 1fr;
        gap: 0.25rem;

        label {
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class ProfileTabComponent {
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  user$ = this.authService.user$;
  confirmDelete = false;

  getUserRoles(): string[] {
    return this.authService.getUserRoles();
  }

  getUserName(user: any): string {
    return user?.user_metadata?.full_name
      || user?.user_metadata?.name
      || user?.user_metadata?.user_name
      || '';
  }

  getProvider(user: any): string {
    return user?.app_metadata?.provider || '';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout() {
    this.authService.logout();
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '440px',
      maxWidth: '95vw',
      panelClass: 'login-dialog-container',
      backdropClass: 'glass-dialog-backdrop'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accountService.deleteAccount().subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Failed to delete account:', err);
            alert('Failed to delete account. Please try again or contact support.');
          }
        });
      }
    });
  }
}
