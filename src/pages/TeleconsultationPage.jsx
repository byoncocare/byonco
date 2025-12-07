import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Video, Calendar as CalendarIcon, Loader2, CheckCircle2, Clock, Shield, Sparkles, Stethoscope, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const finalBackendUrl = BACKEND_URL;
const API = `${finalBackendUrl}/api`;

// Log the backend URL for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Teleconsultation Backend URL:', finalBackendUrl);
  console.log('🔗 Teleconsultation API URL:', API);
}

// Doctor types/specializations
const DOCTOR_TYPES = [
  'Surgical Oncologist',
  'Medical Oncologist',
  'Radiation Oncologist',
  'Pediatric Oncologist',
  'Gynecologic Oncologist',
  'Neuro-Oncologist',
  'Hematologic Oncologist',
  'Head & Neck Oncologist',
  'Thoracic Oncologist',
  'Urologic Oncologist',
  'Orthopedic Oncologist',
  'Dermatologic Oncologist'
];

export default function TeleconsultationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [cancerTypes, setCancerTypes] = useState([]);
  const [loadingCancerTypes, setLoadingCancerTypes] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Set today as December 3, 2025
  const today = new Date(2025, 11, 3); // December 3, 2025 (month is 0-indexed)
  today.setHours(0, 0, 0, 0);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    country_code: '+91',
    patient_phone: '',
    doctor_type: '', // Changed from hospital_id
    appointment_type: 'teleconsultation',
    preferred_date: '',
    cancer_type: '',
    notes: ''
  });

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

  // Fetch cancer types from backend - same approach as RareCancersPage
  useEffect(() => {
    const fetchCancerTypes = async () => {
      setLoadingCancerTypes(true);
      try {
        console.log('Fetching cancer types from:', `${API}/cancer-types`);
        const response = await axios.get(`${API}/cancer-types`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response data keys:', Object.keys(response.data || {}));
        
        const data = response.data;
        let allCancers = [];
        
        // Handle structured format: { rare_cancers, common_cancers, all_cancers }
        if (data && (data.rare_cancers || data.common_cancers || data.all_cancers)) {
          console.log('Using structured format from /api/cancer-types');
          
          // Combine all sources - prioritize all_cancers if available
          if (data.all_cancers && Array.isArray(data.all_cancers) && data.all_cancers.length > 0) {
            allCancers = [...data.all_cancers];
            console.log('Using all_cancers:', allCancers.length);
          } else {
            // Combine rare and common cancers
            const rare = Array.isArray(data.rare_cancers) ? data.rare_cancers : [];
            const common = Array.isArray(data.common_cancers) ? data.common_cancers : [];
            allCancers = [...rare, ...common];
            console.log('Combined rare_cancers:', rare.length, 'and common_cancers:', common.length);
          }
        }
        // Handle flat array format
        else if (Array.isArray(data) && data.length > 0) {
          console.log('Using array format, total items:', data.length);
          allCancers = data;
        }
        
        // Remove duplicates based on name
        const uniqueCancers = allCancers.reduce((acc, current) => {
          if (current && current.name) {
            const existing = acc.find(item => item.name === current.name);
            if (!existing) {
              acc.push(current);
            }
          }
          return acc;
        }, []);
        
        // Sort alphabetically by name for better UX
        uniqueCancers.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setCancerTypes(uniqueCancers);
        console.log(`✅ Loaded ${uniqueCancers.length} unique cancer types`);
      } catch (error) {
        console.error('❌ Error fetching cancer types:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        setCancerTypes([]);
      } finally {
        setLoadingCancerTypes(false);
      }
    };
    fetchCancerTypes();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Full name is required';
      isValid = false;
    }

    if (!formData.patient_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patient_email)) {
      newErrors.patient_email = 'Valid email is required';
      isValid = false;
    }

    const fullPhone = `${formData.country_code || '+91'}${formData.patient_phone}`.replace(/\s+/g, '');
    if (!formData.patient_phone.trim() || fullPhone.length < 12) {
      newErrors.patient_phone = 'Valid phone number is required';
      isValid = false;
    }

    if (!formData.cancer_type) {
      newErrors.cancer_type = 'Cancer type is required';
      isValid = false;
    }

    if (!formData.doctor_type) {
      newErrors.doctor_type = 'Doctor type is required';
      isValid = false;
    }

    if (!selectedDate) {
      newErrors.preferred_date = 'Preferred date is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        patient_phone: `${formData.country_code} ${formData.patient_phone}`.trim(),
        preferred_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
      };
      const response = await axios.post(`${API}/appointments`, submitData);
      setResult(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error booking teleconsultation:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to book appointment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              className="text-purple-300 hover:text-purple-400 mb-6"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-2 border-purple-500/50 rounded-full h-24 w-24 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <CheckCircle2 className="h-12 w-12 text-purple-400" />
                  </div>
                </motion.div>
                <CardTitle className="text-4xl text-slate-100 mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent font-bold">
                  Teleconsultation Booked!
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg font-medium">
                  Your appointment request has been received
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-800/80 rounded-xl p-6 space-y-4 border border-purple-500/30">
                  <div>
                    <div className="text-sm text-purple-300 mb-1 font-medium">Booking ID</div>
                    <div className="text-slate-100 font-mono text-lg font-semibold">{result.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1 font-medium">Patient Name</div>
                    <div className="text-slate-100 text-lg font-semibold">{result.patient_name}</div>
                  </div>
                  {result.hospital_name && (
                    <div>
                      <div className="text-sm text-purple-300 mb-1 font-medium">Hospital</div>
                      <div className="text-slate-100 text-lg font-semibold">{result.hospital_name}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-purple-300 mb-1 font-medium">Status</div>
                    <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50 px-3 py-1 font-semibold">
                      {result.status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/40 rounded-xl p-6">
                  <h4 className="text-slate-100 font-semibold mb-3 flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                    What happens next?
                  </h4>
                  <ul className="space-y-2 text-slate-200 text-sm font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      Our team will contact you within 2 hours to confirm your appointment
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      You'll receive a video call link via email/SMS
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      Please keep your medical reports ready for the consultation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      The consultation will be conducted by a certified oncologist
                    </li>
                  </ul>
                </div>

                <div className="text-center text-slate-200 text-sm bg-slate-800/60 rounded-lg p-4 font-medium">
                  <p>{result.message}</p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-4 sm:py-6 text-base sm:text-lg min-h-[44px]"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="text-purple-300 hover:text-purple-400 mb-6"
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
          <Badge className="mb-3 sm:mb-4 bg-purple-500/20 text-purple-400 border-purple-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
            <Video className="h-3 w-3 mr-1.5 inline" />
            Video Consultation
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent break-words">
            Book Teleconsultation
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-purple-200 max-w-2xl mx-auto">
            Connect with expert oncologists from anywhere via secure video consultations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl rounded-xl sm:rounded-2xl">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-bold break-words">Schedule Your Video Consultation</CardTitle>
              <CardDescription className="text-purple-200 text-sm sm:text-base md:text-lg font-medium mt-1 sm:mt-2">
                Fill in your details and we'll connect you with a specialist
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-4 text-sm">
                    {errors.submit}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                  <div>
                    <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400 z-10 pointer-events-none" />
                      <Input
                        required
                        placeholder="Enter your full name"
                        className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 pr-3 sm:pr-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                        style={{ paddingLeft: '2.75rem' }}
                        value={formData.patient_name}
                        onChange={(e) => {
                          setFormData({...formData, patient_name: e.target.value});
                          if (errors.patient_name) setErrors({...errors, patient_name: ''});
                        }}
                      />
                    </div>
                    {errors.patient_name && (
                      <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.patient_name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      required
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                      value={formData.patient_email}
                      onChange={(e) => {
                        setFormData({...formData, patient_email: e.target.value});
                        if (errors.patient_email) setErrors({...errors, patient_email: ''});
                      }}
                    />
                    {errors.patient_email && (
                      <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.patient_email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">
                      Phone Number <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.country_code}
                        onValueChange={(value) => {
                          setFormData({...formData, country_code: value});
                        }}
                      >
                        <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-2 sm:px-3 py-2.5 sm:py-3 h-auto w-20 sm:w-24 flex-shrink-0 text-xs sm:text-sm">
                          <SelectValue className="text-white" />
                        </SelectTrigger>
                        <SelectContent 
                          className="bg-slate-800/95 backdrop-blur-md border border-purple-500/40 shadow-2xl z-[9999] max-h-[300px] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:bg-purple-500/60 [&::-webkit-scrollbar-thumb]:rounded-full"
                          position="popper"
                          style={{ 
                            zIndex: 9999,
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#a855f7 #475569'
                          }}
                        >
                          {countryCodes.map((country) => (
                            <SelectItem 
                              key={country.code} 
                              value={country.code} 
                              className="text-white hover:bg-purple-600/60 hover:text-white px-4 py-2.5 cursor-pointer focus:bg-purple-600/60 focus:text-white data-[highlighted]:bg-purple-600/60 data-[highlighted]:text-white"
                            >
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        required
                        type="tel"
                        placeholder="98765 43210"
                        className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 h-auto flex-1 text-sm sm:text-base"
                        value={formData.patient_phone}
                        onChange={(e) => {
                          setFormData({...formData, patient_phone: e.target.value});
                          if (errors.patient_phone) setErrors({...errors, patient_phone: ''});
                        }}
                      />
                    </div>
                    {errors.patient_phone && (
                      <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.patient_phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">
                      Cancer Type <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      required 
                      value={formData.cancer_type}
                      onValueChange={(value) => {
                        setFormData({...formData, cancer_type: value});
                        if (errors.cancer_type) setErrors({...errors, cancer_type: ''});
                      }}
                    >
                      <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 h-auto w-full text-sm sm:text-base">
                        <SelectValue placeholder="Select cancer type" className="text-white" />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-slate-800/95 backdrop-blur-md border border-purple-500/40 shadow-2xl z-[9999] max-h-[400px] overflow-y-scroll overflow-x-hidden min-w-[var(--radix-select-trigger-width)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:bg-purple-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-purple-500/80"
                        position="popper"
                        style={{ 
                          zIndex: 9999,
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#a855f7 #475569'
                        }}
                      >
                        {loadingCancerTypes ? (
                          <SelectItem value="loading" disabled className="text-purple-300 px-4 py-3">
                            Loading cancer types...
                          </SelectItem>
                        ) : cancerTypes.length > 0 ? (
                          cancerTypes.map((cancer, index) => (
                            <SelectItem 
                              key={cancer.id || cancer.name || `cancer-${index}`} 
                              value={cancer.name} 
                              className="text-white hover:bg-purple-600/60 hover:text-white px-4 py-2.5 cursor-pointer focus:bg-purple-600/60 focus:text-white data-[highlighted]:bg-purple-600/60 data-[highlighted]:text-white my-0.5 rounded-md"
                            >
                              {cancer.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled className="text-red-300 px-4 py-3">
                            No cancer types available. Please check backend connection.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.cancer_type && (
                      <p className="text-sm text-red-400 mt-1">{errors.cancer_type}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-purple-200 mb-2 block">
                      Select Type of Doctor <span className="text-red-400">*</span>
                    </Label>
                    <Select 
                      required 
                      value={formData.doctor_type}
                      onValueChange={(value) => {
                        setFormData({...formData, doctor_type: value});
                        if (errors.doctor_type) setErrors({...errors, doctor_type: ''});
                      }}
                    >
                      <SelectTrigger className="bg-slate-800/60 border-purple-500/30 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-4 py-3 h-auto w-full">
                        <SelectValue placeholder="Choose doctor type" className="text-white" />
                      </SelectTrigger>
                      <SelectContent 
                        className="bg-slate-800/95 backdrop-blur-md border-purple-500/40 shadow-xl z-[9999]"
                        position="popper"
                        style={{ zIndex: 9999 }}
                      >
                        {DOCTOR_TYPES.map((type) => (
                          <SelectItem 
                            key={type} 
                            value={type} 
                            className="text-white hover:bg-purple-600/60 hover:text-white px-4 py-3 cursor-pointer focus:bg-purple-600/60 focus:text-white data-[highlighted]:bg-purple-600/60 data-[highlighted]:text-white"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.doctor_type && (
                      <p className="text-sm text-red-400 mt-1">{errors.doctor_type}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-purple-200 mb-2 block">
                      Preferred Date <span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-800/60 border-purple-500/30 text-white hover:bg-slate-700/60 px-4 py-3 h-auto ${
                            errors.preferred_date ? 'border-red-500' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800/95 backdrop-blur-md border-purple-500/40 shadow-xl z-[9999]" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (errors.preferred_date) setErrors({...errors, preferred_date: ''});
                          }}
                          disabled={(date) => {
                            const dateToCompare = new Date(date);
                            dateToCompare.setHours(0, 0, 0, 0);
                            return dateToCompare < today;
                          }}
                          defaultMonth={new Date(2025, 11, 1)} // December 2025 (month is 0-indexed)
                          month={selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date(2025, 11, 1)}
                          className="rounded-md"
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center mb-2",
                            caption_label: "text-base font-semibold text-white",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-8 w-8 bg-purple-950/60 border-purple-500/30 text-white hover:bg-purple-500/30 p-0 opacity-100 hover:opacity-100 rounded-md",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex mb-2",
                            head_cell: "text-purple-300 rounded-md w-10 font-semibold text-sm",
                            row: "flex w-full mt-1",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                            day: "h-10 w-10 p-0 font-normal text-white hover:bg-purple-500/30 rounded-md aria-selected:opacity-100 transition-colors",
                            day_selected: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 focus:from-purple-600 focus:to-violet-600 font-semibold",
                            day_today: "bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/50",
                            day_outside: "text-purple-500/40 opacity-60",
                            day_disabled: "text-purple-500/20 opacity-30 cursor-not-allowed",
                            day_hidden: "invisible",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.preferred_date && (
                      <p className="text-sm text-red-400 mt-1">{errors.preferred_date}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-purple-200 mb-2 block">Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any specific concerns or questions"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-4 py-3 min-h-[100px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="bg-gradient-to-br from-emerald-900/50 to-purple-900/50 border border-emerald-500/40 rounded-xl p-4">
                  <p className="text-sm text-slate-200 font-medium">
                    ✅ <strong className="text-slate-100">Consultation Fee:</strong> ₹999 (includes 30-minute video consultation with specialist)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-base sm:text-lg py-4 sm:py-6 min-h-[44px]"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Booking...</>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Book Teleconsultation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            {
              icon: <Video className="h-6 w-6 text-emerald-400" />,
              title: "HD Video Call",
              description: "Secure, encrypted video consultations"
            },
            {
              icon: <Shield className="h-6 w-6 text-cyan-400" />,
              title: "Expert Oncologists",
              description: "Board-certified specialists with 15+ years experience"
            },
            {
              icon: <Clock className="h-6 w-6 text-purple-400" />,
              title: "Flexible Timing",
              description: "Book at your convenience, available 7 days a week"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-slate-100 flex items-center gap-2 font-bold">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-purple-200 font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
