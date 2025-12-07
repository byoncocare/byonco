import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope, 
  Shield, 
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/get-started`;

const cancerStages = ['Stage 0', 'Stage I', 'Stage II', 'Stage III', 'Stage IV', 'Not Diagnosed Yet'];
const contactMethods = ['Phone', 'Email', 'WhatsApp'];
const timePreferences = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 8 PM)', 'Any Time'];

// Common country codes
const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
];

export default function GetStarted() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    country_code: '+91',
    phone: '',
    
    // Location
    city: '',
    state: '',
    country: 'India',
    
    // Medical Information
    cancer_type: '',
    cancer_stage: '',
    
    // Insurance
    has_insurance: false,
    insurance_provider: '',
    insurance_policy_number: '',
    
    // Preferences
    preferred_language: 'en',
    preferred_contact_method: 'phone',
    preferred_time: '',
    additional_notes: '',
    
    // Consent
    agree_to_terms: false,
    agree_to_contact: true
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        return value.length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email' : '';
      case 'phone':
        const fullPhone = `${formData.country_code || '+91'}${value}`.replace(/\s+/g, '');
        return value.length < 10 || fullPhone.length < 12 ? 'Phone number must be at least 10 digits' : '';
      case 'city':
        return value.length < 2 ? 'City is required' : '';
      case 'cancer_type':
        return value.length < 2 ? 'Cancer type is required' : '';
      case 'cancer_stage':
        return !value ? 'Cancer stage is required' : '';
      case 'insurance_provider':
        return formData.has_insurance && !value ? 'Insurance provider is required if you have insurance' : '';
      default:
        return '';
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name) => {
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Required fields
    const requiredFields = ['full_name', 'email', 'phone', 'city', 'cancer_type', 'cancer_stage'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Conditional validation
    if (formData.has_insurance && !formData.insurance_provider) {
      newErrors.insurance_provider = 'Insurance provider is required';
      isValid = false;
    }

    if (!formData.agree_to_terms) {
      newErrors.agree_to_terms = 'You must agree to terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        phone: `${formData.country_code} ${formData.phone}`.trim()
      };
      await axios.post(`${API}/submit`, submitData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="bg-gray-800 border border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Thank You!
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We'll contact you soon to help you with your cancer care journey.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-white hover:text-purple-300 hover:bg-gray-800 mb-6"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white break-words">
            Let's Get You Started
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-2">
            Begin your personalized cancer care journey with ByOnco. Fill in the details below and we'll contact you soon.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl text-white font-semibold">Patient Information</CardTitle>
            <CardDescription className="text-gray-400 text-sm sm:text-base mt-1">
              All fields marked with * are required
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </Alert>
              )}

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="full_name" className="text-white font-medium text-sm sm:text-base">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Joe Patel"
                      value={formData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      onBlur={() => handleBlur('full_name')}
                      className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 px-3 sm:px-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                      required
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-400">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-white font-medium text-sm sm:text-base">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 z-10 pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 pr-3 sm:pr-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-white font-medium text-sm sm:text-base">
                      Phone Number <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.country_code}
                        onValueChange={(value) => {
                          setFormData({...formData, country_code: value});
                        }}
                      >
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 h-auto w-24 sm:w-28 flex-shrink-0 text-sm sm:text-base">
                          <SelectValue className="text-gray-900" />
                        </SelectTrigger>
                        <SelectContent 
                          className="bg-white border-gray-300 max-h-[300px] overflow-y-scroll min-w-[var(--radix-select-trigger-width)]"
                          position="popper"
                          style={{ zIndex: 9999 }}
                        >
                          {countryCodes.map((country) => (
                            <SelectItem 
                              key={country.code} 
                              value={country.code} 
                              className="text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2.5"
                            >
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 z-10 pointer-events-none" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 pr-3 sm:pr-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                          style={{ paddingLeft: '2.75rem' }}
                          required
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white font-medium">
                      City <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
                      <Input
                        id="city"
                        type="text"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 pr-4 py-3 h-auto"
                        style={{ paddingLeft: '3.5rem' }}
                        required
                      />
                    </div>
                    {errors.city && (
                      <p className="text-sm text-red-400">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-purple-400" />
                  Medical Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancer_type" className="text-white font-medium">
                      Cancer Type <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="cancer_type"
                      type="text"
                      placeholder="e.g., Breast Cancer, Lung Cancer"
                      value={formData.cancer_type}
                      onChange={(e) => handleChange('cancer_type', e.target.value)}
                      onBlur={() => handleBlur('cancer_type')}
                      className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 px-4 py-3 h-auto"
                      required
                    />
                    {errors.cancer_type && (
                      <p className="text-sm text-red-400">{errors.cancer_type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancer_stage" className="text-white font-medium">
                      Cancer Stage <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.cancer_stage}
                      onValueChange={(value) => handleChange('cancer_stage', value)}
                    >
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300 px-4 py-3 h-auto w-full">
                        <SelectValue placeholder="Select stage" className="text-gray-900" />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-white border-gray-300 min-w-[var(--radix-select-trigger-width)]"
                        position="popper"
                        style={{ zIndex: 9999 }}
                      >
                        {cancerStages.map((stage) => (
                          <SelectItem 
                            key={stage} 
                            value={stage} 
                            className="text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2.5"
                          >
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cancer_stage && (
                      <p className="text-sm text-red-400">{errors.cancer_stage}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance Information Section */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Insurance Information
                </h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_insurance"
                    checked={formData.has_insurance}
                    onCheckedChange={(checked) => handleChange('has_insurance', checked)}
                    className="border-gray-600"
                  />
                  <Label htmlFor="has_insurance" className="text-white cursor-pointer font-medium">
                    I have health insurance
                  </Label>
                </div>

                {formData.has_insurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_provider" className="text-white font-medium">
                        Insurance Provider <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="insurance_provider"
                        type="text"
                        placeholder="e.g., Star Health, HDFC Ergo"
                        value={formData.insurance_provider}
                        onChange={(e) => handleChange('insurance_provider', e.target.value)}
                        onBlur={() => handleBlur('insurance_provider')}
                        className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 px-4 py-3 h-auto"
                      />
                      {errors.insurance_provider && (
                        <p className="text-sm text-red-400">{errors.insurance_provider}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurance_policy_number" className="text-white font-medium">
                        Policy Number
                      </Label>
                      <Input
                        id="insurance_policy_number"
                        type="text"
                        placeholder="Policy number (optional)"
                        value={formData.insurance_policy_number}
                        onChange={(e) => handleChange('insurance_policy_number', e.target.value)}
                        className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 px-4 py-3 h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences Section */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Contact Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferred_contact_method" className="text-white font-medium">
                      Preferred Contact Method
                    </Label>
                    <Select
                      value={formData.preferred_contact_method}
                      onValueChange={(value) => handleChange('preferred_contact_method', value)}
                    >
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300 px-4 py-3 h-auto w-full">
                        <SelectValue className="text-gray-900" />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-white border-gray-300 min-w-[var(--radix-select-trigger-width)]"
                        position="popper"
                        style={{ zIndex: 9999 }}
                      >
                        {contactMethods.map((method) => (
                          <SelectItem 
                            key={method} 
                            value={method.toLowerCase()} 
                            className="text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2.5"
                          >
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_time" className="text-white font-medium">
                      Preferred Contact Time
                    </Label>
                    <Select
                      value={formData.preferred_time}
                      onValueChange={(value) => handleChange('preferred_time', value)}
                    >
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300 px-4 py-3 h-auto w-full">
                        <SelectValue placeholder="Select time" className="text-gray-900" />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-white border-gray-300 min-w-[var(--radix-select-trigger-width)]"
                        position="popper"
                        style={{ zIndex: 9999 }}
                      >
                        {timePreferences.map((time) => (
                          <SelectItem 
                            key={time} 
                            value={time} 
                            className="text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2.5"
                          >
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_notes" className="text-white font-medium">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="additional_notes"
                    placeholder="Any additional information you'd like to share..."
                    value={formData.additional_notes}
                    onChange={(e) => handleChange('additional_notes', e.target.value)}
                    className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 min-h-[100px] px-4 py-3"
                    rows={4}
                  />
                </div>
              </div>

              {/* Consent Section */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree_to_terms"
                    checked={formData.agree_to_terms}
                    onCheckedChange={(checked) => handleChange('agree_to_terms', checked)}
                    className="mt-1 border-gray-600"
                    required
                  />
                  <Label htmlFor="agree_to_terms" className="text-white cursor-pointer text-sm font-medium">
                    I agree to the{' '}
                    <a href="/terms-and-conditions" target="_blank" className="text-purple-400 hover:text-purple-300 hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-purple-400 hover:text-purple-300 hover:underline">
                      Privacy Policy
                    </a>
                    <span className="text-red-400"> *</span>
                  </Label>
                </div>
                {errors.agree_to_terms && (
                  <p className="text-sm text-red-400">{errors.agree_to_terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit & Get Started'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
