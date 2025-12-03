import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  units: { [key: string]: Unit };
}

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonToggleModule,
    PageHeaderComponent,
    ToolCardComponent,
    CtaEmailList
  ],
  templateUrl: './unit-converter.html',
  styleUrl: './unit-converter.scss'
})
export class UnitConverter implements OnInit {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  ngOnInit(): void {
    this.metaService.updateTags({
      title: 'Unit Converter - Length, Weight, Temp, Volume, Area & Speed',
      description: 'Convert between length, weight, temperature, volume, area, and speed units. Support for metric and imperial systems.',
      keywords: ['unit converter', 'measurement converter', 'metric converter', 'imperial converter'],
      image: 'https://www.allthethings.dev/meta-images/og-unit-converter.png',
      url: 'https://www.allthethings.dev/tools/unit-converter'
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  // Category and unit selection
  selectedCategory = signal<string>('length');
  fromUnit = signal<string>('meter');
  toUnit = signal<string>('kilometer');

  // Input and result
  inputValue = signal<number | null>(null);
  resultValue = signal<number | null>(null);

  // Unit categories with conversion formulas (all conversions go through a base unit)
  unitCategories: { [key: string]: UnitCategory } = {
    length: {
      id: 'length',
      name: 'Length',
      icon: 'straighten',
      units: {
        meter: {
          name: 'Meter',
          symbol: 'm',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        kilometer: {
          name: 'Kilometer',
          symbol: 'km',
          toBase: (val) => val * 1000,
          fromBase: (val) => val / 1000
        },
        centimeter: {
          name: 'Centimeter',
          symbol: 'cm',
          toBase: (val) => val / 100,
          fromBase: (val) => val * 100
        },
        millimeter: {
          name: 'Millimeter',
          symbol: 'mm',
          toBase: (val) => val / 1000,
          fromBase: (val) => val * 1000
        },
        mile: {
          name: 'Mile',
          symbol: 'mi',
          toBase: (val) => val * 1609.344,
          fromBase: (val) => val / 1609.344
        },
        yard: {
          name: 'Yard',
          symbol: 'yd',
          toBase: (val) => val * 0.9144,
          fromBase: (val) => val / 0.9144
        },
        foot: {
          name: 'Foot',
          symbol: 'ft',
          toBase: (val) => val * 0.3048,
          fromBase: (val) => val / 0.3048
        },
        inch: {
          name: 'Inch',
          symbol: 'in',
          toBase: (val) => val * 0.0254,
          fromBase: (val) => val / 0.0254
        }
      }
    },
    weight: {
      id: 'weight',
      name: 'Weight',
      icon: 'fitness_center',
      units: {
        kilogram: {
          name: 'Kilogram',
          symbol: 'kg',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        gram: {
          name: 'Gram',
          symbol: 'g',
          toBase: (val) => val / 1000,
          fromBase: (val) => val * 1000
        },
        milligram: {
          name: 'Milligram',
          symbol: 'mg',
          toBase: (val) => val / 1000000,
          fromBase: (val) => val * 1000000
        },
        pound: {
          name: 'Pound',
          symbol: 'lb',
          toBase: (val) => val * 0.453592,
          fromBase: (val) => val / 0.453592
        },
        ounce: {
          name: 'Ounce',
          symbol: 'oz',
          toBase: (val) => val * 0.0283495,
          fromBase: (val) => val / 0.0283495
        },
        ton: {
          name: 'Metric Ton',
          symbol: 't',
          toBase: (val) => val * 1000,
          fromBase: (val) => val / 1000
        }
      }
    },
    temperature: {
      id: 'temperature',
      name: 'Temperature',
      icon: 'thermostat',
      units: {
        celsius: {
          name: 'Celsius',
          symbol: '°C',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        fahrenheit: {
          name: 'Fahrenheit',
          symbol: '°F',
          toBase: (val) => (val - 32) * 5/9,
          fromBase: (val) => (val * 9/5) + 32
        },
        kelvin: {
          name: 'Kelvin',
          symbol: 'K',
          toBase: (val) => val - 273.15,
          fromBase: (val) => val + 273.15
        }
      }
    },
    volume: {
      id: 'volume',
      name: 'Volume',
      icon: 'water_drop',
      units: {
        liter: {
          name: 'Liter',
          symbol: 'L',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        milliliter: {
          name: 'Milliliter',
          symbol: 'mL',
          toBase: (val) => val / 1000,
          fromBase: (val) => val * 1000
        },
        gallon: {
          name: 'Gallon (US)',
          symbol: 'gal',
          toBase: (val) => val * 3.78541,
          fromBase: (val) => val / 3.78541
        },
        quart: {
          name: 'Quart (US)',
          symbol: 'qt',
          toBase: (val) => val * 0.946353,
          fromBase: (val) => val / 0.946353
        },
        cup: {
          name: 'Cup (US)',
          symbol: 'cup',
          toBase: (val) => val * 0.236588,
          fromBase: (val) => val / 0.236588
        },
        fluidOunce: {
          name: 'Fluid Ounce (US)',
          symbol: 'fl oz',
          toBase: (val) => val * 0.0295735,
          fromBase: (val) => val / 0.0295735
        }
      }
    },
    area: {
      id: 'area',
      name: 'Area',
      icon: 'crop_square',
      units: {
        squareMeter: {
          name: 'Square Meter',
          symbol: 'm²',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        squareKilometer: {
          name: 'Square Kilometer',
          symbol: 'km²',
          toBase: (val) => val * 1000000,
          fromBase: (val) => val / 1000000
        },
        squareFoot: {
          name: 'Square Foot',
          symbol: 'ft²',
          toBase: (val) => val * 0.092903,
          fromBase: (val) => val / 0.092903
        },
        squareMile: {
          name: 'Square Mile',
          symbol: 'mi²',
          toBase: (val) => val * 2589988.11,
          fromBase: (val) => val / 2589988.11
        },
        acre: {
          name: 'Acre',
          symbol: 'ac',
          toBase: (val) => val * 4046.86,
          fromBase: (val) => val / 4046.86
        },
        hectare: {
          name: 'Hectare',
          symbol: 'ha',
          toBase: (val) => val * 10000,
          fromBase: (val) => val / 10000
        }
      }
    },
    speed: {
      id: 'speed',
      name: 'Speed',
      icon: 'speed',
      units: {
        meterPerSecond: {
          name: 'Meter per Second',
          symbol: 'm/s',
          toBase: (val) => val,
          fromBase: (val) => val
        },
        kilometerPerHour: {
          name: 'Kilometer per Hour',
          symbol: 'km/h',
          toBase: (val) => val / 3.6,
          fromBase: (val) => val * 3.6
        },
        milePerHour: {
          name: 'Mile per Hour',
          symbol: 'mph',
          toBase: (val) => val * 0.44704,
          fromBase: (val) => val / 0.44704
        },
        knot: {
          name: 'Knot',
          symbol: 'kn',
          toBase: (val) => val * 0.514444,
          fromBase: (val) => val / 0.514444
        }
      }
    }
  };

  getCategoryList(): UnitCategory[] {
    return Object.values(this.unitCategories);
  }

  getCurrentCategory(): UnitCategory {
    return this.unitCategories[this.selectedCategory()];
  }

  getUnitList(): string[] {
    return Object.keys(this.getCurrentCategory().units);
  }

  getUnitName(unitKey: string): string {
    const unit = this.getCurrentCategory().units[unitKey];
    return unit ? `${unit.name} (${unit.symbol})` : unitKey;
  }

  onCategoryChange(): void {
    const units = this.getUnitList();
    this.fromUnit.set(units[0]);
    this.toUnit.set(units[1] || units[0]);
    this.convert();
  }

  convert(): void {
    const value = this.inputValue();

    if (value === null || isNaN(value)) {
      this.resultValue.set(null);
      return;
    }

    const category = this.getCurrentCategory();
    const fromUnitObj = category.units[this.fromUnit()];
    const toUnitObj = category.units[this.toUnit()];

    if (!fromUnitObj || !toUnitObj) {
      this.resultValue.set(null);
      return;
    }

    // Convert to base unit, then to target unit
    const baseValue = fromUnitObj.toBase(value);
    const result = toUnitObj.fromBase(baseValue);

    this.resultValue.set(result);
  }

  swapUnits(): void {
    const temp = this.fromUnit();
    this.fromUnit.set(this.toUnit());
    this.toUnit.set(temp);

    // Also swap values
    const tempValue = this.inputValue();
    this.inputValue.set(this.resultValue());
    this.resultValue.set(tempValue);

    this.convert();
  }

    scrollToUnitConverter(): void {
    const element = document.querySelector('.cta-button');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
