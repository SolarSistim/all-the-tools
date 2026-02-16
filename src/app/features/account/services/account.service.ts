import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { NewsItem, NewsResponse } from '../models/news-item.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Get news items for the current user
   * Filtered by user role (admin sees admin-only news)
   */
  getNews(): Observable<NewsResponse> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<NewsResponse>('/.netlify/functions/get-news', { headers });
      })
    );
  }

  /**
   * Mark a news item as read for the current user
   */
  markNewsAsRead(newsItemId: string): Observable<{ success: boolean }> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const body = { newsItemId };

        return this.http.post<{ success: boolean }>(
          '/.netlify/functions/mark-news-read',
          body,
          { headers }
        );
      })
    );
  }

  /**
   * Delete the current user's account
   * DESTRUCTIVE ACTION - requires confirmation from user
   */
  deleteAccount(): Observable<{ success: boolean }> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.delete<{ success: boolean}>(
          '/.netlify/functions/delete-account',
          { headers }
        );
      })
    );
  }

  /**
   * Get current user profile information
   * Returns user data from auth service
   */
  getUserProfile() {
    return this.authService.user$;
  }
}
