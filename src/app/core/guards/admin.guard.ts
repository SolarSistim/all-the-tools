import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard - Protects routes requiring admin role
 *
 * Usage:
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [adminGuard]
 * }
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow all routes (will be protected client-side)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Client-side: check admin role
  return authService.isAdmin$.pipe(
    take(1),
    map(isAdmin => {
      if (!isAdmin) {
        // User is not admin, redirect to home
        router.navigate(['/']);

        // If user is not even authenticated, show login modal
        const isAuthenticated = authService.getCurrentUser() !== null;
        if (!isAuthenticated) {
          authService.login();
        }

        return false;
      }
      // User is admin, allow navigation
      return true;
    })
  );
};
