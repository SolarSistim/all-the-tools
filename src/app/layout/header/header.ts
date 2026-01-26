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

  // Track if we have a pending scroll update
  private scrollTicking = false;

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
   * Uses requestAnimationFrame to prevent forced reflows
   */
  private onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Only schedule one update per frame
    if (!this.scrollTicking) {
      requestAnimationFrame(() => {
        const scrollPosition = window.scrollY || this.document.documentElement.scrollTop;
        // Consider scrolled if user has scrolled more than 50px
        this.isScrolled.set(scrollPosition > 50);
        this.scrollTicking = false;
      });
      this.scrollTicking = true;
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
   * Get tools by category (for navigation - excludes conversion pairs)
   */
  getToolsByCategory(categoryId: string): Tool[] {
    return this.toolsService.getToolsByCategoryForNav(categoryId as any);
  }

  /**
   * Get all tools
   */
  get allTools(): Tool[] {
    return this.toolsService.getAllTools();
  }

  /**
   * Get all available tools sorted alphabetically by name (for navigation - excludes conversion pairs)
   */
  get sortedTools(): Tool[] {
    return [...this.toolsService.getAvailableToolsForNav()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get non-featured available tools for the mega menu (excludes conversion pairs)
   */
  get nonFeaturedTools(): Tool[] {
    const featured = this.featuredTools;
    return this.toolsService.getAvailableToolsForNav().filter(tool => !featured.some(ft => ft.id === tool.id));
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
    if (!isPlatformBrowser(this.platformId)) return;

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
   * Get count of tools in a category (for navigation - excludes conversion pairs)
   */
  getToolCount(categoryId: string): number {
    return this.toolsService.getToolCountByCategoryForNav(categoryId as any);
  }

  /**
   * Split tools into columns dynamically based on total count
   * Distributes tools evenly across 3 columns
   */
  getToolsForColumn(columnIndex: number): Tool[] {
    const tools = this.sortedTools;
    const toolsPerColumn = Math.ceil(tools.length / 3);
    const startIdx = columnIndex * toolsPerColumn;
    const endIdx = Math.min(startIdx + toolsPerColumn, tools.length);
    return tools.slice(startIdx, endIdx);
  }

  /**
   * Get number of columns needed (maximum 3)
   */
  getNumberOfColumns(): number {
    return Math.min(3, Math.ceil(this.sortedTools.length / 7));
  }

  /**
   * Check if a column should be shown
   */
  shouldShowColumn(columnIndex: number): boolean {
    return columnIndex < this.getNumberOfColumns();
  }

  /**
   * Split categories into columns dynamically
   */
  getCategoriesForColumn(columnIndex: number): ToolCategoryMeta[] {
    const categories = this.categoriesWithTools;
    const categoriesPerColumn = Math.ceil(categories.length / 3);
    const startIdx = columnIndex * categoriesPerColumn;
    const endIdx = Math.min(startIdx + categoriesPerColumn, categories.length);
    return categories.slice(startIdx, endIdx);
  }

  /**
   * Check if a category column should be shown
   */
  shouldShowCategoryColumn(columnIndex: number): boolean {
    return columnIndex < Math.min(3, Math.ceil(this.categoriesWithTools.length / 3));
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
}
