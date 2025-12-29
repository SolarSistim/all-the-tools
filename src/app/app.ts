import { Component, inject, ViewChild, AfterViewInit, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top';
import { PageLoaderComponent } from './shared/components/page-loader/page-loader.component';
import { SidenavService } from './core/services/sidenav.service';
import { ToolsService } from './core/services/tools.service';
import { VisitLoggerService } from './core/services/visit-logger.service';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';
import { PageLoaderService } from './core/services/page-loader.service';
import { ToolCategoryMeta, Tool } from './core/models/tool.interface';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent,
    PageLoaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit, OnInit {
  protected title = 'all-the-tools';

  @ViewChild('toolsSidenav') toolsSidenav!: MatSidenav;

  private sidenavService = inject(SidenavService);
  private toolsService = inject(ToolsService);
  private router = inject(Router);
  private visitLogger = inject(VisitLoggerService);
  private googleAnalytics = inject(GoogleAnalyticsService);
  private pageLoader = inject(PageLoaderService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Initialize Google Analytics (only in production, not localhost)
    this.googleAnalytics.initialize();

    // Expose page loader service to window object for debugging (browser only)
    if (isPlatformBrowser(this.platformId)) {
      (window as any)['pageLoader'] = this.pageLoader;
      console.log('Page loader service exposed to window.pageLoader for debugging');
      console.log('Usage: window.pageLoader.setDebugMode(true) to keep loader visible');
    }

    // Set up router event handling for page loader and visit logging
    this.router.events.subscribe((event) => {
      // Show loader when navigation starts
      if (event instanceof NavigationStart) {
        this.pageLoader.show();
      }

      // Hide loader and log visit when navigation ends
      if (event instanceof NavigationEnd) {
        this.pageLoader.hide();
        this.visitLogger.logVisit(event.urlAfterRedirects);
      }

      // Hide loader if navigation is cancelled or errors
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.pageLoader.hide();
      }
    });
  }

  ngAfterViewInit() {
    // Register the sidenav with the service so it can be controlled
    this.sidenavService.registerSidenav(this.toolsSidenav);
  }

  /**
   * Get all tool categories
   */
  get categories(): ToolCategoryMeta[] {
    return this.toolsService.getAllCategories();
  }

  /**
   * Get count of tools in a category
   */
  getToolCount(categoryId: string): number {
    return this.toolsService.getToolCountByCategory(categoryId as any);
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(categoryId: string): Tool[] {
    return this.toolsService.getToolsByCategory(categoryId as any);
  }

  /**
   * Close tools sidenav
   */
  closeToolsSidenav(): void {
    this.sidenavService.closeToolsSidenav();
  }
}