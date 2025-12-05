import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Calculator,
  Building2,
  User,
  Syringe,
  Plane,
  Shield,
} from 'lucide-react';
import { countriesData, insurersData, cancerTypes, stages, hospitalTiers } from '@/lib/costCalculatorData';
import Spline from '@splinetool/react-spline';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API_BASE = `${BACKEND_URL}/api/cost-calculator`;
const INPUT_STEPS = 6; // 1–6 = form, 7 = results

const createInitialFormData = () => ({
  // Country & Hospital
  country: '',
  city: '',
  hospitalTier: '',
  accreditation: [],

  // Patient & Disease
  ageGroup: '',
  cancerCategory: '',
  cancerType: '',
  stage: '',
  intent: '',

  // Treatment - Surgery
  includeSurgery: false,
  surgeryType: '',
  surgeryDays: 3,
  icuDays: 0,
  roomCategory: 'semi_private',

  // Treatment - Chemotherapy
  includeChemo: false,
  regimenType: '',
  chemoCycles: 6,
  drugAccess: 'generics',

  // Treatment - Radiation
  includeRadiation: false,
  radiationTechnique: '',
  radiationFractions: 25,
  concurrentChemo: false,

  // Treatment - Transplant
  includeTransplant: false,
  transplantType: '',
  transplantDays: 30,

  // Diagnostics
  petCtCount: 2,
  mriCtCount: 4,
  includeNGS: false,
  opdConsults: 10,
  followUpMonths: 12,

  // Insurance
  hasInsurance: false,
  insurer: '',
  policyType: 'domestic',
  customCoverage: false,
  inpatientCoverage: 80,
  outpatientCoverage: 50,
  drugCoverage: 70,
  deductible: 0,
  copayPercent: 20,

  // Medical Tourism
  companions: 1,
  stayDuration: 60,
  accommodationLevel: 'mid',
  travelType: 'economy',
  returnTrips: 1,
  localTransport: 'daily_cab',

  // Admin
  complicationBuffer: 15,
  currency: 'USD',
});

