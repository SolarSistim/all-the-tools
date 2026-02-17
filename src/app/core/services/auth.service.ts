import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NetlifyUser } from '../models/user.interface';

// Import Netlify Identity Widget
declare global {
  interface Window {
    netlifyIdentity?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private netlifyIdentity: any;
  private scriptLoaded = false;

  // User state management with BehaviorSubject
  private userSubject = new BehaviorSubject<NetlifyUser | null>(null);
  public user$: Observable<NetlifyUser | null> = this.userSubject.asObservable();

  // Emits true once auth state has been determined (avoids login-button flash on load)
  private authReadySubject = new BehaviorSubject<boolean>(false);
  public authReady$: Observable<boolean> = this.authReadySubject.asObservable();

  // Derived observable streams
  public isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  public isAdmin$: Observable<boolean> = this.user$.pipe(
    map(user => this.hasRole(user, 'admin'))
  );

  public hasAdFree$: Observable<boolean> = this.isAuthenticated$;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreUserSession();
    }
    this.authReadySubject.next(true);
    this.initNetlifyIdentity();
  }

  /**
   * Save user session to localStorage
   */
  private saveUserSession(user: NetlifyUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem('netlify_user', JSON.stringify(user));
    } catch (error) {
      // Silently fail — non-critical
    }
  }

  /**
   * Restore user session from localStorage
   */
  private restoreUserSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const storedUser = localStorage.getItem('netlify_user');
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('netlify_user');
    }
  }

  /**
   * Clear user session from localStorage
   */
  private clearUserSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem('netlify_user');
    } catch {
      // Silently fail — non-critical
    }
  }

  /**
   * Decode JWT token to extract user information
   */
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Enrich user object with data from JWT token
   */
  private enrichUserFromToken(user: any): NetlifyUser {
    if (!user || !user.token || !user.token.access_token) {
      return user;
    }

    const decoded = this.decodeJWT(user.token.access_token);

    if (decoded) {
      return {
        ...user,
        email: decoded.email || user.email,
        app_metadata: decoded.app_metadata || user.app_metadata,
        user_metadata: decoded.user_metadata || user.user_metadata,
        sub: decoded.sub || user.sub,
        id: decoded.sub || user.id
      };
    }

    return user;
  }

  /**
   * Initialize Netlify Identity Widget
   */
  private async initNetlifyIdentity(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await this.loadNetlifyIdentityScript();

      this.netlifyIdentity = window.netlifyIdentity;

      if (this.netlifyIdentity) {
        // Set up event listeners BEFORE init(), so we catch any events
        // fired during initialization (e.g. 'open' triggered by a confirmation token in the URL)
        this.setupEventListeners();

        this.netlifyIdentity.init({
          APIUrl: `${environment.netlifyIdentitySiteUrl}/.netlify/identity`
        });
      }

      // Only set from widget if we don't already have a user from localStorage
      const currentUser = this.netlifyIdentity.currentUser();
      if (currentUser && !this.userSubject.value) {
        const enrichedUser = this.enrichUserFromToken(currentUser);
        this.userSubject.next(enrichedUser);
        this.saveUserSession(enrichedUser);
      }
    } catch {
      // Widget unavailable
    }
  }

  /**
   * Set up event listeners for Netlify Identity
   */
  private setupEventListeners(): void {
    if (!this.netlifyIdentity) return;

    // Prevent the widget from showing its own overlay UI.
    this.netlifyIdentity.on('open', () => {
      this.netlifyIdentity.close();
    });

    // Fires after OAuth callback returns
    this.netlifyIdentity.on('login', (user: NetlifyUser) => {
      const enrichedUser = this.enrichUserFromToken(user);
      this.userSubject.next(enrichedUser);
      this.saveUserSession(enrichedUser);

      this.netlifyIdentity.close();
      // Queue a welcome toast to be shown after the page navigates
      try { sessionStorage.setItem('auth_toast', 'login'); } catch {}
      // Navigate to account after OAuth login, replacing the callback URL in history
      window.location.replace('/account/news');
    });

    this.netlifyIdentity.on('logout', () => {
      this.userSubject.next(null);
      this.clearUserSession();
      // Queue a goodbye toast to be shown after the page reloads
      try { sessionStorage.setItem('auth_toast', 'logout'); } catch {}
    });

    this.netlifyIdentity.on('error', () => {
      this.netlifyIdentity.close();
      try { sessionStorage.setItem('auth_toast', 'error'); } catch {}
    });
  }

  /**
   * Load Netlify Identity script (loaded from index.html)
   * This method just waits for the script to be available
   */
  private loadNetlifyIdentityScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded || !isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      if (window.netlifyIdentity) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      // Poll until the script tag in index.html makes window.netlifyIdentity available
      let attempts = 0;
      const maxAttempts = 50; // 50 × 100ms = 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.netlifyIdentity) {
          clearInterval(checkInterval);
          this.scriptLoaded = true;
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Failed to load Netlify Identity script'));
        }
      }, 100);
    });
  }

  /**
   * Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    const redirectTo = `${window.location.origin}/account/news`;
    const url = `${environment.netlifyIdentitySiteUrl}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  }

  /**
   * Login with GitHub OAuth
   */
  public async loginWithGithub(): Promise<void> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    const redirectTo = `${window.location.origin}/account/news`;
    const url = `${environment.netlifyIdentitySiteUrl}/.netlify/identity/authorize?provider=github&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = url;
  }

  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) return;

    try {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        await this.netlifyIdentity.logout();
      }
    } catch {
      // Ignore widget errors — always clear local state
    } finally {
      this.userSubject.next(null);
      this.clearUserSession();
      window.location.reload();
    }
  }

  /**
   * Get current user synchronously
   */
  public getCurrentUser(): NetlifyUser | null {
    return this.userSubject.value;
  }

  /**
   * Get a fresh JWT token for API calls.
   * Uses the widget's .jwt() method which auto-refreshes when expired,
   * rather than reading the cached access_token which may be stale.
   */
  public async getToken(): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) return null;

    // Prefer the widget's .jwt() which silently refreshes an expired token
    if (this.netlifyIdentity) {
      const widgetUser = this.netlifyIdentity.currentUser();
      if (widgetUser?.jwt) {
        try {
          return await widgetUser.jwt();
        } catch {
          // jwt() can throw if refresh fails — fall through to stored token
        }
      }
    }

    // Fall back to the stored access token (valid for fresh sessions)
    return this.userSubject.value?.token?.access_token ?? null;
  }

  /**
   * Check if user has a specific role
   */
  private hasRole(user: NetlifyUser | null, role: string): boolean {
    return !!user?.app_metadata?.roles?.includes(role);
  }

  /**
   * Check if current user has a specific role (synchronous)
   */
  public hasRoleSync(role: string): boolean {
    return this.hasRole(this.getCurrentUser(), role);
  }

  /**
   * Get user display name
   */
  public getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    return user.user_metadata?.full_name || user.email || 'User';
  }

  /**
   * Get user roles
   */
  public getUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.app_metadata?.roles || ['user'];
  }

  /**
   * Returns true if the current user authenticated via an external OAuth provider.
   */
  public isOAuthUser(): boolean {
    const provider = this.getCurrentUser()?.app_metadata?.provider;
    return !!provider && provider !== 'email';
  }
}
