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

  // Non-null when the page loaded with a #recovery_token= hash (password reset link).
  // AppComponent reads this to open the "Set New Password" dialog.
  public pendingRecoveryToken: string | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreUserSession();
      this.extractRecoveryToken();
    }
    this.authReadySubject.next(true);
    this.initNetlifyIdentity();
  }

  /**
   * Extract and remove a recovery_token from the URL hash so the widget
   * doesn't try to handle it with its own UI.
   */
  private extractRecoveryToken(): void {
    const token = (window as any).__netlifyRecoveryToken;
    if (token) {
      this.pendingRecoveryToken = token;
      delete (window as any).__netlifyRecoveryToken;
    }
  }

  /**
   * Exchange a recovery token for a session and update the user's password.
   */
  public async setNewPassword(recoveryToken: string, newPassword: string): Promise<void> {
    const base = `${environment.netlifyIdentitySiteUrl}/.netlify/identity`;

    // 1. Exchange recovery token for an access token
    const recoverRes = await fetch(`${base}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: recoveryToken, type: 'recovery' })
    });

    if (!recoverRes.ok) {
      const err = await recoverRes.json();
      throw new Error(err.error_description || err.msg || 'Invalid or expired recovery link');
    }

    const session = await recoverRes.json();
    const accessToken = session.access_token;

    // 2. Set the new password using the session token
    const updateRes = await fetch(`${base}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ password: newPassword })
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      throw new Error(err.error_description || err.msg || 'Failed to update password');
    }

    // 3. Log the user in with the new session
    const user = {
      email: session.email || '',
      token: {
        access_token: session.access_token,
        token_type: session.token_type,
        expires_in: session.expires_in,
        refresh_token: session.refresh_token
      },
      ...session.user
    };

    const enrichedUser = this.enrichUserFromToken(user);
    this.userSubject.next(enrichedUser as NetlifyUser);
    this.saveUserSession(enrichedUser as NetlifyUser);
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
      // Widget unavailable — custom email/password flow still works
    }
  }

  /**
   * Set up event listeners for Netlify Identity
   */
  private setupEventListeners(): void {
    if (!this.netlifyIdentity) return;

    // Prevent the widget from showing its own overlay UI.
    // We handle all auth UI ourselves, so close it immediately if it tries to open.
    this.netlifyIdentity.on('open', () => {
      this.netlifyIdentity.close();
    });

    // Fires after email confirmation link is clicked or OAuth callback returns
    this.netlifyIdentity.on('login', (user: NetlifyUser) => {
      const enrichedUser = this.enrichUserFromToken(user);
      this.userSubject.next(enrichedUser);
      this.saveUserSession(enrichedUser);

      // Close widget and clean up the URL hash left by the confirmation link
      this.netlifyIdentity.close();
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });

    this.netlifyIdentity.on('logout', () => {
      this.userSubject.next(null);
      this.clearUserSession();
    });

    this.netlifyIdentity.on('error', () => {
      this.netlifyIdentity.close();
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
   * Login with email and password using Netlify Identity API directly
   */
  public async loginWithEmail(email: string, password: string): Promise<NetlifyUser> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      // Netlify Identity (GoTrue) requires form-encoded data for the token endpoint
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', email);
      params.append('password', password);

      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || error.msg || 'Invalid email or password');
      }

      const data = await response.json();

      const user = {
        email: data.email || email,
        token: {
          access_token: data.access_token,
          token_type: data.token_type,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token
        },
        id: data.user?.id,
        app_metadata: data.user?.app_metadata,
        user_metadata: data.user?.user_metadata,
        ...data.user
      };

      const enrichedUser = this.enrichUserFromToken(user);
      this.userSubject.next(enrichedUser as NetlifyUser);
      this.saveUserSession(enrichedUser as NetlifyUser);

      return enrichedUser as NetlifyUser;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Sign up with email and password
   */
  public async signupWithEmail(email: string, password: string): Promise<NetlifyUser> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || error.msg || 'Signup failed');
      }

      // User needs to confirm email before they can log in
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }


  /**
   * Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    // Pass redirect_to so the OAuth callback returns to the current origin
    // (e.g. http://localhost:4200 in dev, https://www.allthethings.dev in prod)
    const redirectTo = window.location.origin;
    const url = `${environment.netlifyIdentitySiteUrl}/.netlify/identity/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
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
   * Get JWT token for API calls
   */
  public async getToken(): Promise<string | null> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = this.netlifyIdentity.currentUser();
    if (!user) {
      return null;
    }

    try {
      // Get JWT token from user object
      const token = user.token?.access_token || user.token;
      return token;
    } catch {
      return null;
    }
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
   * Returns true if the current user authenticated via an external OAuth provider (e.g. Google).
   * These users manage their password with the provider, not on this site.
   */
  public isOAuthUser(): boolean {
    const provider = this.getCurrentUser()?.app_metadata?.provider;
    return !!provider && provider !== 'email';
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<void> {
    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || error.msg || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }
}
