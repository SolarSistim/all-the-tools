import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
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
    MatButtonModule,
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
          <p class="account-subtitle">
            <span class="user-email">{{ user.email }}</span>
            <span class="subtitle-separator">|</span>
            <button mat-button class="logout-btn" (click)="logout()">Log Out</button>
          </p>
        }
      </div>

      <mat-card class="account-card">
        <mat-card-content>
          <mat-tab-group [selectedIndex]="selectedTabIndex()" (selectedIndexChange)="onTabChange($event)" animationDuration="300ms">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>notifications</mat-icon>
                <span style="font-weight: bold">News & Updates</span>
              </ng-template>
              <app-news-tab />
            </mat-tab>

            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>person</mat-icon>
                <span style="font-weight: bold">Profile & Account</span>
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
        color: var(--text-primary);

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
      }

      .account-subtitle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin: 0;

        .subtitle-separator {
          opacity: 0.4;
        }

        .logout-btn {
          color: var(--text-secondary);
          font-size: 1.1rem;
          min-width: unset;
          height: unset;
          line-height: unset;
          padding: 0;
          letter-spacing: inherit;

          &:hover {
            color: #f44336;
            background: transparent;
          }
        }
      }
    }

    .account-card {
      background-color: var(--bg-elevated) !important;

      ::ng-deep .mat-mdc-card-surface {
        background-color: var(--bg-elevated) !important;
      }

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

    :host-context(body:not(.light-theme)) ::ng-deep .mdc-tab-indicator__content--underline {
      border-color: #6dd4ff !important;
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
export class AccountComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user$ = this.authService.user$;
  selectedTabIndex = signal(0);

  private readonly TAB_ROUTES = ['news', 'profile'];

  ngOnInit() {
    const tab = this.route.snapshot.paramMap.get('tab');
    const index = this.TAB_ROUTES.indexOf(tab ?? '');
    this.selectedTabIndex.set(index >= 0 ? index : 0);
  }

  onTabChange(index: number) {
    this.selectedTabIndex.set(index);
    this.router.navigate(['/account', this.TAB_ROUTES[index]], { replaceUrl: true });
  }

  logout() {
    this.authService.logout();
  }
}
