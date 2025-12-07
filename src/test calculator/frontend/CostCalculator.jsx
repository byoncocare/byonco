import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API_BASE = `${BACKEND_URL}/api`;
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Country & Hospital Details
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Destination Country</Label>
          <Select
            value={formData.country}
            onValueChange={(val) => handleInputChange('country', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countriesData.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">City / Region (Optional)</Label>
          <Input
            placeholder="Enter city name"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2 block">Hospital Type</Label>
          <Select
            value={formData.hospitalTier}
            onValueChange={(val) => handleInputChange('hospitalTier', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select hospital tier" />
            </SelectTrigger>
            <SelectContent>
              {hospitalTiers.map((tier) => (
                <SelectItem key={tier.id} value={tier.id}>
                  {tier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Accreditations (Optional)</Label>
          <div className="space-y-2">
            {['JCI', 'NABH', 'NCQA', 'ISO'].map((acc) => (
              <div key={acc} className="flex items-center space-x-2">
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
                <label htmlFor={acc} className="text-sm cursor-pointer">
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
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Patient & Disease Information
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Age Group</Label>
          <Select
            value={formData.ageGroup}
            onValueChange={(val) => handleInputChange('ageGroup', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pediatric">Pediatric (&lt;18)</SelectItem>
              <SelectItem value="adult">Adult (18-65)</SelectItem>
              <SelectItem value="geriatric">Geriatric (&gt;65)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Cancer Category</Label>
          <Select
            value={formData.cancerCategory}
            onValueChange={(val) => handleInputChange('cancerCategory', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cancer category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="ultra_rare">Ultra-rare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Disease Type</Label>
          <Select
            value={formData.cancerType}
            onValueChange={(val) => handleInputChange('cancerType', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cancer type" />
            </SelectTrigger>
            <SelectContent>
              {cancerTypes.map((cancer) => (
                <SelectItem key={cancer.id} value={cancer.id}>
                  {cancer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Stage</Label>
          <Select
            value={formData.stage}
            onValueChange={(val) => handleInputChange('stage', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Treatment Intent</Label>
          <Select
            value={formData.intent}
            onValueChange={(val) => handleInputChange('intent', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curative">Curative</SelectItem>
              <SelectItem value="palliative">Palliative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Syringe className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Treatment Plan
        </h2>
      </div>

      <Tabs defaultValue="surgery" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="surgery">Surgery</TabsTrigger>
          <TabsTrigger value="chemo">Chemotherapy</TabsTrigger>
          <TabsTrigger value="radiation">Radiation</TabsTrigger>
          <TabsTrigger value="transplant">Transplant</TabsTrigger>
        </TabsList>

        <TabsContent value="surgery" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSurgery"
              checked={formData.includeSurgery}
              onCheckedChange={(checked) =>
                handleInputChange('includeSurgery', !!checked)
              }
            />
            <Label htmlFor="includeSurgery">Include Surgery</Label>
          </div>

          {formData.includeSurgery && (
            <div className="space-y-4 pl-6">
              <div>
                <Label className="mb-2 block">Surgery Type</Label>
                <Select
                  value={formData.surgeryType}
                  onValueChange={(val) => handleInputChange('surgeryType', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lumpectomy">Lumpectomy</SelectItem>
                    <SelectItem value="mastectomy">Mastectomy</SelectItem>
                    <SelectItem value="whipple">Whipple</SelectItem>
                    <SelectItem value="lobectomy">Lobectomy</SelectItem>
                    <SelectItem value="crs_hipec">CRS + HIPEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Hospital Stay (days): {formData.surgeryDays}
                </Label>
                <Slider
                  value={[formData.surgeryDays]}
                  onValueChange={(val) => handleInputChange('surgeryDays', val[0])}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  ICU Stay (days): {formData.icuDays}
                </Label>
                <Slider
                  value={[formData.icuDays]}
                  onValueChange={(val) => handleInputChange('icuDays', val[0])}
                  min={0}
                  max={15}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block">Room Category</Label>
                <Select
                  value={formData.roomCategory}
                  onValueChange={(val) => handleInputChange('roomCategory', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Ward</SelectItem>
                    <SelectItem value="semi_private">Semi-private</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="chemo" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeChemo"
              checked={formData.includeChemo}
              onCheckedChange={(checked) =>
                handleInputChange('includeChemo', !!checked)
              }
            />
            <Label htmlFor="includeChemo">Include Chemotherapy</Label>
          </div>

          {formData.includeChemo && (
            <div className="space-y-4 pl-6">
              <div>
                <Label className="mb-2 block">Regimen Type</Label>
                <Select
                  value={formData.regimenType}
                  onValueChange={(val) => handleInputChange('regimenType', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select regimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard_chemo">Standard Chemotherapy</SelectItem>
                    <SelectItem value="targeted">Targeted Therapy</SelectItem>
                    <SelectItem value="immunotherapy">Immunotherapy (IO)</SelectItem>
                    <SelectItem value="oral_tki">Oral TKIs</SelectItem>
                    <SelectItem value="combination">
                      Combination (Chemo + IO)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Number of Cycles: {formData.chemoCycles}
                </Label>
                <Slider
                  value={[formData.chemoCycles]}
                  onValueChange={(val) => handleInputChange('chemoCycles', val[0])}
                  min={1}
                  max={24}
                  step={1}
                />
              </div>

              <div>
                <Label className="mb-2 block">Drug Access</Label>
                <Select
                  value={formData.drugAccess}
                  onValueChange={(val) => handleInputChange('drugAccess', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="originator">Originator Only</SelectItem>
                    <SelectItem value="generics">Generics Allowed</SelectItem>
                    <SelectItem value="biosimilars">Biosimilars Allowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="radiation" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeRadiation"
              checked={formData.includeRadiation}
              onCheckedChange={(checked) =>
                handleInputChange('includeRadiation', !!checked)
              }
            />
            <Label htmlFor="includeRadiation">Include Radiation Therapy</Label>
          </div>

          {formData.includeRadiation && (
            <div className="space-y-4 pl-6">
              <div>
                <Label className="mb-2 block">Radiation Technique</Label>
                <Select
                  value={formData.radiationTechnique}
                  onValueChange={(val) =>
                    handleInputChange('radiationTechnique', val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2d">2D</SelectItem>
                    <SelectItem value="3d_crt">3D-CRT</SelectItem>
                    <SelectItem value="imrt">IMRT</SelectItem>
                    <SelectItem value="vmat">VMAT</SelectItem>
                    <SelectItem value="sbrt">SBRT</SelectItem>
                    <SelectItem value="proton">Proton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Number of Fractions: {formData.radiationFractions}
                </Label>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="concurrentChemo"
                  checked={formData.concurrentChemo}
                  onCheckedChange={(checked) =>
                    handleInputChange('concurrentChemo', !!checked)
                  }
                />
                <Label htmlFor="concurrentChemo">Concurrent Chemotherapy</Label>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transplant" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTransplant"
              checked={formData.includeTransplant}
              onCheckedChange={(checked) =>
                handleInputChange('includeTransplant', !!checked)
              }
            />
            <Label htmlFor="includeTransplant">Include Transplant</Label>
          </div>

          {formData.includeTransplant && (
            <div className="space-y-4 pl-6">
              <div>
                <Label className="mb-2 block">Transplant Type</Label>
                <Select
                  value={formData.transplantType}
                  onValueChange={(val) =>
                    handleInputChange('transplantType', val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transplant type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autologous">Autologous</SelectItem>
                    <SelectItem value="allogeneic">Allogeneic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Hospitalization Days: {formData.transplantDays}
                </Label>
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Diagnostics & Follow-up
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">PET-CT Scans: {formData.petCtCount}</Label>
          <Slider
            value={[formData.petCtCount]}
            onValueChange={(val) => handleInputChange('petCtCount', val[0])}
            min={0}
            max={10}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2 block">MRI/CT Scans: {formData.mriCtCount}</Label>
          <Slider
            value={[formData.mriCtCount]}
            onValueChange={(val) => handleInputChange('mriCtCount', val[0])}
            min={0}
            max={20}
            step={1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeNGS"
            checked={formData.includeNGS}
            onCheckedChange={(checked) =>
              handleInputChange('includeNGS', !!checked)
            }
          />
          <Label htmlFor="includeNGS">Include NGS Panel Testing</Label>
        </div>

        <div>
          <Label className="mb-2 block">
            OPD Consultations: {formData.opdConsults}
          </Label>
          <Slider
            value={[formData.opdConsults]}
            onValueChange={(val) => handleInputChange('opdConsults', val[0])}
            min={1}
            max={30}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2 block">Follow-up Horizon</Label>
          <Select
            value={formData.followUpMonths.toString()}
            onValueChange={(val) =>
              handleInputChange('followUpMonths', parseInt(val, 10))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select follow-up duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Insurance & Payment
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasInsurance"
            checked={formData.hasInsurance}
            onCheckedChange={(checked) =>
              handleInputChange('hasInsurance', !!checked)
            }
          />
          <Label htmlFor="hasInsurance">I have insurance coverage</Label>
        </div>

        {formData.hasInsurance && (
          <div className="space-y-4 pl-6">
            <div>
              <Label className="mb-2 block">Insurance Provider</Label>
              <Select
                value={formData.insurer}
                onValueChange={(val) => handleInputChange('insurer', val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {availableInsurers.map((insurer) => (
                    <SelectItem key={insurer.id} value={insurer.id}>
                      {insurer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Policy Type</Label>
              <Select
                value={formData.policyType}
                onValueChange={(val) => handleInputChange('policyType', val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="travel_medical">Travel Medical</SelectItem>
                  <SelectItem value="corporate">Corporate Group Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customCoverage"
                checked={formData.customCoverage}
                onCheckedChange={(checked) =>
                  handleInputChange('customCoverage', !!checked)
                }
              />
              <Label htmlFor="customCoverage">Customize coverage percentages</Label>
            </div>

            {formData.customCoverage && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">
                    Inpatient Coverage: {formData.inpatientCoverage}%
                  </Label>
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

                <div>
                  <Label className="mb-2 block">
                    Outpatient Coverage: {formData.outpatientCoverage}%
                  </Label>
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

                <div>
                  <Label className="mb-2 block">
                    Drug Coverage: {formData.drugCoverage}%
                  </Label>
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

                <div>
                  <Label className="mb-2 block">
                    Annual Deductible ({selectedCountryData?.currency || formData.currency})
                  </Label>
                  <Input
                    type="number"
                    value={formData.deductible}
                    onChange={(e) =>
                      handleInputChange(
                        'deductible',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    Co-pay Percentage: {formData.copayPercent}%
                  </Label>
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
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Medical Tourism Extras
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">
            Number of Companions: {formData.companions}
          </Label>
          <Slider
            value={[formData.companions]}
            onValueChange={(val) => handleInputChange('companions', val[0])}
            min={0}
            max={5}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2 block">
            Stay Duration (days): {formData.stayDuration}
          </Label>
          <Slider
            value={[formData.stayDuration]}
            onValueChange={(val) => handleInputChange('stayDuration', val[0])}
            min={7}
            max={180}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2 block">Accommodation Level</Label>
          <Select
            value={formData.accommodationLevel}
            onValueChange={(val) =>
              handleInputChange('accommodationLevel', val)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select accommodation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="mid">Mid-range</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Travel Type</Label>
          <Select
            value={formData.travelType}
            onValueChange={(val) => handleInputChange('travelType', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select travel class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">
            Return Trips: {formData.returnTrips}
          </Label>
          <Slider
            value={[formData.returnTrips]}
            onValueChange={(val) => handleInputChange('returnTrips', val[0])}
            min={1}
            max={5}
            step={1}
          />
        </div>

        <div>
          <Label className="mb-2 block">Local Transport</Label>
          <Select
            value={formData.localTransport}
            onValueChange={(val) => handleInputChange('localTransport', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select transport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily_cab">Daily Cab Service</SelectItem>
              <SelectItem value="public">Public Transport</SelectItem>
              <SelectItem value="hospital_shuttle">Hospital Shuttle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">
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
        <DollarSign className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Cost Estimate
        </h2>
      </div>

      {costResult && (
        <div className="space-y-4">
          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: 'var(--brand-primary)' }}>
                Total Estimated Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-4xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {displayCurrency} {costResult.totalCostLocal.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ≈ INR {costResult.totalCostINR.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Clinical Cost</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {displayCurrency} {costResult.clinicalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Non-clinical Cost</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {displayCurrency} {costResult.nonClinicalCost.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span style={{ color: 'var(--brand-primary)' }}>Insurance Pays</span>
                <span style={{ color: 'var(--brand-primary)' }}>
                  -{displayCurrency} {costResult.insurancePays.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span style={{ color: 'var(--text-primary)' }}>Your Out-of-Pocket</span>
                <span style={{ color: 'var(--brand-primary)' }}>
                  {displayCurrency} {costResult.patientOutOfPocket.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(costResult.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span
                    style={{ color: 'var(--text-secondary)' }}
                    className="capitalize"
                  >
                    {key.replace('_', ' ')}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {displayCurrency} {value.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {costResult.assumptions?.length > 0 && (
            <Card
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <CardHeader>
                <CardTitle>Key Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {costResult.assumptions.map((a, idx) => (
                  <p key={idx} style={{ color: 'var(--text-secondary)' }}>
                    • {a}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
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
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <header className="dark-header">
        <div
          className="dark-logo"
          style={{ color: 'var(--brand-primary)', fontSize: '24px', fontWeight: 600 }}
        >
          ByOnco
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form */}
          <div>
            <div className="mb-8">
              <h1
                className="display-huge mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Treatment Cost Calculator
              </h1>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Get accurate cost estimates for cancer treatment across 9 countries
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div
                    key={s}
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all"
                    style={{
                      background:
                        step >= s ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      color: step >= s ? '#000000' : 'var(--text-muted)',
                      border:
                        step === s ? '2px solid var(--brand-primary)' : 'none',
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: progressWidth,
                    background: 'var(--brand-primary)',
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mb-4 text-sm" style={{ color: '#f97373' }}>
                {errorMessage}
              </div>
            )}

            {/* Form Content */}
            <Card
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <CardContent className="p-6">
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 && step <= INPUT_STEPS && (
                    <Button
                      type="button"
                      className="btn-secondary"
                      onClick={handlePrevious}
                      disabled={isLoading}
                    >
                      Previous
                    </Button>
                  )}

                  {step < INPUT_STEPS && (
                    <Button
                      type="button"
                      className="btn-primary ml-auto"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      Next
                    </Button>
                  )}

                  {step === INPUT_STEPS && (
                    <Button
                      type="button"
                      className="btn-primary ml-auto"
                      onClick={calculateCost}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Calculating…' : 'Calculate Cost'}
                    </Button>
                  )}

                  {step === 7 && (
                    <Button
                      type="button"
                      className="btn-secondary"
                      onClick={resetCalculator}
                      disabled={isLoading}
                    >
                      Start New Calculation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: 3D Spline */}
          <div className="sticky top-24">
            <div
              style={{
                width: '100%',
                height: '700px',
                overflow: 'visible',
                position: 'relative',
                borderRadius: '0px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Spline scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
