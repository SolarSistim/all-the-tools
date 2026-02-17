import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { UserListComponent } from './components/user-list/user-list.component';

/**
 * Admin Dashboard Component
 * Main container for admin-only features
 * Protected by adminGuard in routes
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    UserListComponent
  ],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>
          <mat-icon>admin_panel_settings</mat-icon>
          Admin Dashboard
        </h1>
        @if (user$ | async; as user) {
          <p class="admin-subtitle">{{ user.email }}</p>
        }
      </div>

      <mat-card class="admin-card">
        <mat-card-content>
          <app-user-list />
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .admin-header {
      margin-bottom: 2rem;
      text-align: center;

      h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 2rem;
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      .admin-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin: 0;
      }
    }

    .admin-card {
      background-color: var(--bg-elevated) !important;

      ::ng-deep .mat-mdc-card-surface {
        background-color: var(--bg-elevated) !important;
      }

      mat-card-content {
        padding: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .admin-container {
        margin: 1rem auto;
      }

      .admin-header h1 {
        font-size: 1.5rem;

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
        }
      }

      .admin-card mat-card-content {
        padding: 1rem;
      }
    }
  `]
})
export class AdminComponent {
  private authService = inject(AuthService);
  user$ = this.authService.user$;
}
