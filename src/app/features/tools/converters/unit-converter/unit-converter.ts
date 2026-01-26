import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToolsService } from '../../../../core/services/tools.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { MetaService } from '../../../../core/services/meta.service';
import { Tool, ToolCategoryMeta } from '../../../../core/models/tool.interface';
import { ToolCardComponent } from '../../../../shared/components/tool-card/tool-card';
import { CtaEmailList } from '../../../reusable-components/cta-email-list/cta-email-list';
import { AdsenseComponent } from '../../../blog/components/adsense/adsense.component';

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
    CtaEmailList,
    AdsenseComponent
  ],
  templateUrl: './unit-converter.html',
  styleUrl: './unit-converter.scss'
})
export class UnitConverter implements OnInit, OnDestroy {

  toolsService = inject(ToolsService);
  private metaService = inject(MetaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  featuredTools: Tool[] = [];
  categories: ToolCategoryMeta[] = [];

  // Track if we're on a specific pair page for dynamic content
  activePair = signal<{ from: string; to: string; category: string } | null>(null);

  // Subject for managing subscriptions
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Subscribe to route parameter changes to update meta tags when navigating between conversion pairs
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const pairParam = params.get('pair');

      if (pairParam) {
        this.handlePairRoute(pairParam);
      } else {
        // Default to length, meter to kilometer
        this.selectedCategory.set('length');
        this.fromUnit.set('meter');
        this.toUnit.set('kilometer');
        this.activePair.set(null);
        this.updateMetaTags();
      }
    });

    this.featuredTools = this.toolsService.getFeaturedTools();
    this.categories = this.toolsService.getAllCategories();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handlePairRoute(pairParam: string): void {
    // Split by '-to-'
    const parts = pairParam.split('-to-');
    if (parts.length !== 2) {
      // Invalid format, use defaults
      this.setDefaults();
      return;
    }

    const fromSlug = parts[0];
    const toSlug = parts[1];

    // Convert slugs to unit keys
    const fromKey = this.slugToUnitKey(fromSlug);
    const toKey = this.slugToUnitKey(toSlug);

    // Find which category contains these units
    let foundCategory: string | null = null;
    for (const [categoryId, category] of Object.entries(this.unitCategories)) {
      if (category.units[fromKey] && category.units[toKey]) {
        foundCategory = categoryId;
        break;
      }
    }

    if (foundCategory) {
      // Valid pair found
      this.selectedCategory.set(foundCategory);
      this.fromUnit.set(fromKey);
      this.toUnit.set(toKey);
      this.inputValue.set(1); // Pre-fill with 1 for immediate result
      this.activePair.set({
        from: fromKey,
        to: toKey,
        category: foundCategory
      });
      this.convert();
      this.updateMetaTags();
    } else {
      // Invalid pair, use defaults
      this.setDefaults();
    }
  }

  private setDefaults(): void {
    this.selectedCategory.set('length');
    this.fromUnit.set('meter');
    this.toUnit.set('kilometer');
    this.activePair.set(null);
    this.updateMetaTags();
  }

  /**
   * Get OG image URL for specific conversion pair
   */
  private getOgImageUrl(fromSlug?: string, toSlug?: string): string {
    // If we have both slugs, use pair-specific image from ImageKit
    if (fromSlug && toSlug) {
      if (fromSlug === 'kilogram' && toSlug === 'gram') {
        return 'https://ik.imagekit.io/allthethingsdev/unit%20converter/og-kilogram-to-gram-converter.jpg';
      }
      return `https://ik.imagekit.io/allthethingsdev/unit%20converter/og-${fromSlug}-to-${toSlug}.jpg`;
    }

    // Fallback to generic unit converter image
    return 'https://www.allthethings.dev/meta-images/og-unit-converter.png';
  }

  private updateMetaTags(): void {
    const pair = this.activePair();

    if (pair) {
      // Dynamic SEO for specific pair
      const category = this.unitCategories[pair.category];
      const fromUnit = category.units[pair.from];
      const toUnit = category.units[pair.to];
      const fromName = fromUnit.name;
      const toName = toUnit.name;
      const categoryName = category.name.toLowerCase();

      const fromSlug = this.unitKeyToSlug(pair.from);
      const toSlug = this.unitKeyToSlug(pair.to);

      const title = `${fromName} to ${toName} Converter | Fast & Private | AllTheThings`;
      const description = `Convert ${fromName} to ${toName} instantly. Accurate ${categoryName} conversion for engineering, cooking, and travel.`;
      const url = `https://www.allthethings.dev/tools/unit-converter/${fromSlug}-to-${toSlug}`;
      const ogImage = this.getOgImageUrl(fromSlug, toSlug);

      this.metaService.updateTags({
        title,
        description,
        keywords: [
          `${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
          `${fromName.toLowerCase()} ${toName.toLowerCase()} converter`,
          `convert ${fromName.toLowerCase()} to ${toName.toLowerCase()}`,
          `${categoryName} converter`
        ],
        image: ogImage,
        url,
        jsonLd: this.metaService.buildToolJsonLd({
          name: title,
          description,
          url,
          image: ogImage
        })
      });
    } else {
      // Generic SEO
      const ogImage = this.getOgImageUrl();
      this.metaService.updateTags({
        title: 'Unit Converter - Length, Weight, Temp, Volume, Area & Speed',
        description: 'Convert between length, weight, temperature, volume, area, and speed units. Support for metric and imperial systems.',
        keywords: ['unit converter', 'measurement converter', 'metric converter', 'imperial converter'],
        image: ogImage,
        url: 'https://www.allthethings.dev/tools/unit-converter',
        jsonLd: this.metaService.buildToolJsonLd({
          name: 'Unit Converter - Length, Weight, Temp, Volume, Area & Speed',
          description: 'Convert between length, weight, temperature, volume, area, and speed units. Support for metric and imperial systems.',
          url: 'https://www.allthethings.dev/tools/unit-converter',
          image: ogImage
        })
      });
    }
  }

  // Helper: Convert unit key to URL slug (camelCase to kebab-case)
  private unitKeyToSlug(unitKey: string): string {
    return unitKey
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  // Helper: Convert URL slug to unit key (kebab-case to camelCase)
  private slugToUnitKey(slug: string): string {
    return slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  // Update URL without page reload
  private updateUrl(): void {
    const fromSlug = this.unitKeyToSlug(this.fromUnit());
    const toSlug = this.unitKeyToSlug(this.toUnit());
    const newUrl = `/tools/unit-converter/${fromSlug}-to-${toSlug}`;

    // Navigate to new URL - the route param subscription will handle updating meta tags
    this.router.navigate([newUrl], { replaceUrl: true });
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
    this.updateUrl();
    this.convert();
  }

  onFromUnitChange(): void {
    this.updateUrl();
    this.convert();
  }

  onToUnitChange(): void {
    this.updateUrl();
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

    // Update URL to reflect new direction
    this.updateUrl();
    this.convert();
  }

  // Get dynamic h1 title
  getPageTitle(): string {
    const pair = this.activePair();
    if (pair) {
      const category = this.unitCategories[pair.category];
      const fromName = category.units[pair.from].name;
      const toName = category.units[pair.to].name;
      return `${fromName} to ${toName} Converter`;
    }
    return 'Unit Converter';
  }

  // Get hero category info (for icon display)
  getHeroCategory(): { name: string; icon: string } {
    const pair = this.activePair();
    if (pair) {
      const category = this.unitCategories[pair.category];
      return { name: category.name, icon: category.icon };
    }
    // Default to swap_horiz for generic converter
    return { name: 'Unit Converter', icon: 'swap_horiz' };
  }

  // Get dynamic hero description
  getHeroDescription(): string {
    const pair = this.activePair();
    if (pair) {
      const category = this.unitCategories[pair.category];
      const fromName = category.units[pair.from].name;
      const toName = category.units[pair.to].name;
      const categoryName = category.name.toLowerCase();

      return `Convert ${fromName} to ${toName} instantly with precision. Fast, accurate ${categoryName} conversion for engineering, cooking, travel, and everyday use.`;
    }

    return 'Convert between units of measurement instantly with precision. From length and weight to temperature and speed, get accurate conversions for any unit system. Perfect for engineering, cooking, travel, and everyday use.';
  }

  // Get dynamic bottom line content
  getBottomLineContent(): string {
    const pair = this.activePair();
    if (pair) {
      const category = this.unitCategories[pair.category];
      const fromName = category.units[pair.from].name;
      const toName = category.units[pair.to].name;
      const categoryName = category.name.toLowerCase();

      return `Our ${fromName} to ${toName} tool is a specialized part of our toolbox designed for high-precision ${categoryName} transformations. Whether you are converting ${fromName} for a technical drawing or ${toName} for a recipe, our browser-based calculator ensures accuracy to 6 decimal places. All conversions happen locally in your browser with complete privacy—no ${categoryName} values ever get transmitted to servers, ensuring confidential measurements stay on your device.`;
    }

    return 'This unit converter provides instant, precise conversions across six essential measurement categories: length (meter, kilometer, mile, yard, foot, inch, centimeter, millimeter), weight/mass (kilogram, gram, pound, ounce, ton, milligram), temperature (Celsius, Fahrenheit, Kelvin), volume (liter, gallon, quart, pint, cup, fluid ounce, milliliter), area (square meter, acre, hectare, square foot, square mile, square kilometer), and speed (meter per second, kilometer per hour, mile per hour, knot, foot per second). Select measurement category via visual category buttons, enter value to convert, choose from and to units from dropdown lists, and view results with up to 6 decimal places for precision. Bidirectional swap button reverses conversion direction instantly without re-entering values. Real-time calculation updates automatically as you modify input values or change units. Perfect for cooking recipe conversions, international travel planning, engineering calculations, construction measurements, fitness tracking, scientific computations, vehicle specifications, real estate comparisons, or any scenario requiring accurate unit transformations between metric, imperial, and specialized measurement systems. Category-based organization groups related units together—length units stay separate from weight units, temperature conversions isolated from volume calculations. Supports common conversions like kilometers to miles for road trips, Celsius to Fahrenheit for weather, liters to gallons for fuel consumption, kilograms to pounds for luggage weight, square meters to square feet for floor plans, and kilometers per hour to miles per hour for speedometers. All conversions use precise mathematical formulas and happen locally in your browser with complete privacy—no measurement values ever get transmitted to servers, ensuring confidential engineering specifications, proprietary calculations, or personal data stays on your device.';
  }

  scrollToUnitConverter(): void {
    const element = document.querySelector('.category-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
