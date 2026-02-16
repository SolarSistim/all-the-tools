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
    console.log('[AuthService] Constructor called');
    this.initGoTrue();
  }

  /**
   * Initialize GoTrue client
   */
  private async initGoTrue(): Promise<void> {
    console.log('[AuthService] initGoTrue started');

    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] Not in browser, skipping initialization');
      return; // Skip during SSR
    }

    console.log('[AuthService] Platform is browser, proceeding with initialization');

    try {
      console.log('[AuthService] Loading GoTrue script...');
      await this.loadGoTrueScript();
      console.log('[AuthService] GoTrue script loaded successfully');

      // Initialize GoTrue client
      console.log('[AuthService] Initializing GoTrue client with URL:', `${environment.netlifyIdentitySiteUrl}/.netlify/identity`);
      console.log('[AuthService] window.GoTrue available:', !!window.GoTrue);

      this.goTrue = new window.GoTrue({
        APIUrl: `${environment.netlifyIdentitySiteUrl}/.netlify/identity`,
        audience: '',
        setCookie: true
      });

      console.log('[AuthService] GoTrue client initialized:', !!this.goTrue);

      // Handle OAuth callback (if returning from external provider like Google)
      console.log('[AuthService] Checking for OAuth callback...');
      await this.handleOAuthCallback();

      // Restore session if user is already logged in
      console.log('[AuthService] Checking for existing user session...');
      const currentUser = this.goTrue.currentUser();
      console.log('[AuthService] Current user:', currentUser ? 'Found' : 'None');

      if (currentUser) {
        // Verify token is still valid
        try {
          // GoTrue user has jwt method
          await (currentUser as any).jwt();
          this.userSubject.next(currentUser);
          console.log('[AuthService] User session restored successfully');
        } catch (error) {
          // Token expired, clear session
          console.warn('[AuthService] Session expired, clearing user');
          this.goTrue.clearStore();
        }
      }

      console.log('[AuthService] Initialization complete');
    } catch (error) {
      console.error('[AuthService] Failed to initialize GoTrue:', error);
    }
  }

  /**
   * Load GoTrue script (now loaded from index.html)
   * This method just waits for the script to be available
   */
  private loadGoTrueScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[AuthService] loadGoTrueScript called');
      console.log('[AuthService] scriptLoaded:', this.scriptLoaded);
      console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));

      if (this.scriptLoaded || !isPlatformBrowser(this.platformId)) {
        console.log('[AuthService] Script already loaded or not in browser, resolving immediately');
        resolve();
        return;
      }

      // Check if GoTrue is already available
      console.log('[AuthService] Checking if window.GoTrue exists:', !!window.GoTrue);
      if (window.GoTrue) {
        console.log('[AuthService] window.GoTrue found immediately');
        this.scriptLoaded = true;
        resolve();
        return;
      }

      // Wait for GoTrue to load (max 5 seconds)
      console.log('[AuthService] window.GoTrue not found, starting polling...');
      let attempts = 0;
      const maxAttempts = 50; // 50 attempts * 100ms = 5 seconds
      const checkInterval = setInterval(() => {
        attempts++;
        console.log(`[AuthService] Polling attempt ${attempts}/${maxAttempts}, window.GoTrue:`, !!window.GoTrue);

        if (window.GoTrue) {
          clearInterval(checkInterval);
          this.scriptLoaded = true;
          console.log('[AuthService] window.GoTrue found after polling!');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.error('[AuthService] Timeout waiting for GoTrue script');
          reject(new Error('Failed to load GoTrue script'));
        }
      }, 100);
    });
  }

  /**
   * Login with email and password
   */
  public async loginWithEmail(email: string, password: string): Promise<NetlifyUser> {
    console.log('[AuthService] loginWithEmail called');
    console.log('[AuthService] Email:', email);
    console.log('[AuthService] this.goTrue exists:', !!this.goTrue);
    console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));

    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      console.error('[AuthService] Authentication service not available', {
        goTrue: !!this.goTrue,
        isPlatformBrowser: isPlatformBrowser(this.platformId)
      });
      throw new Error('Authentication service not available');
    }

    try {
      console.log('[AuthService] Attempting login with GoTrue...');
      const user = await this.goTrue.login(email, password, true);
      console.log('[AuthService] Login successful:', user);
      this.userSubject.next(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
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
   * Handle OAuth callback from external providers (Google, etc.)
   */
  private async handleOAuthCallback(): Promise<void> {
    console.log('[AuthService] handleOAuthCallback called');

    if (!isPlatformBrowser(this.platformId)) {
      console.log('[AuthService] Not in browser, skipping OAuth callback');
      return;
    }

    // Check if we have an OAuth callback in the URL hash
    const hash = window.location.hash;
    console.log('[AuthService] Current URL hash:', hash);
    console.log('[AuthService] Has access_token in hash:', hash && hash.includes('access_token'));

    if (hash && hash.includes('access_token')) {
      console.log('[AuthService] OAuth callback detected in URL hash');
      try {
        // GoTrue will automatically parse the hash and create the user session
        const user = this.goTrue.currentUser();
        console.log('[AuthService] User from OAuth callback:', user ? 'Found' : 'None');

        if (user) {
          this.userSubject.next(user);
          // Clean up the URL hash
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('[AuthService] OAuth login successful, hash cleaned');
        } else {
          console.warn('[AuthService] OAuth callback present but no user found');
        }
      } catch (error) {
        console.error('[AuthService] OAuth callback error:', error);
      }
    }
  }

  /**
   * Login with Google OAuth
   */
  public async loginWithGoogle(): Promise<void> {
    console.log('[AuthService] loginWithGoogle called');
    console.log('[AuthService] this.goTrue exists:', !!this.goTrue);
    console.log('[AuthService] isPlatformBrowser:', isPlatformBrowser(this.platformId));
    console.log('[AuthService] environment.netlifyIdentitySiteUrl:', environment.netlifyIdentitySiteUrl);

    if (!this.goTrue || !isPlatformBrowser(this.platformId)) {
      console.error('[AuthService] Authentication service not available for Google login', {
        goTrue: !!this.goTrue,
        goTrueType: typeof this.goTrue,
        isPlatformBrowser: isPlatformBrowser(this.platformId),
        scriptLoaded: this.scriptLoaded,
        windowGoTrue: !!window.GoTrue
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
