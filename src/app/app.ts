import { Component, inject, ViewChild, AfterViewInit, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top';
import { SidenavService } from './core/services/sidenav.service';
import { ToolsService } from './core/services/tools.service';
import { VisitLoggerService } from './core/services/visit-logger.service';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';
import { MetaService } from './core/services/meta.service';
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
    BackToTopComponent
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
  private metaService = inject(MetaService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Initialize Google Analytics (only in production, not localhost)
    this.googleAnalytics.initialize();

    this.metaService.setSiteJsonLd(
      this.metaService.buildWebSiteJsonLd({
        name: 'All The Things',
        url: 'https://www.allthethings.dev/',
        searchUrl: 'https://www.allthethings.dev/tools?search={search_term_string}'
      })
    );

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
