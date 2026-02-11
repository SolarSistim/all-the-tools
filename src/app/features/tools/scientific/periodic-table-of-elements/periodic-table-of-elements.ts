import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { MetaService } from '../../../../core/services/meta.service';
import { CustomSnackbarService } from '../../../../core/services/custom-snackbar.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { Element, ColorMetric, ElementCategory, StandardState } from './models/element.interface';
import { ELEMENTS, COLOR_METRIC_OPTIONS } from './data/elements.data';
import { ColorMapper } from './utils/color-mapping.util';
import { ColorLegendComponent } from './components/color-legend.component';
import { PropertyItemComponent } from './components/property-item.component';
import { ElementDetailsBottomSheetComponent } from './components/element-details-bottom-sheet.component';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';

@Component({
  selector: 'app-periodic-table-of-elements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatDividerModule,
    PageHeaderComponent,
    ColorLegendComponent,
    PropertyItemComponent,
    AdsenseComponent,
    CtaEmailList
  ],
  templateUrl: './periodic-table-of-elements.html',
  styleUrl: './periodic-table-of-elements.scss'
})
export class PeriodicTableOfElements implements OnInit, OnDestroy {
  private metaService = inject(MetaService);
  private snackbarService = inject(CustomSnackbarService);
  private breakpointObserver = inject(BreakpointObserver);
  private bottomSheet = inject(MatBottomSheet);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // Data
  readonly elements = ELEMENTS;
  readonly colorMetricOptions = COLOR_METRIC_OPTIONS;

  // State signals
  selectedElement = signal<Element | null>(null);
  searchQuery = signal<string>('');
  selectedColorMetric = signal<ColorMetric>('category');
  selectedCategories = signal<ElementCategory[]>([]);
  selectedStates = signal<StandardState[]>([]);
  isMobile = signal<boolean>(false);
  detailsPanelOpen = signal<boolean>(false);

  // Computed signals
  filteredElements = computed(() => {
    let filtered = [...this.elements];

    // Search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(element =>
        element.symbol.toLowerCase().includes(query) ||
        element.name.toLowerCase().includes(query) ||
        element.atomicNumber.toString() === query
      );
    }

    // Category filter
    const categories = this.selectedCategories();
    if (categories.length > 0) {
      filtered = filtered.filter(element => categories.includes(element.category));
    }

    // State filter
    const states = this.selectedStates();
    if (states.length > 0) {
      filtered = filtered.filter(element => states.includes(element.standardState));
    }

