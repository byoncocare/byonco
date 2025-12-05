// Mock / seed-aligned data for ByOnco Treatment Cost Calculator
// NOTE:
// - Country IDs, insurers, cost keys and structures are kept in sync
//   with the backend (seed_data.py, BASE_COSTS_DATA, ACCOMMODATION_COSTS_DATA).
// - fx_rate is the local currency value per 1 USD equivalent, used only
//   for display and INR conversion on the frontend. Always keep this
//   aligned with backend data.

export const countriesData = [
  { id: 'india',     name: 'India',          currency: 'INR', fx_rate: 83.0 },
  { id: 'usa',       name: 'United States',  currency: 'USD', fx_rate: 1.0 },
  { id: 'singapore', name: 'Singapore',      currency: 'SGD', fx_rate: 1.35 },
  { id: 'japan',     name: 'Japan',          currency: 'JPY', fx_rate: 150.0 },
  { id: 'france',    name: 'France',         currency: 'EUR', fx_rate: 0.92 },
  { id: 'turkey',    name: 'Turkey',         currency: 'TRY', fx_rate: 32.0 },
  { id: 'thailand',  name: 'Thailand',       currency: 'THB', fx_rate: 35.0 },
  { id: 'canada',    name: 'Canada',         currency: 'CAD', fx_rate: 1.38 },
  { id: 'norway',    name: 'Norway',         currency: 'NOK', fx_rate: 11.0 }
];