const CostCalculator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(createInitialFormData);
  const [costResult, setCostResult] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [availableInsurers, setAvailableInsurers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // When country changes, sync currency + insurers
  useEffect(() => {
    if (formData.country) {
      const country = countriesData.find((c) => c.id === formData.country) || null;
      setSelectedCountryData(country);
      setAvailableInsurers(insurersData[formData.country] || []);
      setFormData((prev) => ({
        ...prev,
        currency: country?.currency || 'USD',
      }));
    } else {
      setSelectedCountryData(null);
      setAvailableInsurers([]);
    }
  }, [formData.country]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateBeforeCalculate = () => {
    const missing = [];

    if (!formData.country) missing.push('Destination Country');
    if (!formData.hospitalTier) missing.push('Hospital Type');
    if (!formData.cancerType) missing.push('Disease Type');
    if (!formData.stage) missing.push('Stage');

    if (!formData.includeSurgery && !formData.includeChemo && !formData.includeRadiation && !formData.includeTransplant) {
      missing.push('At least one treatment modality (Surgery / Chemo / Radiation / Transplant)');
    }

    if (missing.length) {
      setErrorMessage(
        `Please complete the following before calculating: ${missing.join(', ')}.`
      );
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const buildRequestPayload = () => {
    return {
      // Country & Hospital
      country: formData.country,
      city: formData.city || null,
      hospital_tier: formData.hospitalTier,
      accreditation: formData.accreditation,

      // Patient & Disease
      age_group: formData.ageGroup,
      cancer_category: formData.cancerCategory,
      cancer_type: formData.cancerType,
      stage: formData.stage,
      intent: formData.intent,

      // Treatment - Surgery
      include_surgery: formData.includeSurgery,
      surgery_type: formData.surgeryType || null,
      surgery_days: formData.surgeryDays,
      icu_days: formData.icuDays,
      room_category: formData.roomCategory,

      // Treatment - Chemotherapy
      include_chemo: formData.includeChemo,
      regimen_type: formData.regimenType || null,
      chemo_cycles: formData.chemoCycles,
      drug_access: formData.drugAccess,

      // Treatment - Radiation
      include_radiation: formData.includeRadiation,
      radiation_technique: formData.radiationTechnique || null,
      radiation_fractions: formData.radiationFractions,
      concurrent_chemo: formData.concurrentChemo,

      // Treatment - Transplant
      include_transplant: formData.includeTransplant,
      transplant_type: formData.transplantType || null,
      transplant_days: formData.transplantDays,

      // Diagnostics
      pet_ct_count: formData.petCtCount,
      mri_ct_count: formData.mriCtCount,
      include_ngs: formData.includeNGS,
      opd_consults: formData.opdConsults,
      follow_up_months: formData.followUpMonths,

      // Insurance
      has_insurance: formData.hasInsurance,
      insurer: formData.insurer || null,
      policy_type: formData.policyType,
      custom_coverage: formData.customCoverage,
      inpatient_coverage: formData.inpatientCoverage,
      outpatient_coverage: formData.outpatientCoverage,
      drug_coverage: formData.drugCoverage,
      deductible: formData.deductible,
      copay_percent: formData.copayPercent,

      // Medical Tourism
      companions: formData.companions,
      stay_duration: formData.stayDuration,
      accommodation_level: formData.accommodationLevel,
      travel_type: formData.travelType,
      return_trips: formData.returnTrips,
      local_transport: formData.localTransport,

      // Admin
      complication_buffer: formData.complicationBuffer,
      currency: formData.currency,
    };
  };

  const calculateCost = async () => {
    if (!validateBeforeCalculate()) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      const payload = buildRequestPayload();

      const response = await fetch(`${API_BASE}/calculate-cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || 'Failed to calculate cost.');
      }

      const data = await response.json();

      // Map backend snake_case fields into camelCase for UI
      const mappedResult = {
        totalCostLocal: data.total_cost_local,
        totalCostINR: data.total_cost_inr,
        clinicalCost: data.clinical_cost,
        nonClinicalCost: data.non_clinical_cost,
        insurancePays: data.insurance_pays,
        patientOutOfPocket: data.patient_out_of_pocket,
        breakdown: {
          surgery: data.breakdown.surgery,
          chemotherapy: data.breakdown.chemotherapy,
          radiation: data.breakdown.radiation,
          transplant: data.breakdown.transplant,
          diagnostics: data.breakdown.diagnostics,
          accommodation: data.breakdown.accommodation,
          travel: data.breakdown.travel,
          localTransport: data.breakdown.local_transport,
          food: data.breakdown.food,
        },
        currency: data.currency,
        assumptions: data.assumptions || [],
      };

      setCostResult(mappedResult);
      setStep(7);
    } catch (err) {
      console.error('Error calculating cost:', err);
      setErrorMessage(err.message || 'Something went wrong while calculating cost.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetCalculator = () => {
    setFormData(createInitialFormData());
    setCostResult(null);
    setSelectedCountryData(null);
    setAvailableInsurers([]);
    setErrorMessage('');
    setStep(1);
  };

  const displayCurrency =
    costResult?.currency || selectedCountryData?.currency || formData.currency;

  const renderStep1 = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 break-words" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Country & Hospital Details
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Destination Country</Label>
          <Select
            value={formData.country}
            onValueChange={(val) => handleInputChange('country', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select country" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              {countriesData.map((country) => (
                <SelectItem key={country.id} value={country.id} className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">City / Region (Optional)</Label>
            <Input
              placeholder="Enter city name"
              className="bg-purple-950/80 border-purple-500/30 text-slate-100 placeholder:text-purple-300/60 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
        </div>

        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Hospital Type</Label>
          <Select
            value={formData.hospitalTier}
            onValueChange={(val) => handleInputChange('hospitalTier', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select hospital tier" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              {hospitalTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id} className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Accreditations (Optional)</Label>
          <div className="space-y-2 sm:space-y-3 mt-2">
            {['JCI', 'NABH', 'NCQA', 'ISO'].map((acc) => (
              <div key={acc} className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id={acc}
                  checked={formData.accreditation.includes(acc)}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked;
                    if (isChecked) {
                      handleInputChange('accreditation', [
                        ...formData.accreditation,
                        acc,
                      ]);
                    } else {
                      handleInputChange(
                        'accreditation',
                        formData.accreditation.filter((a) => a !== acc)
                      );
                    }
                  }}
                />
                <label htmlFor={acc} className="text-xs sm:text-sm cursor-pointer text-purple-100">
                  {acc}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <User className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 break-words" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Patient & Disease Information
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Age Group</Label>
          <Select
            value={formData.ageGroup}
            onValueChange={(val) => handleInputChange('ageGroup', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select age group" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="pediatric" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Pediatric (&lt;18)</SelectItem>
              <SelectItem value="adult" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Adult (18-65)</SelectItem>
              <SelectItem value="geriatric" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Geriatric (&gt;65)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Cancer Category</Label>
          <Select
            value={formData.cancerCategory}
            onValueChange={(val) => handleInputChange('cancerCategory', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select cancer category" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="common" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Common</SelectItem>
              <SelectItem value="rare" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Rare</SelectItem>
              <SelectItem value="ultra_rare" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Ultra-rare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 sm:mb-3 block text-purple-100 font-medium text-sm sm:text-base">Disease Type</Label>
          <Select
            value={formData.cancerType}
            onValueChange={(val) => handleInputChange('cancerType', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-10 sm:h-11 text-sm sm:text-base">
              <SelectValue placeholder="Select cancer type" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              {cancerTypes.map((cancer) => (
                <SelectItem key={cancer.id} value={cancer.id} className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                  {cancer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block text-purple-100 font-medium">Stage</Label>
          <Select
            value={formData.stage}
            onValueChange={(val) => handleInputChange('stage', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select stage" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id} className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block text-purple-100 font-medium">Treatment Intent</Label>
          <Select
            value={formData.intent}
            onValueChange={(val) => handleInputChange('intent', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select intent" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="curative" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Curative</SelectItem>
              <SelectItem value="palliative" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Palliative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Syringe className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Treatment Plan
        </h2>
      </div>

      <Tabs defaultValue="surgery" className="w-full">
        <TabsList className="inline-flex h-auto w-full bg-purple-950/80 border border-purple-600/40 rounded-xl p-1.5 gap-2">
          <TabsTrigger value="surgery" className="text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 px-4 rounded-lg transition-all flex-1 min-w-0 text-sm sm:text-base font-medium">
            <span className="whitespace-nowrap">Surgery</span>
          </TabsTrigger>
          <TabsTrigger value="chemo" className="text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 px-4 rounded-lg transition-all flex-1 min-w-0 text-sm sm:text-base font-medium">
            <span className="whitespace-nowrap">Chemotherapy</span>
          </TabsTrigger>
          <TabsTrigger value="radiation" className="text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 px-4 rounded-lg transition-all flex-1 min-w-0 text-sm sm:text-base font-medium">
            <span className="whitespace-nowrap">Radiation</span>
          </TabsTrigger>
          <TabsTrigger value="transplant" className="text-purple-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 px-4 rounded-lg transition-all flex-1 min-w-0 text-sm sm:text-base font-medium">
            <span className="whitespace-nowrap">Transplant</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="surgery" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="includeSurgery"
              checked={formData.includeSurgery}
              onCheckedChange={(checked) =>
                handleInputChange('includeSurgery', !!checked)
              }
              className="border-purple-500/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor="includeSurgery" className="text-purple-100 cursor-pointer font-medium">Include Surgery</Label>
          </div>

          {formData.includeSurgery && (
            <div className="space-y-6 pl-4 border-l-2 border-purple-500/30 ml-2 mt-4">
              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Surgery Type</Label>
                <Select
                  value={formData.surgeryType}
                  onValueChange={(val) => handleInputChange('surgeryType', val)}
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select surgery type" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="lumpectomy" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Lumpectomy</SelectItem>
                    <SelectItem value="mastectomy" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Mastectomy</SelectItem>
                    <SelectItem value="whipple" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Whipple</SelectItem>
                    <SelectItem value="lobectomy" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Lobectomy</SelectItem>
                    <SelectItem value="crs_hipec" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">CRS + HIPEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block text-purple-100 font-medium mb-2">
                  Hospital Stay (days): {formData.surgeryDays}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[formData.surgeryDays]}
                    onValueChange={(val) => handleInputChange('surgeryDays', val[0])}
                    min={1}
                    max={30}
                    step={1}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="block text-purple-100 font-medium mb-2">
                  ICU Stay (days): {formData.icuDays}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[formData.icuDays]}
                    onValueChange={(val) => handleInputChange('icuDays', val[0])}
                    min={0}
                    max={15}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Room Category</Label>
                <Select
                  value={formData.roomCategory}
                  onValueChange={(val) => handleInputChange('roomCategory', val)}
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select room category" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="general" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">General Ward</SelectItem>
                    <SelectItem value="semi_private" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Semi-private</SelectItem>
                    <SelectItem value="private" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Private</SelectItem>
                    <SelectItem value="deluxe" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chemo" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="includeChemo"
              checked={formData.includeChemo}
              onCheckedChange={(checked) =>
                handleInputChange('includeChemo', !!checked)
              }
            />
            <Label htmlFor="includeChemo" className="text-purple-100 cursor-pointer font-medium">Include Chemotherapy</Label>
          </div>

          {formData.includeChemo && (
            <div className="space-y-6 pl-4 border-l-2 border-purple-500/30 ml-2 mt-4">
              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Regimen Type</Label>
                <Select
                  value={formData.regimenType}
                  onValueChange={(val) => handleInputChange('regimenType', val)}
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select regimen" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="standard_chemo" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Standard Chemotherapy</SelectItem>
                    <SelectItem value="targeted" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Targeted Therapy</SelectItem>
                    <SelectItem value="immunotherapy" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Immunotherapy (IO)</SelectItem>
                    <SelectItem value="oral_tki" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Oral TKIs</SelectItem>
                    <SelectItem value="combination" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                      Combination (Chemo + IO)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block text-purple-100 font-medium mb-2">
                  Number of Cycles: {formData.chemoCycles}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[formData.chemoCycles]}
                    onValueChange={(val) => handleInputChange('chemoCycles', val[0])}
                    min={1}
                    max={24}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Drug Access</Label>
                <Select
                  value={formData.drugAccess}
                  onValueChange={(val) => handleInputChange('drugAccess', val)}
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select drug access" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="originator" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Originator Only</SelectItem>
                    <SelectItem value="generics" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Generics Allowed</SelectItem>
                    <SelectItem value="biosimilars" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Biosimilars Allowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="radiation" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="includeRadiation"
              checked={formData.includeRadiation}
              onCheckedChange={(checked) =>
                handleInputChange('includeRadiation', !!checked)
              }
            />
            <Label htmlFor="includeRadiation" className="text-purple-100 cursor-pointer font-medium">Include Radiation Therapy</Label>
          </div>

          {formData.includeRadiation && (
            <div className="space-y-6 pl-4 border-l-2 border-purple-500/30 ml-2 mt-4">
              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Radiation Technique</Label>
                <Select
                  value={formData.radiationTechnique}
                  onValueChange={(val) =>
                    handleInputChange('radiationTechnique', val)
                  }
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select technique" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="2d" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">2D</SelectItem>
                    <SelectItem value="3d_crt" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">3D-CRT</SelectItem>
                    <SelectItem value="imrt" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">IMRT</SelectItem>
                    <SelectItem value="vmat" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">VMAT</SelectItem>
                    <SelectItem value="sbrt" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">SBRT</SelectItem>
                    <SelectItem value="proton" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Proton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block text-purple-100 font-medium mb-2">
                  Number of Fractions: {formData.radiationFractions}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[formData.radiationFractions]}
                    onValueChange={(val) =>
                      handleInputChange('radiationFractions', val[0])
                    }
                    min={1}
                    max={40}
                    step={1}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="concurrentChemo"
                  checked={formData.concurrentChemo}
                  onCheckedChange={(checked) =>
                    handleInputChange('concurrentChemo', !!checked)
                  }
                />
                <Label htmlFor="concurrentChemo" className="text-purple-100 cursor-pointer font-medium">Concurrent Chemotherapy</Label>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transplant" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="includeTransplant"
              checked={formData.includeTransplant}
              onCheckedChange={(checked) =>
                handleInputChange('includeTransplant', !!checked)
              }
            />
            <Label htmlFor="includeTransplant" className="text-purple-100 cursor-pointer font-medium">Include Transplant</Label>
          </div>

          {formData.includeTransplant && (
            <div className="space-y-6 pl-4 border-l-2 border-purple-500/30 ml-2 mt-4">
              <div>
                <Label className="mb-3 block text-purple-100 font-medium">Transplant Type</Label>
                <Select
                  value={formData.transplantType}
                  onValueChange={(val) =>
                    handleInputChange('transplantType', val)
                  }
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                    <SelectValue placeholder="Select transplant type" className="text-slate-100" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                    <SelectItem value="autologous" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Autologous</SelectItem>
                    <SelectItem value="allogeneic" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Allogeneic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block text-purple-100 font-medium mb-2">
                  Hospitalization Days: {formData.transplantDays}
                </Label>
                <div className="px-2">
                  <Slider
                    value={[formData.transplantDays]}
                    onValueChange={(val) =>
                      handleInputChange('transplantDays', val[0])
                    }
                    min={14}
                    max={60}
                    step={1}
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Diagnostics & Follow-up
        </h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">PET-CT Scans: {formData.petCtCount}</Label>
          <div className="px-2">
            <Slider
              value={[formData.petCtCount]}
              onValueChange={(val) => handleInputChange('petCtCount', val[0])}
              min={0}
              max={10}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">MRI/CT Scans: {formData.mriCtCount}</Label>
          <div className="px-2">
            <Slider
              value={[formData.mriCtCount]}
              onValueChange={(val) => handleInputChange('mriCtCount', val[0])}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 py-3">
          <Checkbox
            id="includeNGS"
            checked={formData.includeNGS}
            onCheckedChange={(checked) =>
              handleInputChange('includeNGS', !!checked)
            }
          />
          <Label htmlFor="includeNGS" className="text-purple-100 cursor-pointer font-medium">Include NGS Panel Testing</Label>
        </div>

        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">
            OPD Consultations: {formData.opdConsults}
          </Label>
          <div className="px-2">
            <Slider
              value={[formData.opdConsults]}
              onValueChange={(val) => handleInputChange('opdConsults', val[0])}
              min={1}
              max={30}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-3">Follow-up Horizon</Label>
          <Select
            value={formData.followUpMonths.toString()}
            onValueChange={(val) =>
              handleInputChange('followUpMonths', parseInt(val, 10))
            }
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select follow-up duration" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="6" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">6 Months</SelectItem>
              <SelectItem value="12" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">12 Months</SelectItem>
              <SelectItem value="24" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Insurance & Payment
        </h2>
      </div>

      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="hasInsurance"
            checked={formData.hasInsurance}
            onCheckedChange={(checked) =>
              handleInputChange('hasInsurance', !!checked)
            }
          />
          <Label htmlFor="hasInsurance" className="text-purple-100 cursor-pointer font-medium">I have insurance coverage</Label>
        </div>

        {formData.hasInsurance && (
          <div className="space-y-5 pl-6 mt-4">
            <div>
              <Label className="mb-3 block text-purple-100 font-medium">Insurance Provider</Label>
              <Select
                value={formData.insurer}
                onValueChange={(val) => handleInputChange('insurer', val)}
              >
                <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                  <SelectValue placeholder="Select insurance provider" className="text-slate-100" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                  {availableInsurers.map((insurer) => (
                    <SelectItem key={insurer.id} value={insurer.id} className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">
                      {insurer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block text-purple-100 font-medium">Policy Type</Label>
              <Select
                value={formData.policyType}
                onValueChange={(val) => handleInputChange('policyType', val)}
              >
                <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
                  <SelectValue placeholder="Select policy type" className="text-slate-100" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
                  <SelectItem value="domestic" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Domestic</SelectItem>
                  <SelectItem value="international" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">International</SelectItem>
                  <SelectItem value="travel_medical" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Travel Medical</SelectItem>
                  <SelectItem value="corporate" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Corporate Group Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="customCoverage"
                checked={formData.customCoverage}
                onCheckedChange={(checked) =>
                  handleInputChange('customCoverage', !!checked)
                }
              />
              <Label htmlFor="customCoverage" className="text-purple-100 cursor-pointer font-medium">Customize coverage percentages</Label>
            </div>

            {formData.customCoverage && (
              <div className="space-y-5 mt-4">
                <div className="space-y-3">
                  <Label className="block text-purple-100 font-medium mb-2">
                    Inpatient Coverage: {formData.inpatientCoverage}%
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={[formData.inpatientCoverage]}
                      onValueChange={(val) =>
                        handleInputChange('inpatientCoverage', val[0])
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="block text-purple-100 font-medium mb-2">
                    Outpatient Coverage: {formData.outpatientCoverage}%
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={[formData.outpatientCoverage]}
                      onValueChange={(val) =>
                        handleInputChange('outpatientCoverage', val[0])
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="block text-purple-100 font-medium mb-2">
                    Drug Coverage: {formData.drugCoverage}%
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={[formData.drugCoverage]}
                      onValueChange={(val) =>
                        handleInputChange('drugCoverage', val[0])
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-purple-100 font-medium">
                    Annual Deductible ({selectedCountryData?.currency || formData.currency})
                  </Label>
                  <Input
                    type="number"
                    className="bg-slate-800/60 border-purple-500/30 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    value={formData.deductible}
                    onChange={(e) =>
                      handleInputChange(
                        'deductible',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label className="block text-purple-100 font-medium mb-2">
                    Co-pay Percentage: {formData.copayPercent}%
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={[formData.copayPercent]}
                      onValueChange={(val) =>
                        handleInputChange('copayPercent', val[0])
                      }
                      min={0}
                      max={50}
                      step={5}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Medical Tourism Extras
        </h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">
            Number of Companions: {formData.companions}
          </Label>
          <div className="px-2">
            <Slider
              value={[formData.companions]}
              onValueChange={(val) => handleInputChange('companions', val[0])}
              min={0}
              max={5}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">
            Stay Duration (days): {formData.stayDuration}
          </Label>
          <div className="px-2">
            <Slider
              value={[formData.stayDuration]}
              onValueChange={(val) => handleInputChange('stayDuration', val[0])}
              min={7}
              max={180}
              step={1}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3 block text-purple-100 font-medium">Accommodation Level</Label>
          <Select
            value={formData.accommodationLevel}
            onValueChange={(val) =>
              handleInputChange('accommodationLevel', val)
            }
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select accommodation" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="budget" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Budget</SelectItem>
              <SelectItem value="mid" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Mid-range</SelectItem>
              <SelectItem value="premium" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block text-purple-100 font-medium">Travel Type</Label>
          <Select
            value={formData.travelType}
            onValueChange={(val) => handleInputChange('travelType', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select travel class" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="economy" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Economy</SelectItem>
              <SelectItem value="premium" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Premium Economy</SelectItem>
              <SelectItem value="business" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="block text-purple-100 font-medium mb-2">
            Return Trips: {formData.returnTrips}
          </Label>
          <div className="px-2">
            <Slider
              value={[formData.returnTrips]}
              onValueChange={(val) => handleInputChange('returnTrips', val[0])}
              min={1}
              max={5}
              step={1}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3 block text-purple-100 font-medium">Local Transport</Label>
          <Select
            value={formData.localTransport}
            onValueChange={(val) => handleInputChange('localTransport', val)}
          >
            <SelectTrigger className="w-full bg-purple-950/80 border-purple-500/30 text-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-11">
              <SelectValue placeholder="Select transport" className="text-slate-100" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-purple-500/40 shadow-xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] backdrop-blur-sm">
              <SelectItem value="daily_cab" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Daily Cab Service</SelectItem>
              <SelectItem value="public" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Public Transport</SelectItem>
              <SelectItem value="hospital_shuttle" className="text-white hover:bg-purple-600/60 cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600/60 focus:outline-none focus:text-white">Hospital Shuttle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block text-purple-100">
            Complication Buffer: {formData.complicationBuffer}%
          </Label>
          <Slider
            value={[formData.complicationBuffer]}
            onValueChange={(val) =>
              handleInputChange('complicationBuffer', val[0])
            }
            min={0}
            max={30}
            step={5}
          />
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-semibold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Cost Estimate
        </h2>
      </div>

      {costResult && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-emerald-900/30 via-slate-900/60 to-emerald-900/30 border-emerald-500/40 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Total Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-emerald-400 mb-2">
                {displayCurrency} {costResult.totalCostLocal.toLocaleString()}
              </div>
              <div className="text-lg text-purple-300">
                ≈ INR {costResult.totalCostINR.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-100">Clinical Cost</span>
                <span className="text-slate-100 font-semibold">
                  {displayCurrency} {costResult.clinicalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Non-clinical Cost</span>
                <span className="text-slate-100 font-semibold">
                  {displayCurrency} {costResult.nonClinicalCost.toLocaleString()}
                </span>
              </div>
              <Separator className="bg-purple-500/30" />
              <div className="flex justify-between font-semibold">
                <span className="text-cyan-400">Insurance Pays</span>
                <span className="text-cyan-400">
                  -{displayCurrency} {costResult.insurancePays.toLocaleString()}
                </span>
              </div>
              <Separator className="bg-purple-500/30" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Your Out-of-Pocket</span>
                <span className="text-emerald-400">
                  {displayCurrency} {costResult.patientOutOfPocket.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(costResult.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-purple-100 capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-slate-100 font-semibold">
                    {displayCurrency} {value.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {costResult.assumptions?.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Key Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {costResult.assumptions.map((a, idx) => (
                  <p key={idx} className="text-purple-100">
                    • {a}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3();
    if (step === 4) return renderStep4();
    if (step === 5) return renderStep5();
    if (step === 6) return renderStep6();
    return renderResults();
  };

  const handleNext = () => {
    if (step < INPUT_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1 && step <= INPUT_STEPS) {
      setStep((prev) => prev - 1);
    }
  };

  const progressWidth = `${(Math.min(step, INPUT_STEPS) / INPUT_STEPS) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0515] to-[#080510] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="text-purple-100 hover:text-purple-300 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
        <motion.div
          className="text-center mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Badge className="mb-3 sm:mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
            <Calculator className="h-3 w-3 mr-1.5 inline" />
            Cost Calculator
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent px-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Treatment Cost Calculator
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-100 max-w-2xl mx-auto px-2">
            Get accurate cost estimates for cancer treatment across 9 countries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >

            {/* Progress Indicator */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2 gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all text-xs sm:text-sm md:text-base ${
                      step >= s
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-purple-900/40 text-purple-200 border-2 border-purple-600/40'
                    } ${step === s ? 'ring-2 sm:ring-4 ring-cyan-500/50' : ''}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="h-1.5 sm:h-2 bg-purple-900/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: progressWidth }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <motion.div
                className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Form Content */}
            <Card className="bg-gradient-to-br from-[#0f0515] via-[#120a1a] to-[#0f0515] border-purple-600/40 shadow-2xl rounded-xl sm:rounded-2xl">
              <CardContent className="p-4 sm:p-6">
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                  {step > 1 && step <= INPUT_STEPS && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 min-h-[44px] w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
                      onClick={handlePrevious}
                      disabled={isLoading}
                    >
                      Previous
                    </Button>
                  )}

                  {step < INPUT_STEPS && (
                    <Button
                      type="button"
                      className="sm:ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white min-h-[44px] w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      Next
                    </Button>
                  )}

                  {step === INPUT_STEPS && (
                    <Button
                      type="button"
                      className="ml-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white min-h-[44px] w-full sm:w-auto"
                      onClick={calculateCost}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Calculating…' : 'Calculate Cost'}
                    </Button>
                  )}

                  {step === 7 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-purple-500/40 text-purple-300 hover:bg-purple-500/20 min-h-[44px] w-full sm:w-auto"
                      onClick={resetCalculator}
                      disabled={isLoading}
                    >
                      Start New Calculation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: 3D Spline */}
          <motion.div
            className="sticky top-4 sm:top-24 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl border border-purple-600/40 bg-purple-950/40 shadow-2xl">
              <Spline scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
