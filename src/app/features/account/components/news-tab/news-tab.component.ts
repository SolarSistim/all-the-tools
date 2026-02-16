import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { AccountService } from '../../services/account.service';
import { NewsItem } from '../../models/news-item.interface';

/**
 * News Tab Component
 * Displays news and announcements for logged-in users
 */
@Component({
  selector: 'app-news-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  template: `
    <div class="news-tab">
      <div class="tab-header">
        <h2>News & Updates</h2>
        @if (unreadCount() > 0) {
          <mat-chip class="unread-chip">
            {{ unreadCount() }} unread
          </mat-chip>
        }
      </div>

      @if (loading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading news...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <p>Failed to load news items</p>
          <button mat-raised-button (click)="loadNews()">
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
        <div class="news-list">
          @for (item of newsItems(); track item.id) {
            <div class="news-item" [class.unread]="!item.isRead" [class]="'news-type-' + item.type">
              <div class="news-icon">
                @switch (item.type) {
                  @case ('info') {
                    <mat-icon>info</mat-icon>
                  }
                  @case ('warning') {
                    <mat-icon>warning</mat-icon>
                  }
                  @case ('success') {
                    <mat-icon>check_circle</mat-icon>
                  }
                  @case ('error') {
                    <mat-icon>error</mat-icon>
                  }
                }
              </div>

              <div class="news-content">
                <h3>{{ item.title }}</h3>
                <p class="news-message">{{ item.message }}</p>
                <div class="news-meta">
                  <span class="news-date">{{ formatDate(item.createdAt) }}</span>
                  @if (!item.isRead) {
                    <button
                      mat-button
                      color="primary"
                      (click)="markAsRead(item.id)"
                      class="mark-read-btn"
                    >
                      <mat-icon>done</mat-icon>
                      Mark as read
                    </button>
                  }
                </div>
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

    .tab-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;

      h2 {
        margin: 0;
        font-size: 1.5rem;
      }

      .unread-chip {
        background-color: #f44336;
        color: white;
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

      .empty-subtitle {
        font-size: 0.9rem;
      }

      button {
        margin-top: 1rem;
      }
    }

    .news-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .news-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-left: 4px solid #2196f3;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      transition: all 0.2s ease;

      &.unread {
        background-color: rgba(33, 150, 243, 0.1);
        border-left-width: 6px;
      }

      &.news-type-info {
        border-left-color: #2196f3;
      }

      &.news-type-warning {
        border-left-color: #ff9800;
      }

      &.news-type-success {
        border-left-color: #4caf50;
      }

      &.news-type-error {
        border-left-color: #f44336;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }

    .news-icon {
      flex-shrink: 0;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }

    .news-content {
      flex: 1;

      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 500;
      }

      .news-message {
        margin: 0 0 0.75rem 0;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.8);
      }

      .news-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.875rem;

        .news-date {
          color: rgba(255, 255, 255, 0.6);
        }

        .mark-read-btn {
          padding: 0 0.5rem;
          min-width: auto;
        }
      }
    }

    @media (max-width: 768px) {
      .news-item {
        flex-direction: column;

        .news-icon mat-icon {
          font-size: 1.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .news-content .news-meta {
        flex-direction: column;
        align-items: flex-start;
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
        this.unreadCount.set(response.unreadCount);
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
    this.accountService.markNewsAsRead(newsItemId).subscribe({
      next: () => {
        // Update local state
        const items = this.newsItems();
        const updatedItems = items.map(item =>
          item.id === newsItemId ? { ...item, isRead: true } : item
        );
        this.newsItems.set(updatedItems);
        this.unreadCount.set(this.unreadCount() - 1);
      },
      error: (err) => {
        console.error('Failed to mark as read:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
