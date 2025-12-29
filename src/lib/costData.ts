/**
 * Comprehensive Cost Calculator Data
 * Single source of truth for cost calculations with fallback defaults
 * This ensures the calculator ALWAYS returns meaningful estimates
 */

// ============================================================================
// COUNTRY DATA & EXCHANGE RATES
// ============================================================================
export interface CountryData {
  id: string;
  name: string;
  currency: string;
  fx_rate: number; // Local currency per 1 USD
}

export const COUNTRIES: Record<string, CountryData> = {
  india: { id: 'india', name: 'India', currency: 'INR', fx_rate: 89.899376 }, // Dec 29, 2025
  usa: { id: 'usa', name: 'United States', currency: 'USD', fx_rate: 1.0 },
  singapore: { id: 'singapore', name: 'Singapore', currency: 'SGD', fx_rate: 1.285576 }, // Dec 29, 2025
  japan: { id: 'japan', name: 'Japan', currency: 'JPY', fx_rate: 156.087734 }, // Dec 29, 2025
  france: { id: 'france', name: 'France', currency: 'EUR', fx_rate: 0.849550 }, // Dec 29, 2025
  turkey: { id: 'turkey', name: 'Turkey', currency: 'TRY', fx_rate: 42.930601 }, // Dec 29, 2025
  thailand: { id: 'thailand', name: 'Thailand', currency: 'THB', fx_rate: 31.686234 }, // Dec 29, 2025
  canada: { id: 'canada', name: 'Canada', currency: 'CAD', fx_rate: 1.369706 }, // Dec 29, 2025
  norway: { id: 'norway', name: 'Norway', currency: 'NOK', fx_rate: 10.044163 }, // Dec 29, 2025
};

// Default country (fallback)
export const DEFAULT_COUNTRY = COUNTRIES.india;

// ============================================================================
// BASE CLINICAL COSTS (per country, in local currency)
// ============================================================================
export interface BaseCosts {
  surgery: number;
  chemo_per_cycle: number;
  radiation_per_fraction: number;
  transplant: number;
  pet_ct: number;
  mri_ct: number;
  ngsp_panel: number;
  opd_consult: number;
  room_per_day: number;
  icu_per_day: number;
}

export const BASE_COSTS: Record<string, BaseCosts> = {
  india: {
    surgery: 300000,
    chemo_per_cycle: 50000,
    radiation_per_fraction: 3000,
    transplant: 1500000,
    pet_ct: 25000,
    mri_ct: 8000,
    ngsp_panel: 100000,
    opd_consult: 1500,
    room_per_day: 3000,
    icu_per_day: 8000,
  },
  usa: {
    surgery: 50000,
    chemo_per_cycle: 10000,
    radiation_per_fraction: 500,
    transplant: 250000,
    pet_ct: 5000,
    mri_ct: 1500,
    ngsp_panel: 15000,
    opd_consult: 300,
    room_per_day: 2000,
    icu_per_day: 5000,
  },
  singapore: {
    surgery: 30000,
    chemo_per_cycle: 6000,
    radiation_per_fraction: 350,
    transplant: 150000,
    pet_ct: 3000,
    mri_ct: 1000,
    ngsp_panel: 10000,
    opd_consult: 200,
    room_per_day: 1200,
    icu_per_day: 3000,
  },
  japan: {
    surgery: 4500000,
    chemo_per_cycle: 750000,
    radiation_per_fraction: 45000,
    transplant: 20000000,
    pet_ct: 400000,
    mri_ct: 120000,
    ngsp_panel: 1500000,
    opd_consult: 30000,
    room_per_day: 150000,
    icu_per_day: 400000,
  },
  france: {
    surgery: 25000,
    chemo_per_cycle: 5000,
    radiation_per_fraction: 300,
    transplant: 120000,
    pet_ct: 2500,
    mri_ct: 800,
    ngsp_panel: 8000,
    opd_consult: 150,
    room_per_day: 1000,
    icu_per_day: 2500,
  },
  turkey: {
    surgery: 400000,
    chemo_per_cycle: 80000,
    radiation_per_fraction: 5000,
    transplant: 2000000,
    pet_ct: 40000,
    mri_ct: 15000,
    ngsp_panel: 150000,
    opd_consult: 3000,
    room_per_day: 20000,
    icu_per_day: 50000,
  },
  thailand: {
    surgery: 350000,
    chemo_per_cycle: 70000,
    radiation_per_fraction: 4500,
    transplant: 1800000,
    pet_ct: 35000,
    mri_ct: 12000,
    ngsp_panel: 140000,
    opd_consult: 2500,
    room_per_day: 18000,
    icu_per_day: 45000,
  },
  canada: {
    surgery: 45000,
    chemo_per_cycle: 9000,
    radiation_per_fraction: 450,
    transplant: 230000,
    pet_ct: 4500,
    mri_ct: 1400,
    ngsp_panel: 14000,
    opd_consult: 280,
    room_per_day: 1800,
    icu_per_day: 4500,
  },
  norway: {
    surgery: 400000,
    chemo_per_cycle: 80000,
    radiation_per_fraction: 4000,
    transplant: 2000000,
    pet_ct: 40000,
    mri_ct: 15000,
    ngsp_panel: 120000,
    opd_consult: 3000,
    room_per_day: 25000,
    icu_per_day: 60000,
  },
};

