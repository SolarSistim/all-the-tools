import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Pagination Component
 * Displays pagination controls for article listings
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() showPageNumbers: boolean = true;
  @Input() maxPageNumbers: number = 5;

  @Output() pageChange = new EventEmitter<number>();

  /**
   * Get array of page numbers to display
   */
  get visiblePages(): (number | string)[] {
    if (this.totalPages <= this.maxPageNumbers) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfMax = Math.floor(this.maxPageNumbers / 2);

    if (this.currentPage <= halfMax + 1) {
      // Near the start
      for (let i = 1; i <= this.maxPageNumbers - 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.totalPages);
    } else if (this.currentPage >= this.totalPages - halfMax) {
      // Near the end
      pages.push(1);
      pages.push('...');
      for (let i = this.totalPages - (this.maxPageNumbers - 2); i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push(1);
      pages.push('...');
      for (let i = this.currentPage - halfMax + 1; i <= this.currentPage + halfMax - 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  isNumber(value: number | string): boolean {
    return typeof value === 'number';
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }
}