    return filtered;
  });

  colorScaleBounds = computed(() => {
    const metric = this.selectedColorMetric();

    // Only calculate bounds for continuous metrics
    const continuousMetrics: ColorMetric[] = [
      'atomicMass', 'electronegativity', 'atomicRadius', 'ionizationEnergy',
      'electronAffinity', 'meltingPoint', 'boilingPoint', 'density', 'yearDiscovered'
    ];

    if (!continuousMetrics.includes(metric)) {
      return { min: null, max: null, hasUnknown: false };
    }

    const values = this.elements
      .map(el => this.getMetricValue(el, metric))
      .filter((val): val is number => val !== null && val !== undefined);

    if (values.length === 0) {
      return { min: null, max: null, hasUnknown: true };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const hasUnknown = values.length < this.elements.length;

    return { min, max, hasUnknown };
  });

  // Available filter options
  readonly categoryOptions: ElementCategory[] = [
    'alkali-metal',
    'alkaline-earth-metal',
    'transition-metal',
    'post-transition-metal',
    'metalloid',
    'nonmetal',
    'halogen',
    'noble-gas',
    'lanthanide',
    'actinide'
  ];

  readonly stateOptions: StandardState[] = ['solid', 'liquid', 'gas'];

  ngOnInit(): void {
    this.updateMetaTags();
    this.setupResponsive();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateMetaTags(): void {
    this.metaService.updateTags({
      title: 'Interactive Periodic Table of Elements | All The Tools',
      description: 'Free interactive periodic table with all 118 elements. Explore the periodic table elements with detailed properties, color-coded metrics, and instant element search. The complete table of elements for students and professionals.',
      keywords: [
        'periodic table',
        'periodic table of elements',
        'periodic table elements',
        'table of elements',
        'elements table',
        'element table',
        'periodic',
        'elements',
        'element',
        'the periodic table',
        'chemical elements',
        'interactive periodic table',
        'chemistry periodic table',
        'element properties',
        'atomic elements'
      ],
      image: 'https://www.allthethings.dev/meta-images/og-periodic-table.jpg',
      url: 'https://www.allthethings.dev/tools/scientific/periodic-table-of-elements'
    });
  }

  private setupResponsive(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
        // Close details panel on mobile when switching views
        if (result.matches && this.detailsPanelOpen()) {
          this.closeDetailsPanel();
        }
      });
  }

  private setupSearch(): void {
    this.searchSubject$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.searchQuery.set(query);
      });
  }

  onSearchInput(query: string): void {
    this.searchSubject$.next(query);
  }

  onColorMetricChange(metric: ColorMetric): void {
    this.selectedColorMetric.set(metric);
    ColorMapper.clearCache();
  }

  selectElement(element: Element): void {
    this.selectedElement.set(element);

    if (this.isMobile()) {
      // Open bottom sheet on mobile
      this.bottomSheet.open(ElementDetailsBottomSheetComponent, {
        data: {
          element,
          selectedMetric: this.selectedColorMetric()
        },
        panelClass: 'element-details-sheet'
      });
    } else {
      // Open side panel on desktop
      this.detailsPanelOpen.set(true);
    }
  }

  closeDetailsPanel(): void {
    this.detailsPanelOpen.set(false);
    this.selectedElement.set(null);
  }

  scrollToTable(): void {
    const tableElement = document.getElementById('periodic-table');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategories.set([]);
    this.selectedStates.set([]);
  }

  hasActiveFilters(): boolean {
    return this.searchQuery() !== '' ||
           this.selectedCategories().length > 0 ||
           this.selectedStates().length > 0;
  }

  getElementColor(element: Element): string {
    const metric = this.selectedColorMetric();
    const value = this.getMetricValue(element, metric);
    const bounds = this.colorScaleBounds();

    return ColorMapper.getColor(metric, value, bounds.min ?? undefined, bounds.max ?? undefined);
  }

  getTextColor(element: Element): string {
    const bgColor = this.getElementColor(element);
    return ColorMapper.getTextColor(bgColor);
  }

  private getMetricValue(element: Element, metric: ColorMetric): any {
    switch (metric) {
      case 'category':
        return element.category;
      case 'state':
        return element.standardState;
      case 'block':
        return element.block;
      case 'atomicMass':
        return element.atomicMass;
      case 'electronegativity':
        return element.electronegativity;
      case 'atomicRadius':
        return element.atomicRadius;
      case 'ionizationEnergy':
        return element.ionizationEnergy;
      case 'electronAffinity':
        return element.electronAffinity;
      case 'meltingPoint':
        return element.meltingPoint;
      case 'boilingPoint':
        return element.boilingPoint;
      case 'density':
        return element.density;
      case 'yearDiscovered':
        return element.yearDiscovered;
      default:
        return null;
    }
  }

  getGridPosition(element: Element): { row: number; column: number } {
    const period = element.period;
    const group = element.group;

    // Lanthanides (row 9)
    if (element.atomicNumber >= 57 && element.atomicNumber <= 71) {
      return {
        row: 9,
        column: element.atomicNumber - 57 + 3 // Start at column 3
      };
    }

    // Actinides (row 10)
    if (element.atomicNumber >= 89 && element.atomicNumber <= 103) {
      return {
        row: 10,
        column: element.atomicNumber - 89 + 3 // Start at column 3
      };
    }

    // Regular elements
    return {
      row: period,
      column: group || 1
    }
  }

  isElementFiltered(element: Element): boolean {
    return !this.filteredElements().includes(element);
  }

  trackByAtomicNumber(index: number, element: Element): number {
    return element.atomicNumber;
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackbarService.success(`Copied ${label}: ${text}`);
    }).catch(() => {
      this.snackbarService.error('Failed to copy to clipboard');
    });
  }

  formatCategory(category: ElementCategory): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatState(state: StandardState): string {
    return state.charAt(0).toUpperCase() + state.slice(1);
  }

  // Keyboard navigation
  onElementKeydown(event: KeyboardEvent, element: Element): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectElement(element);
    }
  }

  onDetailsKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDetailsPanel();
    }
  }
}