// Default base costs (India as baseline, converted to USD)
export const DEFAULT_BASE_COSTS: BaseCosts = {
  surgery: 3614, // ~300000 INR / 83
  chemo_per_cycle: 602,
  radiation_per_fraction: 36,
  transplant: 18072,
  pet_ct: 301,
  mri_ct: 96,
  ngsp_panel: 1205,
  opd_consult: 18,
  room_per_day: 36,
  icu_per_day: 96,
};

// ============================================================================
// HOSPITAL TIER MULTIPLIERS
// ============================================================================
export const HOSPITAL_TIER_MULTIPLIERS: Record<string, number> = {
  tier_1: 1.3, // Quaternary Cancer Centre
  tier_2: 1.1, // Specialty Hospital
  tier_3: 1.0, // Regional Private Hospital
};

export const DEFAULT_HOSPITAL_TIER_MULTIPLIER = 1.0;

// ============================================================================
// ROOM CATEGORY MULTIPLIERS
// ============================================================================
export const ROOM_CATEGORY_MULTIPLIERS: Record<string, number> = {
  general: 0.8,
  semi_private: 1.0,
  private: 1.5,
  deluxe: 2.0,
};

export const DEFAULT_ROOM_CATEGORY_MULTIPLIER = 1.0;

// ============================================================================
// CHEMOTHERAPY REGIMEN MULTIPLIERS
// ============================================================================
export const REGIMEN_MULTIPLIERS: Record<string, number> = {
  standard_chemo: 1.0,
  targeted: 2.5,
  immunotherapy: 3.5,
  oral_tki: 2.0,
  combination: 4.0, // Chemo + IO
};

export const DEFAULT_REGIMEN_MULTIPLIER = 1.0;

// ============================================================================
// DRUG ACCESS MULTIPLIERS
// ============================================================================
export const DRUG_ACCESS_MULTIPLIERS: Record<string, number> = {
  originator: 1.0,
  generics: 0.6,
  biosimilars: 0.7,
};

export const DEFAULT_DRUG_ACCESS_MULTIPLIER = 0.6; // Generics as default

// ============================================================================
// RADIATION TECHNIQUE MULTIPLIERS
// ============================================================================
export const RADIATION_TECHNIQUE_MULTIPLIERS: Record<string, number> = {
  '2d': 0.5,
  '3d_crt': 1.0,
  imrt: 1.5,
  vmat: 1.8,
  sbrt: 2.5,
  proton: 5.0,
};

export const DEFAULT_RADIATION_TECHNIQUE_MULTIPLIER = 1.0;

// ============================================================================
// TRANSPLANT TYPE MULTIPLIERS
// ============================================================================
export const TRANSPLANT_TYPE_MULTIPLIERS: Record<string, number> = {
  autologous: 1.0,
  allogeneic: 1.8,
};

export const DEFAULT_TRANSPLANT_TYPE_MULTIPLIER = 1.0;

// ============================================================================
// SURGERY TYPE MULTIPLIERS (if needed for future differentiation)
// ============================================================================
export const SURGERY_TYPE_MULTIPLIERS: Record<string, number> = {
  lumpectomy: 0.6,
  mastectomy: 1.0,
  whipple: 1.5,
  lobectomy: 1.2,
  crs_hipec: 2.5,
};

export const DEFAULT_SURGERY_TYPE_MULTIPLIER = 1.0;

// ============================================================================
// ACCOMMODATION COSTS (per day, per person, in local currency)
// ============================================================================
export interface AccommodationCosts {
  budget: number;
  mid: number;
  premium: number;
}

export const ACCOMMODATION_COSTS: Record<string, AccommodationCosts> = {
  india: { budget: 1500, mid: 3500, premium: 8000 },
  usa: { budget: 80, mid: 150, premium: 300 },
  singapore: { budget: 60, mid: 120, premium: 250 },
  japan: { budget: 8000, mid: 15000, premium: 30000 },
  france: { budget: 70, mid: 130, premium: 280 },
  turkey: { budget: 1500, mid: 3000, premium: 7000 },
  thailand: { budget: 1200, mid: 2500, premium: 6000 },
  canada: { budget: 75, mid: 140, premium: 280 },
  norway: { budget: 900, mid: 1500, premium: 3000 },
};

