import { Component, signal, inject, OnInit, OnDestroy, HostBinding, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { ToolsService } from '../../core/services/tools.service';
import { SidenavService } from '../../core/services/sidenav.service';
import { ToolCategoryMeta, Tool } from '../../core/models/tool.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatTabsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private toolsService = inject(ToolsService);
  private sidenavService = inject(SidenavService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  // Mobile menu state
  mobileMenuOpen = signal(false);

  // Theme state (dark by default for retro-futuristic aesthetic)
  isDarkTheme = signal(true);

  // Scroll state for dynamic header styling
  isScrolled = signal(false);

  // Bind scrolled class to host element
  @HostBinding('class.scrolled') get scrolledClass() {
    return this.isScrolled();
  }

  // Get all tool categories for the Tools dropdown
  get categories(): ToolCategoryMeta[] {
    return this.toolsService.getAllCategories();
  }

  // Get categories that have tools (for mega menu layout)
  get categoriesWithTools(): ToolCategoryMeta[] {
    return this.categories.filter(category => this.getToolCount(category.id) > 0);
  }

  // Get featured tools for quick access
  get featuredTools() {
    return this.toolsService.getFeaturedTools();
  }

  // Expose Math for template usage
  Math = Math;

  // ViewChild to access the tools menu trigger
  @ViewChild('toolsMenuTrigger') toolsMenuTrigger!: MatMenuTrigger;

  ngOnInit(): void {
    // Load saved theme from localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.loadThemeFromStorage();
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngOnDestroy(): void {
    // Clean up scroll listener (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  /**
   * Handle scroll event - update header state
   */
  private onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.scrollY || this.document.documentElement.scrollTop;
      // Consider scrolled if user has scrolled more than 50px
      this.isScrolled.set(scrollPosition > 50);
    }
  }

  /**
   * Toggle mobile sidebar menu
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /**
   * Close the tools mega menu
   */
  closeMegaMenu(): void {
    if (this.toolsMenuTrigger) {
      this.toolsMenuTrigger.closeMenu();
    }
  }

  /**
   * Toggle tools sidenav
   */
  toggleToolsSidenav(): void {
    this.sidenavService.toggleToolsSidenav();
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(categoryId: string): Tool[] {
    return this.toolsService.getToolsByCategory(categoryId as any);
  }

  /**
   * Get all tools
   */
  get allTools(): Tool[] {
    return this.toolsService.getAllTools();
  }

  /**
   * Get all tools sorted alphabetically by name
   */
  get sortedTools(): Tool[] {
    return [...this.allTools].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get non-featured tools for the mega menu
   */
  get nonFeaturedTools(): Tool[] {
    const featured = this.featuredTools;
    return this.allTools.filter(tool => !featured.some(ft => ft.id === tool.id));
  }

  /**
   * Check if a tool is featured
   */
  isToolFeatured(toolId: string): boolean {
    return this.featuredTools.some(ft => ft.id === toolId);
  }

  /**
   * Load theme preference from localStorage
   */
  private loadThemeFromStorage(): void {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        this.isDarkTheme.set(isDark);

        // Apply the saved theme to the body
        if (isDark) {
          this.document.body.classList.remove('light-theme');
        } else {
          this.document.body.classList.add('light-theme');
        }
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.isDarkTheme.set(!this.isDarkTheme());

    // Toggle the theme class on the body element (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.isDarkTheme() ? 'dark' : 'light';

      // Save theme preference to localStorage
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }

      // Apply theme to body
      if (this.isDarkTheme()) {
        this.document.body.classList.remove('light-theme');
      } else {
        this.document.body.classList.add('light-theme');
      }
    }
  }

  /**
   * Get count of tools in a category
   */
  getToolCount(categoryId: string): number {
    return this.toolsService.getToolCountByCategory(categoryId as any);
  }
}
