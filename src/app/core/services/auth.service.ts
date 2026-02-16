import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NetlifyUser } from '../models/user.interface';

// Import GoTrue JS client
declare global {
  interface Window {
    GoTrue?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private goTrue: any;
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
    this.initGoTrue();
  }

  /**
   * Initialize GoTrue client
   */
  private async initGoTrue(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip during SSR
    }

    try {
      await this.loadGoTrueScript();

      // Initialize GoTrue client
      this.goTrue = new window.GoTrue({
        APIUrl: `${environment.netlifyIdentitySiteUrl}/.netlify/identity`,
        audience: '',
        setCookie: true
      });

      // Restore session if user is already logged in
      const currentUser = this.goTrue.currentUser();
      if (currentUser) {
        // Verify token is still valid
        try {
          // GoTrue user has jwt method
          await (currentUser as any).jwt();
          this.userSubject.next(currentUser);
        } catch (error) {
          // Token expired, clear session
          console.warn('Session expired, clearing user');
          this.goTrue.clearStore();
        }
      }
    } catch (error) {
      console.error('Failed to initialize GoTrue:', error);
    }
  }

  /**
   * Load GoTrue script dynamically
   */
  private loadGoTrueScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded || !isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src*="gotrue"]');
      if (existingScript) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      // Create and inject script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://unpkg.com/gotrue-js@0.9.29/dist/gotrue.js';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load GoTrue script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Login with email and password
   */
  public async loginWithEmail(email: string, password: string): Promise<NetlifyUser> {
    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      const user = await this.goTrue.login(email, password, true);
      this.userSubject.next(user);
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.json?.error_description || error.message || 'Login failed');
    }
  }

  /**
   * Sign up with email and password
   */
  public async signupWithEmail(email: string, password: string): Promise<NetlifyUser> {
    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      const user = await this.goTrue.signup(email, password);
      // Note: User needs to confirm email before they can log in
      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.json?.error_description || error.message || 'Signup failed');
    }
  }

  /**
   * Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      // Use external provider login
      const url = `${environment.netlifyIdentitySiteUrl}/.netlify/identity/authorize?provider=google`;
      window.location.href = url;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error('Google login failed');
    }
  }

  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const user = this.getCurrentUser();
      if (user) {
        // GoTrue user has logout method
        await (user as any).logout();
      }
      this.goTrue.clearStore();
      this.userSubject.next(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user anyway
      this.goTrue.clearStore();
      this.userSubject.next(null);
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
   * Get JWT token for API calls
   */
  public async getToken(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) {
      return null;
    }

    try {
      // GoTrue user has jwt method
      const token = await (user as any).jwt();
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
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

  /**
   * Open password reset modal
   * For now, this will be handled through email
   */
  public async requestPasswordReset(email: string): Promise<void> {
    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      await this.goTrue.requestPasswordRecovery(email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.json?.error_description || error.message || 'Password reset failed');
    }
  }
}
