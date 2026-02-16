import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NetlifyUser } from '../models/user.interface';

// Declare netlifyIdentity on window object
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

  // Derived observable streams
  public isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  public isAdmin$: Observable<boolean> = this.user$.pipe(
    map(user => this.hasRole(user, 'admin'))
  );

  public hasAdFree$: Observable<boolean> = this.isAuthenticated$;

  constructor() {
    this.initNetlifyIdentity();
  }

  /**
   * Initialize Netlify Identity widget
   * Loads the SDK script and sets up event listeners
   */
  private async initNetlifyIdentity(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip during SSR
    }

    try {
      await this.loadNetlifyIdentityScript();
      this.netlifyIdentity = window.netlifyIdentity;

      if (!this.netlifyIdentity) {
        console.error('Netlify Identity failed to load');
        return;
      }

      // Initialize the widget with site URL
      this.netlifyIdentity.init({
        locale: 'en'
      });

      // Restore session if user is already logged in
      const currentUser = this.netlifyIdentity.currentUser();
      if (currentUser) {
        this.userSubject.next(currentUser);
      }

      // Listen for auth events
      this.netlifyIdentity.on('init', (user: NetlifyUser | null) => {
        if (user) {
          this.userSubject.next(user);
        }
      });

      this.netlifyIdentity.on('login', (user: NetlifyUser) => {
        this.userSubject.next(user);
        this.netlifyIdentity.close();
      });

      this.netlifyIdentity.on('logout', () => {
        this.userSubject.next(null);
      });

      this.netlifyIdentity.on('error', (err: any) => {
        console.error('Netlify Identity error:', err);
      });

    } catch (error) {
      console.error('Failed to initialize Netlify Identity:', error);
    }
  }

  /**
   * Load Netlify Identity widget script dynamically
   */
  private loadNetlifyIdentityScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded || !isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      // Check if script already exists in DOM
      const existingScript = document.querySelector('script[src*="netlify-identity-widget"]');
      if (existingScript) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      // Create and inject script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Netlify Identity script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Open login modal
   */
  public login(): void {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.warn('Netlify Identity not available');
      return;
    }
    this.netlifyIdentity.open('login');
  }

  /**
   * Open signup modal
   */
  public signup(): void {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.warn('Netlify Identity not available');
      return;
    }
    this.netlifyIdentity.open('signup');
  }

  /**
   * Logout current user
   */
  public logout(): void {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.warn('Netlify Identity not available');
      return;
    }
    this.netlifyIdentity.logout();
  }

  /**
   * Open password reset modal
   */
  public openPasswordReset(): void {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.warn('Netlify Identity not available');
      return;
    }
    this.netlifyIdentity.open('password_reset');
  }

  /**
   * Get current user synchronously
   */
  public getCurrentUser(): NetlifyUser | null {
    return this.userSubject.value;
  }

  /**
   * Get JWT token for API calls
   */
  public async getToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user || !user.token) {
      return null;
    }

    // Check if token is expired
    const expiresAt = user.token.expires_at;
    const now = Date.now() / 1000;

    if (expiresAt && expiresAt < now) {
      // Token expired, refresh it
      try {
        const refreshedUser = await this.refreshToken();
        return refreshedUser?.token?.access_token || null;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return user.token.access_token;
  }

  /**
   * Refresh user token
   */
  private async refreshToken(): Promise<NetlifyUser | null> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const user = await this.netlifyIdentity.refresh();
      if (user) {
        this.userSubject.next(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Check if user has a specific role
   */
  private hasRole(user: NetlifyUser | null, role: string): boolean {
    if (!user || !user.app_metadata || !user.app_metadata.roles) {
      return false;
    }
    return user.app_metadata.roles.includes(role);
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
}
