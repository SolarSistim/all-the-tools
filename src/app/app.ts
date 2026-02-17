import { Component, inject, ViewChild, AfterViewInit, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top';
import { SidenavService } from './core/services/sidenav.service';
import { ToolsService } from './core/services/tools.service';
import { AuthService } from './core/services/auth.service';
import { VisitLoggerService } from './core/services/visit-logger.service';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';
import { MetaService } from './core/services/meta.service';
import { AdsenseService } from './core/services/adsense.service';
import { ToolCategoryMeta, Tool } from './core/models/tool.interface';
import { LoginDialogComponent } from './features/auth/login-dialog/login-dialog.component';
import { CustomSnackbarService } from './core/services/custom-snackbar.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnInit {
  protected title = 'all-the-tools';

  @ViewChild('toolsSidenav') toolsSidenav!: MatSidenav;

  isMobile = signal(false);
  sidenavOpened = signal(false);

  private sidenavService = inject(SidenavService);
  private toolsService = inject(ToolsService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  authReady$ = this.authService.authReady$;
  isAuthenticated$ = this.authService.isAuthenticated$;
  private visitLogger = inject(VisitLoggerService);
  private googleAnalytics = inject(GoogleAnalyticsService);
  private metaService = inject(MetaService);
  private adsenseService = inject(AdsenseService);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);
  private snackbar = inject(CustomSnackbarService);

  ngOnInit(): void {
    this.adsenseService.init();
    this.showPendingAuthToast();

    // Initialize Google Analytics (only in production, not localhost)
    this.googleAnalytics.initialize();

    this.metaService.setSiteJsonLd(
      this.metaService.buildWebSiteJsonLd({
        name: 'All The Things',
        url: 'https://www.allthethings.dev/',
        searchUrl: 'https://www.allthethings.dev/tools?search={search_term_string}'
      })
    );

    // Monitor breakpoint for mobile detection and sidenav state
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        // Expand sidenav on desktop, collapse on mobile/tablet
        this.sidenavOpened.set(!result.matches);
      });

    // Set up router event handling for visit logging and scroll behavior
    this.router.events.subscribe((event) => {
      // Log visit and scroll to top when navigation ends
      if (event instanceof NavigationEnd) {
        this.visitLogger.logVisit(event.urlAfterRedirects);
        this.metaService.setCanonicalForPath(event.urlAfterRedirects);

        // Scroll to top on navigation (only in browser)
        if (isPlatformBrowser(this.platformId)) {
          // Scroll window to top
          window.scrollTo(0, 0);

          // Also scroll the mat-sidenav-content to top
          setTimeout(() => {
            const sidenavContent = document.querySelector('mat-sidenav-content');
            if (sidenavContent) {
              sidenavContent.scrollTo(0, 0);
            }
          }, 0);
        }
      }
    });

    // Defer Ahrefs analytics loading for better initial page performance
    this.loadAhrefsAnalytics();
  }

  /**
   * Show any queued auth notification that was set before a page reload/redirect.
   */
  private showPendingAuthToast(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const toast = sessionStorage.getItem('auth_toast');
      if (!toast) return;
      sessionStorage.removeItem('auth_toast');

      setTimeout(() => {
        if (toast === 'login') {
          this.snackbar.success('You\'re signed in. Welcome!');
        } else if (toast === 'logout') {
          this.snackbar.info('You\'ve been signed out.');
        } else if (toast === 'error') {
          this.snackbar.error('Authentication failed. Please try again.');
        }
      }, 400);
    } catch {}
  }

  /**
   * Load Ahrefs analytics script with requestIdleCallback for optimal performance
   */
  private loadAhrefsAnalytics(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Defer loading by 3 seconds, then use requestIdleCallback
    setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.injectAhrefsScript(), { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => this.injectAhrefsScript(), 100);
      }
    }, 3000);
  }

  /**
   * Inject Ahrefs analytics script into the document
   */
  private injectAhrefsScript(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://analytics.ahrefs.com/analytics.js';
    script.setAttribute('data-key', 'IMRR+4XlBgUJq9UHvjq07g');
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  ngAfterViewInit() {
    this.sidenavService.registerSidenav(this.toolsSidenav);
  }

  /**
   * Get all tool categories
   */
  get categories(): ToolCategoryMeta[] {
    return this.toolsService.getAllCategories();
  }

  /**
   * Get count of tools in a category (for sidenav - excludes conversion pairs)
   */
  getToolCount(categoryId: string): number {
    return this.toolsService.getToolCountByCategoryForNav(categoryId as any);
  }

  /**
   * Get tools by category (for sidenav - excludes conversion pairs)
   */
  getToolsByCategory(categoryId: string): Tool[] {
    return this.toolsService.getToolsByCategoryForNav(categoryId as any);
  }

  /**
   * Get router link array for a tool
   * Handles multi-segment routes by splitting on '/'
   */
  getToolRouterLink(toolRoute: string): string[] {
    if (toolRoute.includes('/')) {
      // Split multi-segment routes (e.g., 'unit-converter/cm-to-inches')
      return ['/tools', ...toolRoute.split('/')];
    }
    // Single segment route
    return ['/tools', toolRoute];
  }

  /**
   * Close tools sidenav (mobile only on navigation)
   */
  closeToolsSidenavIfMobile(): void {
    if (this.isMobile()) {
      this.sidenavService.closeToolsSidenav();
    }
  }

  /**
   * Close tools sidenav
   */
  closeToolsSidenav(): void {
    this.sidenavService.closeToolsSidenav();
  }

  /**
   * Open login dialog
   */
  login(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'login-dialog-container',
      backdropClass: 'glass-dialog-backdrop'
    });
  }
}
