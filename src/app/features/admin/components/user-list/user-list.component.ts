import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { NetlifyUser } from '../../../../core/models/user.interface';
import { UserEditDialogComponent, UserEditDialogResult } from '../user-edit-dialog/user-edit-dialog.component';

/**
 * User List Component
 * Displays all users in a Material table with admin management actions
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="user-list">
      <div class="list-header">
        <h3>
          <mat-icon>people</mat-icon>
          User Management
        </h3>
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Search users</mat-label>
          <input
            matInput
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterUsers()"
            placeholder="Search by email or name..."
          >
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading users...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <p>Failed to load users</p>
          <button mat-raised-button (click)="loadUsers()">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
        </div>
      } @else {
        <div class="user-stats">
          <span>Total Users: {{ totalUsers() }}</span>
          <span>Filtered: {{ filteredUsers().length }}</span>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="filteredUsers()" class="users-table">
            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">
                {{ user.user_metadata?.full_name || '-' }}
              </td>
            </ng-container>

            <!-- Roles Column -->
            <ng-container matColumnDef="roles">
              <th mat-header-cell *matHeaderCellDef>Roles</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip-set>
                  @for (role of getUserRoles(user); track role) {
                    <mat-chip [highlighted]="role === 'admin'">
                      {{ role }}
                    </mat-chip>
                  }
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Created Date Column -->
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let user">
                {{ formatDate(user.created_at) }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button
                  mat-icon-button
                  (click)="editUser(user)"
                  matTooltip="Edit roles"
                >
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        @if (filteredUsers().length === 0) {
          <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <p>No users found matching your search</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .user-list {
      padding: 1rem 0;
    }

    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;

      h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 1.3rem;

        mat-icon {
          font-size: 1.8rem;
          width: 1.8rem;
          height: 1.8rem;
        }
      }

      .search-field {
        min-width: 300px;
      }
    }

    .user-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      font-size: 0.9rem;

      span {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .loading-state,
    .error-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;

      mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        opacity: 0.5;
        margin-bottom: 1rem;
      }

      p {
        margin: 0.5rem 0;
        opacity: 0.7;
      }

      button {
        margin-top: 1rem;
      }
    }

    .table-container {
      overflow-x: auto;
      background-color: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
    }

    .users-table {
      width: 100%;

      th {
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }

      td, th {
        padding: 1rem;
      }

      tr:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: stretch;

        .search-field {
          min-width: auto;
        }
      }

      .user-stats {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);

  users = signal<NetlifyUser[]>([]);
  filteredUsers = signal<NetlifyUser[]>([]);
  loading = signal(true);
  error = signal(false);
  totalUsers = signal(0);
  searchTerm = '';

  displayedColumns = ['email', 'name', 'roles', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(false);

    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.filteredUsers.set(response.users);
        this.totalUsers.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredUsers.set(this.users());
      return;
    }

    const filtered = this.users().filter(user => {
      const email = user.email?.toLowerCase() || '';
      const name = user.user_metadata?.full_name?.toLowerCase() || '';
      return email.includes(term) || name.includes(term);
    });

    this.filteredUsers.set(filtered);
  }

  getUserRoles(user: NetlifyUser): string[] {
    return user.app_metadata?.roles || ['user'];
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  editUser(user: NetlifyUser) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result: UserEditDialogResult | null) => {
      if (result) {
        this.adminService.updateUserRoles(user.id, result.roles).subscribe({
          next: () => {
            // Reload users to reflect changes
            this.loadUsers();
          },
          error: (err) => {
            console.error('Failed to update user roles:', err);
            alert('Failed to update user roles. Please try again.');
          }
        });
      }
    });
  }
}
