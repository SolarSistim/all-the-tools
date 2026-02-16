import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';
import { NewsTabComponent } from './components/news-tab/news-tab.component';
import { ProfileTabComponent } from './components/profile-tab/profile-tab.component';

/**
 * My Account Component
 * Container for user account management with tabbed interface
 * Protected by authGuard in routes
 */
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    NewsTabComponent,
    ProfileTabComponent
  ],
  template: `
    <div class="account-container">
      <div class="account-header">
        <h1>
          <mat-icon>account_circle</mat-icon>
          My Account
        </h1>
        @if (user$ | async; as user) {
          <p class="account-subtitle">{{ user.email }}</p>
        }
      </div>

      <mat-card class="account-card">
        <mat-card-content>
          <mat-tab-group [(selectedIndex)]="selectedTabIndex" animationDuration="300ms">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>notifications</mat-icon>
                <span>News & Updates</span>
              </ng-template>
              <app-news-tab />
            </mat-tab>

            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>person</mat-icon>
                <span>Profile & Account</span>
              </ng-template>
              <app-profile-tab />
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .account-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .account-header {
      margin-bottom: 2rem;
      text-align: center;

      h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 2rem;
        margin: 0 0 0.5rem 0;

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      .account-subtitle {
        color: rgba(255, 255, 255, 0.7);
        font-size: 1.1rem;
        margin: 0;
      }
    }

    .account-card {
      mat-card-content {
        padding: 0;
      }

      ::ng-deep {
        .mat-mdc-tab-group {
          .mat-mdc-tab-labels {
            padding: 0 1rem;
          }

          .mat-mdc-tab-label {
            min-width: 160px;
            padding: 0 1rem;

            mat-icon {
              margin-right: 0.5rem;
            }
          }

          .mat-mdc-tab-body-wrapper {
            padding: 2rem 1rem;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .account-container {
        margin: 1rem auto;
      }

      .account-header h1 {
        font-size: 1.5rem;

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
        }
      }

      ::ng-deep {
        .mat-mdc-tab-label {
          min-width: auto !important;
          padding: 0 0.5rem !important;
          font-size: 0.9rem;

          mat-icon {
            margin-right: 0.25rem;
          }

          span {
            display: none;
          }
        }
      }
    }
  `]
})
export class AccountComponent {
  private authService = inject(AuthService);

  user$ = this.authService.user$;
  selectedTabIndex = signal(0);
}
