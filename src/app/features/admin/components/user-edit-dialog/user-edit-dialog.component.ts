import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NetlifyUser } from '../../../../core/models/user.interface';

export interface UserEditDialogData {
  user: NetlifyUser;
}

export interface UserEditDialogResult {
  roles: string[];
}

/**
 * User Edit Dialog Component
 * Dialog for editing user roles (admin assignment)
 */
@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>edit</mat-icon>
      Edit User Roles
    </h2>

    <mat-dialog-content>
      <div class="user-info">
        <p><strong>Email:</strong> {{ data.user.email }}</p>
        <p><strong>User ID:</strong> {{ data.user.id }}</p>
      </div>

      <div class="roles-section">
        <h3>Roles</h3>
        <mat-checkbox
          [(ngModel)]="isAdmin"
          (change)="onRoleChange()"
        >
          Admin
        </mat-checkbox>
        <p class="role-description">
          Admins can manage users and access the admin dashboard
        </p>

        <mat-checkbox
          [checked]="true"
          [disabled]="true"
        >
          User
        </mat-checkbox>
        <p class="role-description">
          All accounts have the user role by default
        </p>
      </div>

      <div class="warning" *ngIf="isAdmin">
        <mat-icon>warning</mat-icon>
        <p>Admin users have full access to user management and admin features.</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="save()"
        [disabled]="!hasChanges()"
      >
        Save Changes
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
      min-width: 400px;
      padding: 1rem 0;
    }

    .user-info {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;

      p {
        margin: 0.5rem 0;

        strong {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }

    .roles-section {
      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }

      mat-checkbox {
        display: block;
        margin: 0.75rem 0;
      }

      .role-description {
        margin: 0 0 1rem 0;
        padding-left: 2rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .warning {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background-color: rgba(255, 152, 0, 0.1);
      border-left: 4px solid #ff9800;
      border-radius: 4px;

      mat-icon {
        color: #ff9800;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: 300px;
      }
    }
  `]
})
export class UserEditDialogComponent {
  private dialogRef = inject(MatDialogRef<UserEditDialogComponent>);

  isAdmin: boolean;
  private originalIsAdmin: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserEditDialogData) {
    // Initialize admin status from user data
    const roles = data.user.app_metadata?.roles || [];
    this.isAdmin = roles.includes('admin');
    this.originalIsAdmin = this.isAdmin;
  }

  onRoleChange() {
    // Role changed
  }

  hasChanges(): boolean {
    return this.isAdmin !== this.originalIsAdmin;
  }

  save() {
    const roles: string[] = ['user']; // All users have 'user' role

    if (this.isAdmin) {
      roles.push('admin');
    }

    const result: UserEditDialogResult = { roles };
    this.dialogRef.close(result);
  }
}
