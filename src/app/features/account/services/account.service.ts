import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { NewsResponse } from '../models/news-item.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Get news items from the remote JSON feed.
   * Hosted on news.allthethings.dev — update the file there to publish new items
   * without rebuilding the app.
   */
  getNews(): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(environment.newsUrl);
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