export const DEFAULT_ACCOMMODATION_COSTS: AccommodationCosts = {
  budget: 18, // USD equivalent
  mid: 42,
  premium: 96,
};

// ============================================================================
// TRAVEL COST MULTIPLIERS
// ============================================================================
export const TRAVEL_TYPE_MULTIPLIERS: Record<string, number> = {
  economy: 1.0,
  premium: 1.8,
  business: 3.5,
};

export const DEFAULT_TRAVEL_TYPE_MULTIPLIER = 1.0;
export const BASE_FLIGHT_COST_USD = 500; // Base flight cost per person per trip

// ============================================================================
// LOCAL TRANSPORT COSTS (per day, in USD)
// ============================================================================
export const LOCAL_TRANSPORT_COSTS: Record<string, number> = {
  daily_cab: 30,
  public: 10,
  hospital_shuttle: 5,
};

export const DEFAULT_LOCAL_TRANSPORT_COST = 30;

// ============================================================================
// FOOD COST (per day, per person, in USD)
// ============================================================================
export const FOOD_COST_PER_DAY_USD = 50;

// ============================================================================
// INSURANCE DEFAULT COVERAGE
// ============================================================================
export interface InsuranceCoverage {
  inpatient_coverage: number; // percentage
  outpatient_coverage: number;
  drug_coverage: number;
}

export const DEFAULT_INSURANCE_COVERAGE: InsuranceCoverage = {
  inpatient_coverage: 80,
  outpatient_coverage: 50,
  drug_coverage: 70,
};

// ============================================================================
// CANCER TYPE & STAGE IMPACT (for future use)
// ============================================================================
// These can be used to adjust costs based on cancer type and stage
// Currently using flat rates, but can be enhanced
export const CANCER_CATEGORY_MULTIPLIERS: Record<string, number> = {
  common: 1.0,
  rare: 1.2, // Slightly higher due to specialized care
  ultra_rare: 1.5, // Higher due to experimental/rare treatments
};

export const STAGE_MULTIPLIERS: Record<string, number> = {
  stage_1: 0.8, // Early stage, less intensive
  stage_2: 1.0,
  stage_3: 1.2, // More intensive treatment
  stage_4: 1.5, // Metastatic, highest intensity
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get country data with fallback
 */
export function getCountryData(countryId: string | null | undefined): CountryData {
  if (!countryId) return DEFAULT_COUNTRY;
  return COUNTRIES[countryId] || DEFAULT_COUNTRY;
}

/**
 * Get base costs with fallback
 */
export function getBaseCosts(countryId: string | null | undefined): BaseCosts {
  if (!countryId) return DEFAULT_BASE_COSTS;
  const costs = BASE_COSTS[countryId];
  if (!costs) {
    // Convert default (USD) to local currency
    const country = getCountryData(countryId);
    return {
      surgery: DEFAULT_BASE_COSTS.surgery * country.fx_rate,
      chemo_per_cycle: DEFAULT_BASE_COSTS.chemo_per_cycle * country.fx_rate,
      radiation_per_fraction: DEFAULT_BASE_COSTS.radiation_per_fraction * country.fx_rate,
      transplant: DEFAULT_BASE_COSTS.transplant * country.fx_rate,
      pet_ct: DEFAULT_BASE_COSTS.pet_ct * country.fx_rate,
      mri_ct: DEFAULT_BASE_COSTS.mri_ct * country.fx_rate,
      ngsp_panel: DEFAULT_BASE_COSTS.ngsp_panel * country.fx_rate,
      opd_consult: DEFAULT_BASE_COSTS.opd_consult * country.fx_rate,
      room_per_day: DEFAULT_BASE_COSTS.room_per_day * country.fx_rate,
      icu_per_day: DEFAULT_BASE_COSTS.icu_per_day * country.fx_rate,
    };
  }
  return costs;
}

/**
 * Get accommodation costs with fallback
 */
export function getAccommodationCosts(countryId: string | null | undefined): AccommodationCosts {
  if (!countryId) return DEFAULT_ACCOMMODATION_COSTS;
  const costs = ACCOMMODATION_COSTS[countryId];
  if (!costs) {
    const country = getCountryData(countryId);
    return {
      budget: DEFAULT_ACCOMMODATION_COSTS.budget * country.fx_rate,
      mid: DEFAULT_ACCOMMODATION_COSTS.mid * country.fx_rate,
      premium: DEFAULT_ACCOMMODATION_COSTS.premium * country.fx_rate,
    };
  }
  return costs;
}

/**
 * Normalize a number (handle NaN, null, undefined, negative)
 */
export function normalizeNumber(value: any, defaultValue: number = 0, min: number = 0): number {
  const num = typeof value === 'number' ? value : parseFloat(value) || defaultValue;
  return Math.max(min, isNaN(num) ? defaultValue : num);
}

/**
 * Clamp a number to a range
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