// Real insurers (health / medical) per country.
// Percentages are *default* coverage assumptions; can be overridden
// by customCoverage on the frontend.
export const insurersData = {
  india: [
    { id: 'india_1',  name: 'Aditya Birla Health Insurance',      inpatient_coverage: 80, outpatient_coverage: 50, drug_coverage: 70 },
    { id: 'india_2',  name: 'ManipalCigna Health Insurance',      inpatient_coverage: 85, outpatient_coverage: 60, drug_coverage: 75 },
    { id: 'india_3',  name: 'Niva Bupa Health Insurance',         inpatient_coverage: 80, outpatient_coverage: 55, drug_coverage: 70 },
    { id: 'india_4',  name: 'Care Health Insurance',              inpatient_coverage: 75, outpatient_coverage: 50, drug_coverage: 65 },
    { id: 'india_5',  name: 'Star Health & Allied Insurance',     inpatient_coverage: 80, outpatient_coverage: 55, drug_coverage: 70 },
    { id: 'india_6',  name: 'HDFC ERGO General Insurance',        inpatient_coverage: 85, outpatient_coverage: 60, drug_coverage: 75 },
    { id: 'india_7',  name: 'ICICI Lombard General Insurance',    inpatient_coverage: 85, outpatient_coverage: 60, drug_coverage: 75 },
    { id: 'india_8',  name: 'Bajaj Allianz General Insurance',    inpatient_coverage: 80, outpatient_coverage: 55, drug_coverage: 70 },
    { id: 'india_9',  name: 'Reliance General Insurance',         inpatient_coverage: 75, outpatient_coverage: 50, drug_coverage: 65 },
    { id: 'india_10', name: 'New India Assurance',                inpatient_coverage: 70, outpatient_coverage: 45, drug_coverage: 60 },
    { id: 'india_11', name: 'National Insurance Co. Ltd.',        inpatient_coverage: 70, outpatient_coverage: 45, drug_coverage: 60 },
    { id: 'india_12', name: 'Future Generali India Insurance',    inpatient_coverage: 75, outpatient_coverage: 50, drug_coverage: 65 }
  ],
  usa: [
    { id: 'usa_1',  name: 'UnitedHealthcare',             inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'usa_2',  name: 'Aetna (CVS Health)',           inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'usa_3',  name: 'Centene (Ambetter)',           inpatient_coverage: 75, outpatient_coverage: 65, drug_coverage: 70 },
    { id: 'usa_4',  name: 'Humana',                       inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'usa_5',  name: 'Anthem (Elevance Health)',     inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'usa_6',  name: 'Kaiser Permanente',            inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'usa_7',  name: 'BCBS (Blue Cross Blue Shield)',inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'usa_8',  name: 'Cigna Healthcare',             inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'usa_9',  name: 'Molina Healthcare',            inpatient_coverage: 75, outpatient_coverage: 65, drug_coverage: 70 },
    { id: 'usa_10', name: 'Highmark',                     inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'usa_11', name: 'GuideWell (Florida Blue)',     inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'usa_12', name: 'Regence (Cambia Health)',      inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 }
  ],
  singapore: [
    { id: 'singapore_1',  name: 'AIA Singapore',                      inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'singapore_2',  name: 'Great Eastern Life',                 inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'singapore_3',  name: 'HSBC Life Singapore',                inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'singapore_4',  name: 'Raffles Health Insurance',           inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'singapore_5',  name: 'Income Insurance',                   inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'singapore_6',  name: 'Allianz Insurance Singapore',        inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'singapore_7',  name: 'AIG Asia Pacific Insurance',         inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'singapore_8',  name: 'AXA Singapore',                      inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'singapore_9',  name: 'Cigna Global',                       inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'singapore_10', name: 'China Life Insurance (Singapore)',   inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'singapore_11', name: 'Etiqa Insurance',                    inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'singapore_12', name: 'Sompo Insurance Singapore',          inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 }
  ],
  japan: [
    { id: 'japan_1',  name: 'AXA Japan',                 inpatient_coverage: 80, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'japan_2',  name: 'Bupa Global',               inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'japan_3',  name: 'Allianz Care',              inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'japan_4',  name: 'Cigna Global',              inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'japan_5',  name: 'William Russell',           inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'japan_6',  name: 'VUMI',                      inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'japan_7',  name: 'IMG',                       inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'japan_8',  name: 'DavidShield',               inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'japan_9',  name: 'GeoBlue',                   inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'japan_10', name: 'Sompo Japan',               inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'japan_11', name: 'Nippon Life (Nissay)',      inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'japan_12', name: 'Dai-ichi Life',             inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 }
  ],
  france: [
    { id: 'france_1',  name: 'AXA France',             inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_2',  name: 'Allianz France',         inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_3',  name: 'CNP Assurances',         inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'france_4',  name: 'MGEN',                   inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_5',  name: 'Macif',                  inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'france_6',  name: 'Malakoff Humanis',       inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_7',  name: 'Generali France',        inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_8',  name: 'Groupama',               inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'france_9',  name: 'Harmonie Mutuelle',      inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'france_10', name: 'April International',    inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'france_11', name: 'AG2R La Mondiale',       inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'france_12', name: 'Bupa Global (France)',   inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 }
  ],
  turkey: [
    { id: 'turkey_1',  name: 'Allianz Türkiye',                 inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'turkey_2',  name: 'AXA Sigorta',                     inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'turkey_3',  name: 'Anadolu Sigorta',                 inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'turkey_4',  name: 'Zurich Sigorta',                  inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'turkey_5',  name: 'Bupa Acıbadem Sigorta',           inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'turkey_6',  name: 'Cigna Global',                    inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'turkey_7',  name: 'Demir Sağlık ve Hayat Sigorta',   inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'turkey_8',  name: 'Mapfre Sigorta',                  inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'turkey_9',  name: 'Anadolu Hayat Emeklilik',         inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'turkey_10', name: 'Quick Sigorta',                   inpatient_coverage: 70, outpatient_coverage: 55, drug_coverage: 65 },
    { id: 'turkey_11', name: 'Sompo Sigorta',                   inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'turkey_12', name: 'April International',             inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 }
  ],
  thailand: [
    { id: 'thailand_1',  name: 'AXA Thailand',           inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'thailand_2',  name: 'Aetna International',    inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'thailand_3',  name: 'Bupa Global',            inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'thailand_4',  name: 'AIA Thailand',           inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'thailand_5',  name: 'Thai Life Insurance',    inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'thailand_6',  name: 'Thai Health Insurance PLC', inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'thailand_7',  name: 'Pacific Cross',          inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'thailand_8',  name: 'Luma Health',            inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 },
    { id: 'thailand_9',  name: 'Allianz Ayudhya',        inpatient_coverage: 80, outpatient_coverage: 65, drug_coverage: 75 },
    { id: 'thailand_10', name: 'MSIG Thailand',          inpatient_coverage: 75, outpatient_coverage: 60, drug_coverage: 70 },
    { id: 'thailand_11', name: 'Cigna',                  inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'thailand_12', name: 'April International',    inpatient_coverage: 85, outpatient_coverage: 70, drug_coverage: 80 }
  ],
  canada: [
    { id: 'canada_1',  name: 'Blue Cross (Ontario)',           inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_2',  name: 'Manulife',                       inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'canada_3',  name: 'Canada Life',                    inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'canada_4',  name: 'Sun Life Financial',             inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'canada_5',  name: 'Desjardins',                     inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_6',  name: 'IA Financial Group',             inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_7',  name: 'Green Shield Canada (GSC)',      inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'canada_8',  name: 'GMS (Group Medical Services)',   inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_9',  name: 'RBC Insurance',                  inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_10', name: 'Equitable Life of Canada',       inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'canada_11', name: 'Empire Life',                    inpatient_coverage: 75, outpatient_coverage: 65, drug_coverage: 70 },
    { id: 'canada_12', name: 'SSQ / Beneva',                   inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 }
  ],
  norway: [
    { id: 'norway_1',  name: 'Bupa Global',              inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'norway_2',  name: 'AXA – Global Healthcare',  inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'norway_3',  name: 'If P&C Insurance',         inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'norway_4',  name: 'Gjensidige Forsikring',    inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'norway_5',  name: 'Storebrand',               inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 },
    { id: 'norway_6',  name: 'DNB Livsforsikring',       inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'norway_7',  name: 'Protector Forsikring',     inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'norway_8',  name: 'Tryg Forsikring',          inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'norway_9',  name: 'Fremtind',                 inpatient_coverage: 80, outpatient_coverage: 70, drug_coverage: 75 },
    { id: 'norway_10', name: 'Cigna Global',             inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'norway_11', name: 'Allianz Care',             inpatient_coverage: 90, outpatient_coverage: 80, drug_coverage: 85 },
    { id: 'norway_12', name: 'April International',      inpatient_coverage: 85, outpatient_coverage: 75, drug_coverage: 80 }
  ]
};

// Cancer disease types (a mix of common, rare and ultra-rare),
// used for UI and later for differential costing if needed.
export const cancerTypes = [
  { id: 'breast',          name: 'Breast Cancer',            category: 'common' },
  { id: 'lung_nsclc',      name: 'Lung Cancer (NSCLC)',      category: 'common' },
  { id: 'lung_sclc',       name: 'Lung Cancer (SCLC)',       category: 'common' },
  { id: 'colorectal',      name: 'Colorectal Cancer',        category: 'common' },
  { id: 'prostate',        name: 'Prostate Cancer',          category: 'common' },
  { id: 'pancreatic',      name: 'Pancreatic Cancer',        category: 'rare' },        // clinically tough, lower incidence
  { id: 'ovarian',         name: 'Ovarian Cancer',           category: 'common' },
  { id: 'head_neck',       name: 'Head & Neck Cancer',       category: 'common' },
  { id: 'leukemia_all',    name: 'Leukemia (ALL)',           category: 'rare' },
  { id: 'leukemia_aml',    name: 'Leukemia (AML)',           category: 'rare' },
  { id: 'leukemia_cll',    name: 'Leukemia (CLL)',           category: 'rare' },
  { id: 'lymphoma',        name: 'Lymphoma',                 category: 'common' },
  { id: 'multiple_myeloma',name: 'Multiple Myeloma',         category: 'rare' },
  { id: 'gbm',             name: 'Glioblastoma (GBM)',       category: 'ultra_rare' },
  { id: 'sarcoma',         name: 'Sarcoma',                  category: 'ultra_rare' }
];

export const stages = [
  { id: 'stage_1', name: 'Stage I (Localized)' },
  { id: 'stage_2', name: 'Stage II (Regional)' },
  { id: 'stage_3', name: 'Stage III (Locally Advanced)' },
  { id: 'stage_4', name: 'Stage IV (Metastatic)' }
];

export const hospitalTiers = [
  { id: 'tier_1', name: 'Tier 1 - Quaternary Cancer Centre', multiplier: 1.3 },
  { id: 'tier_2', name: 'Tier 2 - Speciality Hospital',      multiplier: 1.1 },
  { id: 'tier_3', name: 'Tier 3 - Regional Private Hospital',multiplier: 1.0 }
];

// Base clinical cost assumptions by country.
// Keys MUST match backend BASE_COSTS_DATA and cost_calculator_service.
export const baseCosts = {
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
    icu_per_day: 8000
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
    icu_per_day: 5000
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
    icu_per_day: 3000
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
    icu_per_day: 400000
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
    icu_per_day: 2500
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
    icu_per_day: 50000
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
    icu_per_day: 45000
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
    icu_per_day: 4500
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
    icu_per_day: 60000
  }
};

// Non-clinical accommodation assumptions by country.
// Used along with stayDuration & companions for medical tourism costs.
export const accommodationCosts = {
  india:     { budget: 1500, mid: 3500, premium: 8000 },
  usa:       { budget: 80,   mid: 150,  premium: 300  },
  singapore: { budget: 60,   mid: 120,  premium: 250  },
  japan:     { budget: 8000, mid: 15000,premium: 30000},
  france:    { budget: 70,   mid: 130,  premium: 280  },
  turkey:    { budget: 1500, mid: 3000, premium: 7000 },
  thailand:  { budget: 1200, mid: 2500, premium: 6000 },
  canada:    { budget: 75,   mid: 140,  premium: 280  },
  norway:    { budget: 900,  mid: 1500, premium: 3000 }
};

