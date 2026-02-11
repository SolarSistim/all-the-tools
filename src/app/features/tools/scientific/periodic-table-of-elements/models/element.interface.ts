export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type StandardState = 'solid' | 'liquid' | 'gas' | 'unknown';

export type ChemicalBlock = 's' | 'p' | 'd' | 'f';

export type ColorMetric =
  | 'category'
  | 'state'
  | 'block'
  | 'atomicMass'
  | 'electronegativity'
  | 'atomicRadius'
  | 'ionizationEnergy'
  | 'electronAffinity'
  | 'meltingPoint'
  | 'boilingPoint'
  | 'density'
  | 'yearDiscovered';

export interface ColorMetricOption {
  value: ColorMetric;
  label: string;
  type: 'categorical' | 'continuous';
  unit?: string;
}

export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | null;
  density: number | null; // g/cm³
  meltingPoint: number | null; // Kelvin
  boilingPoint: number | null; // Kelvin
  electronegativity: number | null; // Pauling scale
  atomicRadius: number | null; // Picometers
  ionizationEnergy: number | null; // kJ/mol
  electronAffinity: number | null; // kJ/mol
  oxidationStates: number[];
  electronConfiguration: string;
  electronsPerShell: number[];
  category: ElementCategory;
  standardState: StandardState;
  block: ChemicalBlock;
  group: number | null; // 1-18, null for lanthanides/actinides
  period: number; // 1-7
  yearDiscovered: number | null;
  discoveredBy: string | null;
  cpkColor?: string;
}

export interface LegendItem {
  color: string;
  label: string;
  value?: string | number;
}
