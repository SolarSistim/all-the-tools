import { Component, Input, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContentBlock, HeadingBlock } from '../../models/blog.models';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Table of Contents Component
 * Displays a floating/hamburger menu with clickable section headings
 */
@Component({
  selector: 'app-table-of-contents',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) blocks!: ContentBlock[];

  private platformId = inject(PLATFORM_ID);
  private readonly TOC_VISIBILITY_KEY = 'blog-toc-visible';

  tocItems: TocItem[] = [];
  isVisible: boolean = false; // Start hidden to prevent flash
  isMobile: boolean = false;
  activeId: string | null = null;

  private scrollListener: (() => void) | null = null;

  ngOnInit(): void {
    // Extract headings from content blocks
    this.extractHeadings();

    // Check if mobile
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfMobile();
      window.addEventListener('resize', () => this.handleResize());

      // Load visibility preference from localStorage
      this.loadVisibilityPreference();

      // Add scroll listener for active section highlighting
      this.addScrollListener();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollListener) {
      const sidenavContent = document.querySelector('mat-sidenav-content');
      if (sidenavContent) {
        sidenavContent.removeEventListener('scroll', this.scrollListener as any);
      }
    }
  }

  private extractHeadings(): void {
    this.tocItems = this.blocks
      .filter((block): block is HeadingBlock => block.type === 'heading')
      .map((block) => ({
        id: block.data.id || this.generateId(block.data.text),
        text: block.data.text,
        level: block.data.level,
      }));
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private checkIfMobile(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 769;
    }
  }

  private handleResize(): void {
    this.checkIfMobile();
  }

  private loadVisibilityPreference(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const savedVisibility = localStorage.getItem(this.TOC_VISIBILITY_KEY);
      if (savedVisibility !== null) {
        // Use saved preference
        this.isVisible = savedVisibility === 'true';
      } else {
        // No saved preference - visible on desktop, hidden on mobile
        this.isVisible = !this.isMobile;
      }
    } catch (error) {
      console.warn('Unable to load TOC visibility preference:', error);
      // Fallback: visible on desktop, hidden on mobile
      this.isVisible = !this.isMobile;
    }
  }

  private saveVisibilityPreference(visible: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.TOC_VISIBILITY_KEY, visible.toString());
    } catch (error) {
      console.warn('Unable to save TOC visibility preference:', error);
    }
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.saveVisibilityPreference(this.isVisible);
  }

  scrollToSection(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const targetElement = document.getElementById(id);
    const sidenavContent = document.querySelector('mat-sidenav-content');

    if (targetElement && sidenavContent) {
      // Get the element's current position relative to the viewport
      const elementRect = targetElement.getBoundingClientRect();

      // Get current scroll position
      const currentScroll = sidenavContent.scrollTop;

      // Calculate new scroll position:
      // Current scroll + element's position from top of viewport - desired offset (100px)
      const newScrollPosition = currentScroll + elementRect.top - 100;

      // Scroll the mat-sidenav-content element
      sidenavContent.scrollTo({
        top: newScrollPosition,
        behavior: 'smooth',
      });
    }

    // On mobile, close the TOC after clicking
    if (this.isMobile) {
      this.isVisible = false;
      this.saveVisibilityPreference(false);
    }
  }

  private addScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sidenavContent = document.querySelector('mat-sidenav-content');
    if (!sidenavContent) return;

    this.scrollListener = () => {
      this.updateActiveSection();
    };

    sidenavContent.addEventListener('scroll', this.scrollListener as any);
  }

  private updateActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Find which section is currently in view
    const sidenavContent = document.querySelector('mat-sidenav-content');
    if (!sidenavContent) return;

    const scrollPosition = sidenavContent.scrollTop + 150; // Offset for better UX

    // Find the last heading that's above the scroll position
    let activeId: string | null = null;

    for (const item of this.tocItems) {
      const element = document.getElementById(item.id);
      if (element && element.offsetTop <= scrollPosition) {
        activeId = item.id;
      }
    }

    this.activeId = activeId;
  }

}
