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

  // Derived observable streams
  public isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  public isAdmin$: Observable<boolean> = this.user$.pipe(
    map(user => this.hasRole(user, 'admin'))
  );

  public hasAdFree$: Observable<boolean> = this.isAuthenticated$;

  constructor() {
    console.log('[AuthService] Constructor called');

    // Restore user session from localStorage if available
    if (isPlatformBrowser(this.platformId)) {
      this.restoreUserSession();
    }

    this.initNetlifyIdentity();
  }

  /**
   * Save user session to localStorage
   */
  private saveUserSession(user: NetlifyUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem('netlify_user', JSON.stringify(user));
      console.log('[AuthService] User session saved to localStorage');
    } catch (error) {
      console.error('[AuthService] Failed to save user session:', error);
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
        const user = JSON.parse(storedUser);
        console.log('[AuthService] Restoring user session from localStorage');
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('[AuthService] Failed to restore user session:', error);
      // Clear invalid data
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
      console.log('[AuthService] User session cleared from localStorage');
    } catch (error) {
      console.error('[AuthService] Failed to clear user session:', error);
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
    } catch (error) {
      console.error('[AuthService] Failed to decode JWT:', error);
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
    console.log('[AuthService] Decoded JWT:', decoded);

    if (decoded) {
      // Merge JWT data into user object
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
    console.log('[AuthService] initNetlifyIdentity started');

    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] Not in browser, skipping initialization');
      return; // Skip during SSR
    }

    console.log('[AuthService] Platform is browser, proceeding with initialization');

    try {
      console.log('[AuthService] Loading Netlify Identity Widget...');
      await this.loadNetlifyIdentityScript();
      console.log('[AuthService] Netlify Identity Widget loaded successfully');

      // Get reference to netlifyIdentity
      console.log('[AuthService] window.netlifyIdentity available:', !!window.netlifyIdentity);
      this.netlifyIdentity = window.netlifyIdentity;

      console.log('[AuthService] Netlify Identity instance assigned:', !!this.netlifyIdentity);

      // Initialize the widget (but don't show it)
      if (this.netlifyIdentity) {
        // Set up event listeners BEFORE init(), so we catch any events
        // fired during initialization (e.g. 'open' triggered by a confirmation token in the URL)
        this.setupEventListeners();

        console.log('[AuthService] Initializing Netlify Identity Widget...');
        this.netlifyIdentity.init({
          APIUrl: `${environment.netlifyIdentitySiteUrl}/.netlify/identity`
        });
        console.log('[AuthService] Netlify Identity Widget initialized');
      }

      // Check for existing user session (if not already restored from localStorage)
      console.log('[AuthService] Checking for existing user session...');
      const currentUser = this.netlifyIdentity.currentUser();
      console.log('[AuthService] Current user from widget:', currentUser ? 'Found' : 'None');

      // Only set from widget if we don't already have a user from localStorage
      if (currentUser && !this.userSubject.value) {
        console.log('[AuthService] Raw user object:', JSON.stringify(currentUser, null, 2));

        // Enrich user object with JWT data
        const enrichedUser = this.enrichUserFromToken(currentUser);
        console.log('[AuthService] Enriched user email:', enrichedUser.email);
        console.log('[AuthService] Enriched user app_metadata:', enrichedUser.app_metadata);
        console.log('[AuthService] Enriched user user_metadata:', enrichedUser.user_metadata);

        this.userSubject.next(enrichedUser);
        this.saveUserSession(enrichedUser);
        console.log('[AuthService] User session restored successfully with enriched data');
      } else if (this.userSubject.value) {
        console.log('[AuthService] User session already restored from localStorage');
      }

      console.log('[AuthService] Initialization complete');
    } catch (error) {
      console.error('[AuthService] Failed to initialize Netlify Identity:', error);
    }
  }

  /**
   * Set up event listeners for Netlify Identity
   */
  private setupEventListeners(): void {
    if (!this.netlifyIdentity) return;

    console.log('[AuthService] Setting up event listeners');

    // Prevent the widget from showing its own overlay UI.
    // We handle all auth UI ourselves, so close it immediately if it tries to open.
    this.netlifyIdentity.on('open', () => {
      console.log('[AuthService] Widget tried to open - closing immediately (we handle UI)');
      this.netlifyIdentity.close();
    });

    // Listen for login events (fires after email confirmation or widget login)
    this.netlifyIdentity.on('login', (user: NetlifyUser) => {
      console.log('[AuthService] Login event received');

      // Enrich user object with JWT data (in case it's incomplete)
      const enrichedUser = this.enrichUserFromToken(user);
      console.log('[AuthService] Enriched user email:', enrichedUser.email);

      this.userSubject.next(enrichedUser);

      // Save session to localStorage
      this.saveUserSession(enrichedUser);

      // Close widget and clean up the URL hash left by the confirmation link
      this.netlifyIdentity.close();
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });

    // Listen for logout events
    this.netlifyIdentity.on('logout', () => {
      console.log('[AuthService] Logout event received');
      this.userSubject.next(null);
      this.clearUserSession();
    });

    // Listen for error events
    this.netlifyIdentity.on('error', (err: any) => {
      console.error('[AuthService] Netlify Identity error:', err);
      // Close widget on error to prevent stuck overlay
      this.netlifyIdentity.close();
    });
  }

  /**
   * Load Netlify Identity script (loaded from index.html)
   * This method just waits for the script to be available
   */
  private loadNetlifyIdentityScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[AuthService] loadNetlifyIdentityScript called');
      console.log('[AuthService] scriptLoaded:', this.scriptLoaded);
      console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));

      if (this.scriptLoaded || !isPlatformBrowser(this.platformId)) {
        console.log('[AuthService] Script already loaded or not in browser, resolving immediately');
        resolve();
        return;
      }

      // Check if netlifyIdentity is already available
      console.log('[AuthService] Checking if window.netlifyIdentity exists:', !!window.netlifyIdentity);
      if (window.netlifyIdentity) {
        console.log('[AuthService] window.netlifyIdentity found immediately');
        this.scriptLoaded = true;
        resolve();
        return;
      }

      // Wait for netlifyIdentity to load (max 5 seconds)
      console.log('[AuthService] window.netlifyIdentity not found, starting polling...');
      let attempts = 0;
      const maxAttempts = 50; // 50 attempts * 100ms = 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        console.log(`[AuthService] Polling attempt ${attempts}/${maxAttempts}, window.netlifyIdentity:`, !!window.netlifyIdentity);

        if (window.netlifyIdentity) {
          clearInterval(checkInterval);
          this.scriptLoaded = true;
          console.log('[AuthService] window.netlifyIdentity found after polling!');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('[AuthService] Timeout waiting for Netlify Identity script');
          reject(new Error('Failed to load Netlify Identity script'));
        }
      }, 100);
    });
  }

  /**
   * Login with email and password using Netlify Identity API directly
   */
  public async loginWithEmail(email: string, password: string): Promise<NetlifyUser> {
    console.log('[AuthService] loginWithEmail called');
    console.log('[AuthService] Email:', email);
    console.log('[AuthService] this.netlifyIdentity exists:', !!this.netlifyIdentity);
    console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));

    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.error('[AuthService] Authentication service not available', {
        netlifyIdentity: !!this.netlifyIdentity,
        isPlatformBrowser: isPlatformBrowser(this.platformId)
      });
      throw new Error('Authentication service not available');
    }

    try {
      console.log('[AuthService] Attempting login via Netlify Identity API...');

      // Netlify Identity (GoTrue) requires form-encoded data for token endpoint
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', email);
      params.append('password', password);

      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      console.log('[AuthService] API response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[AuthService] API error:', error);
        throw new Error(error.error_description || error.msg || 'Invalid email or password');
      }

      const data = await response.json();
      console.log('[AuthService] Login response received');

      // Extract user data from token response
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

      // Enrich user with JWT data
      const enrichedUser = this.enrichUserFromToken(user);
      this.userSubject.next(enrichedUser as NetlifyUser);

      // Save session to localStorage
      this.saveUserSession(enrichedUser as NetlifyUser);

      console.log('[AuthService] Login successful');

      return enrichedUser as NetlifyUser;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Sign up with email and password
   */
  public async signupWithEmail(email: string, password: string): Promise<NetlifyUser> {
    console.log('[AuthService] signupWithEmail called');

    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.error('[AuthService] Authentication service not available for signup');
      throw new Error('Authentication service not available');
    }

    try {
      console.log('[AuthService] Attempting signup via Netlify Identity API...');

      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      console.log('[AuthService] Signup response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('[AuthService] Signup API error:', error);
        throw new Error(error.error_description || error.msg || 'Signup failed');
      }

      const user = await response.json();
      console.log('[AuthService] Signup successful, confirmation email sent');

      // Note: User needs to confirm email before they can log in
      return user;
    } catch (error: any) {
      console.error('[AuthService] Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }


  /**
   * Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    console.log('[AuthService] loginWithGoogle called');
    console.log('[AuthService] this.netlifyIdentity exists:', !!this.netlifyIdentity);
    console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));
    console.log('[AuthService] environment.netlifyIdentitySiteUrl:', environment.netlifyIdentitySiteUrl);

    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.error('[AuthService] Authentication service not available for Google login', {
        netlifyIdentity: !!this.netlifyIdentity,
        netlifyIdentityType: typeof this.netlifyIdentity,
        isPlatformBrowser: isPlatformBrowser(this.platformId),
        scriptLoaded: this.scriptLoaded,
        windowNetlifyIdentity: !!window.netlifyIdentity
      });
      throw new Error('Authentication service not available');
    }

    try {
      // Use external provider login
      const url = `${environment.netlifyIdentitySiteUrl}/.netlify/identity/authorize?provider=google`;
      console.log('[AuthService] Redirecting to Google OAuth URL:', url);
      window.location.href = url;
    } catch (error: any) {
      console.error('[AuthService] Google login error:', error);
      throw new Error('Google login failed');
    }
  }

  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    console.log('[AuthService] logout called');

    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] Not in browser or netlifyIdentity not available');
      return;
    }

    try {
      const user = this.netlifyIdentity.currentUser();
      if (user) {
        console.log('[AuthService] Logging out user via Netlify Identity');
        await this.netlifyIdentity.logout();
      }
      this.userSubject.next(null);
      this.clearUserSession();
      console.log('[AuthService] User logged out, reloading page');
      window.location.reload();
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      // Clear user anyway
      this.userSubject.next(null);
      this.clearUserSession();
      window.location.reload();
    }
  }

  /**
   * Get current user synchronously
   */
  public getCurrentUser(): NetlifyUser | null {
    const user = this.userSubject.value;
    console.log('[AuthService] getCurrentUser called, user:', user);
    return user;
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
    } catch (error) {
      console.error('[AuthService] Failed to get token:', error);
      return null;
    }
  }

  /**
   * Check if user has a specific role
   */
  private hasRole(user: NetlifyUser | null, role: string): boolean {
    console.log('[AuthService] hasRole called with role:', role);
    console.log('[AuthService] User object:', user);
    console.log('[AuthService] User app_metadata:', user?.app_metadata);
    console.log('[AuthService] User app_metadata.roles:', user?.app_metadata?.roles);

    if (!user) {
      console.log('[AuthService] No user, returning false');
      return false;
    }

    if (!user.app_metadata) {
      console.log('[AuthService] No app_metadata, returning false');
      return false;
    }

    if (!user.app_metadata.roles) {
      console.log('[AuthService] No roles in app_metadata, returning false');
      return false;
    }

    const hasRole = user.app_metadata.roles.includes(role);
    console.log('[AuthService] Checking if roles include', role, ':', hasRole);
    return hasRole;
  }

  /**
   * Check if current user has a specific role (synchronous)
   */
  public hasRoleSync(role: string): boolean {
    console.log('[AuthService] hasRoleSync called with role:', role);
    const result = this.hasRole(this.getCurrentUser(), role);
    console.log('[AuthService] hasRoleSync returning:', result);
    return result;
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
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<void> {
    console.log('[AuthService] requestPasswordReset called');

    if (!this.netlifyIdentity || !isPlatformBrowser(this.platformId)) {
      throw new Error('Authentication service not available');
    }

    try {
      console.log('[AuthService] Requesting password reset for:', email);

      const response = await fetch(`${environment.netlifyIdentitySiteUrl}/.netlify/identity/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[AuthService] Password reset error:', error);
        throw new Error(error.error_description || error.msg || 'Password reset failed');
      }

      console.log('[AuthService] Password reset email sent');
    } catch (error: any) {
      console.error('[AuthService] Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }
}
