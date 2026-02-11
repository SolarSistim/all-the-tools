import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Element, ColorMetric } from '../models/element.interface';
import { PropertyItemComponent } from './property-item.component';

@Component({
  selector: 'app-element-details-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    PropertyItemComponent
  ],
  template: `
    <div class="bottom-sheet-container">
      <div class="sheet-header">
        <div class="element-header">
          <div class="element-number">{{ data.element.atomicNumber }}</div>
          <div class="element-symbol">{{ data.element.symbol }}</div>
          <div class="element-name">{{ data.element.name }}</div>
        </div>
        <button
          mat-icon-button
          (click)="close()"
          aria-label="Close details">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="sheet-content">
        <div class="properties-grid">
          <app-property-item
            label="Atomic Number"
            [value]="data.element.atomicNumber"
            [copyable]="true" />

          <app-property-item
            label="Symbol"
            [value]="data.element.symbol"
            [copyable]="true" />

          <app-property-item
            label="Atomic Mass"
            [value]="data.element.atomicMass"
            unit="u"
            [highlighted]="data.selectedMetric === 'atomicMass'"
            [copyable]="true" />

          <app-property-item
            label="Category"
            [value]="formatCategory(data.element.category)"
            [highlighted]="data.selectedMetric === 'category'"
            [copyable]="false" />

          <app-property-item
            label="Standard State"
            [value]="formatState(data.element.standardState)"
            [highlighted]="data.selectedMetric === 'state'"
            [copyable]="false" />

          <app-property-item
            label="Block"
            [value]="data.element.block + '-block'"
            [highlighted]="data.selectedMetric === 'block'"
            [copyable]="false" />

          <app-property-item
            label="Group"
            [value]="data.element.group"
            [copyable]="true" />

          <app-property-item
            label="Period"
            [value]="data.element.period"
            [copyable]="true" />

          <app-property-item
            label="Electron Configuration"
            [value]="data.element.electronConfiguration"
            [copyable]="true" />

          <app-property-item
            label="Electronegativity"
            [value]="data.element.electronegativity"
            unit="Pauling"
            [highlighted]="data.selectedMetric === 'electronegativity'"
            [copyable]="true" />

          <app-property-item
            label="Atomic Radius"
            [value]="data.element.atomicRadius"
            unit="pm"
            [highlighted]="data.selectedMetric === 'atomicRadius'"
            [copyable]="true" />

          <app-property-item
            label="Ionization Energy"
            [value]="data.element.ionizationEnergy"
            unit="kJ/mol"
            [highlighted]="data.selectedMetric === 'ionizationEnergy'"
            [copyable]="true" />

          <app-property-item
            label="Electron Affinity"
            [value]="data.element.electronAffinity"
            unit="kJ/mol"
            [highlighted]="data.selectedMetric === 'electronAffinity'"
            [copyable]="true" />

          <app-property-item
            label="Density"
            [value]="data.element.density"
            unit="g/cm³"
            [highlighted]="data.selectedMetric === 'density'"
            [copyable]="true" />

          <app-property-item
            label="Melting Point"
            [value]="data.element.meltingPoint"
            unit="K"
            [highlighted]="data.selectedMetric === 'meltingPoint'"
            [copyable]="true" />

          <app-property-item
            label="Boiling Point"
            [value]="data.element.boilingPoint"
            unit="K"
            [highlighted]="data.selectedMetric === 'boilingPoint'"
            [copyable]="true" />

          <app-property-item
            label="Oxidation States"
            [value]="data.element.oxidationStates"
            [copyable]="true" />

          <app-property-item
            label="Year Discovered"
            [value]="data.element.yearDiscovered"
            [highlighted]="data.selectedMetric === 'yearDiscovered'"
            [copyable]="true" />

          <app-property-item
            label="Discovered By"
            [value]="data.element.discoveredBy"
            [copyable]="true" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bottom-sheet-container {
      padding: 1rem;
      max-height: 80vh;
      overflow-y: auto;
    }

    .sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .element-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .element-number {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .element-symbol {
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }

    .element-name {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
    }

    mat-divider {
      margin: 1rem 0;
    }

    .sheet-content {
      padding-bottom: 1rem;
    }

    .properties-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class ElementDetailsBottomSheetComponent {
  bottomSheetRef = inject(MatBottomSheetRef<ElementDetailsBottomSheetComponent>);
  data = inject<{ element: Element; selectedMetric: ColorMetric }>(MAT_BOTTOM_SHEET_DATA);

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  formatCategory(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatState(state: string): string {
    return state.charAt(0).toUpperCase() + state.slice(1);
  }
}
