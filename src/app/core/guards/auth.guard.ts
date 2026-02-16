import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes requiring authentication
 *
 * Usage:
 * {
 *   path: 'account',
 *   component: AccountComponent,
 *   canActivate: [authGuard]
 * }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow all routes (will be protected client-side)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Client-side: check authentication status
  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        // User not authenticated, redirect to home and open login modal
        router.navigate(['/']);
        authService.login();
        return false;
      }
      // User authenticated, allow navigation
      return true;
    })
  );
};
