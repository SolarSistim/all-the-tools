import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header/header';
import { FooterComponent } from './layout/footer/footer';
import { SidenavService } from './core/services/sidenav.service';
import { ToolsService } from './core/services/tools.service';
import { VisitLoggerService } from './core/services/visit-logger.service';
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
    FooterComponent
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

  ngOnInit(): void {
    // Log initial page visit
    this.visitLogger.logVisit(this.router.url);

    // Log subsequent navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.visitLogger.logVisit(event.urlAfterRedirects);
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