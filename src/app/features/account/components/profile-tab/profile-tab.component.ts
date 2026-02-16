import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountService } from '../../services/account.service';

/**
 * Confirmation Dialog Component
 */
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      Confirm Account Deletion
    </h2>
    <mat-dialog-content>
      <p><strong>Are you absolutely sure you want to delete your account?</strong></p>
      <p>This action cannot be undone. All your data will be permanently deleted.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Delete My Account
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    mat-dialog-content {
      min-width: 300px;

      p {
        margin: 0.5rem 0;
      }

      strong {
        color: #f44336;
      }
    }
  `]
})
export class ConfirmDeleteDialogComponent {}

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
                {{ user.user_metadata?.full_name || 'Not set' }}
              </div>
            </div>

            <div class="profile-field">
              <label>Account Created</label>
              <div class="field-value">{{ formatDate(user.created_at) }}</div>
            </div>

            <div class="profile-field">
              <label>Role</label>
              <div class="field-value">
                <mat-chip-set>
                  @for (role of getUserRoles(); track role) {
                    <mat-chip [highlighted]="role === 'admin'">
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
                  <mat-icon>check_circle</mat-icon>
                  Ad-Free Active
                </mat-chip>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Password Management Section -->
        <mat-card class="profile-section">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>lock</mat-icon>
              Password & Security
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="section-description">
              Manage your password and security settings
            </p>
            <button mat-raised-button color="primary" (click)="changePassword()">
              <mat-icon>vpn_key</mat-icon>
              Change Password
            </button>
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
            <p class="section-description">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button mat-raised-button color="warn" (click)="deleteAccount()">
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
          color: rgba(255, 255, 255, 0.7);
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
        color: rgba(255, 255, 255, 0.7);
      }

      .field-value {
        color: white;
      }
    }

    .ad-free-badge {
      background-color: #4caf50;
      color: white;

      mat-icon {
        margin-right: 0.25rem;
      }
    }

    .danger-section {
      border: 2px solid #f44336;

      mat-card-header mat-card-title {
        color: #f44336;
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

  getUserRoles(): string[] {
    return this.authService.getUserRoles();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async changePassword() {
    const user = this.authService.getCurrentUser();
    if (!user?.email) {
      console.error('No user email found');
      return;
    }

    try {
      await this.authService.requestPasswordReset(user.email);
      // Show success message to user
      alert('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset failed:', error);
      alert(error.message || 'Failed to send password reset email');
    }
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.accountService.deleteAccount().subscribe({
          next: () => {
            // Logout and redirect to home
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
