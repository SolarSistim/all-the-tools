import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountService } from '../../services/account.service';
import { NewsItem } from '../../models/news-item.interface';

@Component({
  selector: 'app-news-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="news-tab">
      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading news...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <p>Failed to load news items</p>
          <button mat-raised-button color="primary" class="cta-button" (click)="loadNews()">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
        </div>
      } @else if (newsItems().length === 0) {
        <div class="empty-state">
          <mat-icon>notifications_none</mat-icon>
          <p>No news items yet</p>
          <p class="empty-subtitle">Check back later for announcements and updates</p>
        </div>
      } @else {
        <div class="news-masonry">
          @for (item of newsItems(); track item.id) {
            <div class="news-card" [class.unread]="!item.isRead">

              <!-- Card Header: image or gradient -->
              <div
                class="card-header"
                [class.has-image]="item.imageUrl"
                [style.background-image]="item.imageUrl ? 'url(' + item.imageUrl + ')' : null"
              >
                @if (item.imageUrl) {
                  <div class="image-overlay"></div>
                }
                <div class="header-content">
                  @if (!item.imageUrl) {
                    <mat-icon class="header-icon">{{ getTypeIcon(item.type) }}</mat-icon>
                  }
                  <span class="type-badge type-badge-{{ item.type }}">{{ item.typeLabel || item.type }}</span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <div class="card-meta">
                  <span class="card-date">{{ formatDate(item.createdAt) }}</span>
                  @if (!item.isRead) {
                    <button
                      mat-icon-button
                      class="mark-read-btn"
                      matTooltip="Mark as read"
                      (click)="markAsRead(item.id)"
                    >
                      <mat-icon>done</mat-icon>
                    </button>
                  }
                </div>
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-message">{{ item.message }}</p>
                @if (item.link) {
                  <a
                    [href]="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    mat-button
                    color="primary"
                    class="card-link-btn"
                  >
                    {{ item.linkLabel || 'Read more' }}
                    <mat-icon>open_in_new</mat-icon>
                  </a>
                }
              </div>

            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .news-tab {
      padding: 1rem 0;
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

      .empty-subtitle {
        font-size: 0.9rem;
      }

      .cta-button {
        margin-top: 1rem;
        padding: 12px 32px;
        font-size: 1rem;
        font-weight: 600;
        text-transform: none;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    /* ── Masonry layout ── */
    .news-masonry {
      column-count: 3;
      column-gap: 1.25rem;

      @media (max-width: 768px) { column-count: 2; }
      @media (max-width: 480px) { column-count: 1; }
    }

    .news-card {
      break-inside: avoid;
      display: inline-block;
      width: 100%;
      margin-bottom: 1.25rem;
      background: var(--bg-elevated);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      box-shadow: 0 2px 8px var(--shadow-color);
      vertical-align: top;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px var(--shadow-color);
        border-color: var(--neon-cyan);
      }

      &.unread {
        border-color: rgba(109, 212, 255, 0.4);
      }
    }

    /* ── Card Header ── */
    .card-header {
      position: relative;
      width: 100%;
      height: 160px;
      overflow: hidden;
      background: linear-gradient(210deg, var(--neon-cyan) 0%, var(--neon-pink) 100%);
      display: flex;
      align-items: flex-end;
      padding: 1rem;

      &.has-image {
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%);
      }

      .header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .header-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          color: rgba(255, 255, 255, 0.9);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
      }
    }

    .type-badge {
      margin-left: auto;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      border-radius: 6px;
      color: white;

      &.type-badge-success { background: rgba(76, 175, 80, 0.85); }
      &.type-badge-info    { background: rgba(33, 150, 243, 0.85); }
      &.type-badge-warning { background: rgba(255, 152, 0, 0.85); }
      &.type-badge-error   { background: rgba(244, 67, 54, 0.85); }
    }

    /* ── Card Body ── */
    .card-body {
      padding: 1rem 1.25rem 1.25rem;

      .card-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.4rem;

        .card-date {
          font-size: 0.78rem;
          color: var(--text-secondary);
          opacity: 0.65;
        }

        .mark-read-btn {
          width: 28px;
          height: 28px;
          line-height: 28px;

          ::ng-deep mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: var(--neon-cyan);
          }
        }
      }

      .card-title {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.4;
        color: var(--text-primary);
      }

      .card-message {
        margin: 0 0 0.75rem;
        font-size: 0.875rem;
        line-height: 1.65;
        color: var(--text-secondary);
      }

      .card-link-btn {
        padding: 0;
        min-width: auto;
        font-size: 0.875rem;

        ::ng-deep mat-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
          margin-left: 3px;
          vertical-align: middle;
        }
      }
    }
  `]
})
export class NewsTabComponent implements OnInit {
  private accountService = inject(AccountService);

  newsItems = signal<NewsItem[]>([]);
  loading = signal(true);
  error = signal(false);
  unreadCount = signal(0);

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading.set(true);
    this.error.set(false);

    this.accountService.getNews().subscribe({
      next: (response) => {
        this.newsItems.set(response.news);
        this.unreadCount.set(response.news.length);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load news:', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  markAsRead(newsItemId: string) {
    const updatedItems = this.newsItems().map(item =>
      item.id === newsItemId ? { ...item, isRead: true } : item
    );
    this.newsItems.set(updatedItems);
    this.unreadCount.set(updatedItems.filter(n => !n.isRead).length);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      info: 'info',
      warning: 'warning',
      error: 'error'
    };
    return icons[type] ?? 'notifications';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)  return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
