import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { NetlifyUser } from '../../../core/models/user.interface';

/**
 * User List Response
 */
export interface UserListResponse {
  users: NetlifyUser[];
  total: number;
}

/**
 * Admin Service
 * Handles admin-only operations (user management, role assignment)
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Get all users (admin only)
   * Returns list of all Netlify Identity users
   */
  getAllUsers(): Observable<UserListResponse> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<UserListResponse>(
          '/.netlify/functions/get-all-users',
          { headers }
        );
      })
    );
  }

  /**
   * Update user roles (admin only)
   * Assigns or removes roles for a specific user
   */
  updateUserRoles(userId: string, roles: string[]): Observable<{ success: boolean }> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const body = { userId, roles };

        return this.http.put<{ success: boolean }>(
          '/.netlify/functions/update-user-roles',
          body,
          { headers }
        );
      })
    );
  }
}
