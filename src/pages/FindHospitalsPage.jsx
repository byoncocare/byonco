import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, MapPin, Phone, Mail, Building2, Stethoscope, Award, Calendar, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Explicitly use port 8000 - ensure .env has REACT_APP_BACKEND_URL=http://localhost:8000
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Force port 8000 if somehow 5000 is still being used (safety check)
const finalBackendUrl = BACKEND_URL.includes('5000') ? 'http://localhost:8000' : BACKEND_URL;
const finalApi = `${finalBackendUrl}/api`;

// Log the backend URL for debugging
console.log('🔗 Backend URL:', finalBackendUrl);
console.log('🔗 API URL:', finalApi);

const FindHospitals = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [cancerTypes, setCancerTypes] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCancerType, setSelectedCancerType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hospitals: 100,
    doctors: 300,
    cancerTypes: 60,
    cities: 25
  });

  const [cities, setCities] = useState(['All']);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedCancerType !== 'All') params.cancer_type = selectedCancerType;

      const [hospitalsRes, cancerTypesRes, statsRes, citiesRes] = await Promise.all([
        axios.get(`${finalApi}/hospitals`, { params }),
        axios.get(`${finalApi}/cancer-types`),
        axios.get(`${finalApi}/stats`).catch(() => null), // Don't fail if stats endpoint doesn't exist
        axios.get(`${finalApi}/cities`).catch(() => null) // Fetch cities from backend
      ]);

      // Update cities list from backend
      if (citiesRes?.data?.cities) {
        setCities(['All', ...citiesRes.data.cities]);
      }

      // Set hospitals - ensure it's an array
      const hospitalsData = Array.isArray(hospitalsRes.data) ? hospitalsRes.data : [];
      setHospitals(hospitalsData);
      
      // Handle both array and object formats for cancer types
      let cancerTypesData = [];
      if (Array.isArray(cancerTypesRes.data)) {
        cancerTypesData = cancerTypesRes.data;
      } else if (cancerTypesRes.data?.all_cancers) {
        cancerTypesData = cancerTypesRes.data.all_cancers;
      } else if (cancerTypesRes.data?.rare_cancers || cancerTypesRes.data?.common_cancers) {
        // Combine rare and common cancers if all_cancers is not available
        cancerTypesData = [
          ...(cancerTypesRes.data.rare_cancers || []),
          ...(cancerTypesRes.data.common_cancers || [])
        ];
      }
      setCancerTypes(cancerTypesData);

      // Update stats from backend if available, otherwise use defaults
      if (statsRes?.data) {
        setStats({
          hospitals: statsRes.data.hospitals_mapped || 100,
          doctors: statsRes.data.doctors_available || 300,
          cancerTypes: statsRes.data.cancer_types_supported || 60,
          cities: statsRes.data.cities_covered || 25
        });
      }

      console.log('Hospitals loaded:', hospitalsData.length);
      console.log('Hospitals data:', hospitalsData);
      console.log('Cancer types loaded:', cancerTypesData.length);
      console.log('Cancer types data structure:', cancerTypesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data || error.message);
      setHospitals([]);
      setCancerTypes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedCancerType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDoctors = async (hospitalId) => {
    if (doctors[hospitalId]) return;
    
    try {
      const response = await axios.get(`${finalApi}/hospitals/${hospitalId}/doctors`);
      setDoctors(prev => ({ ...prev, [hospitalId]: response.data || [] }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors(prev => ({ ...prev, [hospitalId]: [] }));
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0515] to-[#080510] relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl pointer-events-none z-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20"
          >
            <Button
              variant="ghost"
              className="text-purple-200 hover:text-purple-300 mb-6 relative z-30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/');
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <div className="text-center space-y-6 sm:space-y-8 animate-fade-in relative z-20 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight break-words" data-testid="page-title">
              Find World's Top Cancer Hospitals
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto px-2" data-testid="page-subtitle">
              Connect with expert oncologists and world-class cancer care centers across 31+ major cities
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mt-8 sm:mt-12 relative z-20 px-2">
              <div className="bg-purple-950/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-purple-600/40 relative z-20">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Input
                    type="text"
                    placeholder="Search hospitals or cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-purple-950/60 border-purple-600/40 text-purple-100 placeholder:text-purple-300/60 text-sm sm:text-base md:text-lg h-12 sm:h-14 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    data-testid="search-input"
                  />
                  <Select value={selectedCity} onValueChange={(value) => {
                    console.log('City selected:', value);
                    setSelectedCity(value);
                  }}>
                    <SelectTrigger 
                      className="w-full sm:w-48 bg-purple-950/60 border-purple-600/40 text-purple-100 h-12 sm:h-14 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer [&>svg]:text-purple-300 [&>svg]:opacity-100 [&>svg]:hover:text-purple-200 text-sm sm:text-base" 
                      data-testid="city-filter"
                      onClick={() => console.log('City dropdown clicked')}
                    >
                      <SelectValue placeholder="Select City" className="text-purple-100" />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-[#1e1b4b] border border-purple-600 shadow-2xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] max-h-[300px] overflow-y-scroll" 
                      position="popper"
                      style={{ 
                        zIndex: 9999,
                        backgroundColor: '#1e1b4b',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#a855f7 #581c87'
                      }}
                    >
                      <style>{`
                        [data-radix-select-content]::-webkit-scrollbar {
                          width: 8px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-track {
                          background: #581c87;
                          border-radius: 4px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-thumb {
                          background: #a855f7;
                          border-radius: 4px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-thumb:hover {
                          background: #9333ea;
                        }
                      `}</style>
                      {cities.map(city => (
                        <SelectItem 
                          key={city} 
                          value={city} 
                          className="text-white hover:bg-purple-600 hover:text-white cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600 focus:text-white focus:outline-none data-[highlighted]:bg-purple-600 data-[highlighted]:text-white"
                          onClick={() => console.log('City item clicked:', city)}
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCancerType} onValueChange={(value) => {
                    console.log('Cancer type selected:', value);
                    setSelectedCancerType(value);
                  }}>
                    <SelectTrigger 
                      className="w-full sm:w-56 bg-purple-950/60 border-purple-600/40 text-purple-100 h-12 sm:h-14 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer [&>svg]:text-purple-300 [&>svg]:opacity-100 [&>svg]:hover:text-purple-200 text-sm sm:text-base" 
                      data-testid="cancer-type-filter"
                      onClick={() => console.log('Cancer type dropdown clicked, types:', cancerTypes.length)}
                    >
                      <SelectValue placeholder={loading ? "Loading..." : cancerTypes.length > 0 ? "Cancer Type" : "No data - seed DB"} className="text-purple-100" />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-[#1e1b4b] border border-purple-600 shadow-2xl p-2 min-w-[var(--radix-select-trigger-width)] z-[9999] max-h-[300px] overflow-y-scroll" 
                      position="popper"
                      style={{ 
                        zIndex: 9999,
                        backgroundColor: '#1e1b4b',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#a855f7 #581c87'
                      }}
                    >
                      <style>{`
                        [data-radix-select-content]::-webkit-scrollbar {
                          width: 8px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-track {
                          background: #581c87;
                          border-radius: 4px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-thumb {
                          background: #a855f7;
                          border-radius: 4px;
                        }
                        [data-radix-select-content]::-webkit-scrollbar-thumb:hover {
                          background: #9333ea;
                        }
                      `}</style>
                      <SelectItem value="All" className="text-white hover:bg-purple-600 hover:text-white cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600 focus:text-white focus:outline-none data-[highlighted]:bg-purple-600 data-[highlighted]:text-white">All Types</SelectItem>
                      {loading ? (
                        <SelectItem value="loading" disabled className="text-purple-300 px-4 py-3">
                          Loading cancer types...
                        </SelectItem>
                      ) : cancerTypes.length > 0 ? (
                        cancerTypes.map(type => (
                          <SelectItem 
                            key={type.id || type.name} 
                            value={type.name} 
                            className="text-white hover:bg-purple-600 hover:text-white cursor-pointer px-4 py-3 my-1 rounded-md focus:bg-purple-600 focus:text-white focus:outline-none data-[highlighted]:bg-purple-600 data-[highlighted]:text-white"
                            onClick={() => console.log('Cancer type item clicked:', type.name)}
                          >
                            {type.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled className="text-purple-300 px-4 py-3">
                          No data available. Please seed the database by calling POST /api/seed-data
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 sm:h-14 px-6 sm:px-8 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 w-full sm:w-auto"
                    onClick={fetchData}
                    data-testid="search-button"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12 px-2">
              <div className="bg-purple-950/60 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-600/40">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400">{stats.hospitals}+</div>
                <div className="text-purple-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Top Hospitals</div>
              </div>
              <div className="bg-purple-950/60 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-600/40">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400">{stats.doctors}+</div>
                <div className="text-purple-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Oncologists</div>
              </div>
              <div className="bg-purple-950/60 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-600/40">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">{stats.cancerTypes}+</div>
                <div className="text-purple-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Cancer Types</div>
              </div>
              <div className="bg-purple-950/60 backdrop-blur-lg rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-600/40">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">{stats.cities}+</div>
                <div className="text-purple-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Major Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospitals List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 isolate">
        {!loading && hospitals.length === 0 && (
          <div className="text-center py-12 bg-purple-950/60 border border-purple-600/40 rounded-xl p-8 mb-8">
            <p className="text-xl text-purple-200 mb-4">⚠️ No Hospitals Found</p>
            <p className="text-purple-300 mb-4">
              Unable to fetch hospitals from the backend.
            </p>
            <p className="text-purple-300 text-sm mb-4">
              Please ensure your backend server is running at: <code className="bg-purple-900/60 px-2 py-1 rounded">{finalBackendUrl}</code>
            </p>
            <p className="text-purple-400 text-xs">
              Check the browser console for detailed error messages.
            </p>
          </div>
        )}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent" data-testid="loading-spinner"></div>
            <p className="text-purple-200 mt-4">Loading hospitals...</p>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-purple-200">No hospitals found</p>
            <p className="text-purple-300 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="hospitals-grid">
            {filteredHospitals.map((hospital, index) => (
              <Dialog key={hospital.id} onOpenChange={(open) => {
                if (open) {
                  fetchDoctors(hospital.id);
                }
              }}>
                <DialogTrigger asChild>
                  <Card 
                    className="bg-gradient-to-br from-[#0f0515] via-[#120a1a] to-[#0f0515] border-purple-600/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 group overflow-hidden animate-slide-up relative z-10"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`hospital-card-${index}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                    
                    <div className="relative h-48 overflow-hidden z-10">
                      <img 
                        src={hospital.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'} 
                        alt={hospital.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 z-20">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">{hospital.rating || 'N/A'}</span>
                      </div>
                    </div>

                    <CardHeader className="relative z-10">
                      <CardTitle className="text-purple-100 text-xl group-hover:text-purple-300 transition-colors">
                        {hospital.name}
                      </CardTitle>
                      <CardDescription className="text-purple-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {hospital.city}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 relative z-10">
                      <div className="flex items-center gap-2 text-purple-200">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm">Est. {hospital.established_year || 'N/A'}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-200 font-semibold">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {(hospital.specialties || []).slice(0, 2).map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {(hospital.specialties || []).length > 2 && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                              +{(hospital.specialties || []).length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-200 font-semibold">Cancer Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {(hospital.cancer_types || []).slice(0, 3).map((type, i) => (
                            <Badge key={i} variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30 text-xs">
                              {type}
                            </Badge>
                          ))}
                          {(hospital.cancer_types || []).length > 3 && (
                            <Badge variant="outline" className="bg-pink-500/10 text-pink-300 border-pink-500/30 text-xs">
                              +{(hospital.cancer_types || []).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 relative z-20"
                        data-testid={`view-details-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="bg-gradient-to-br from-[#0f0515] via-[#120a1a] to-[#0f0515] border-purple-600/40 text-purple-100 w-[95vw] sm:w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-xl sm:rounded-2xl mx-2 sm:mx-4" data-testid="hospital-details-modal">
                  <DialogHeader className="px-4 sm:px-6">
                    <DialogTitle className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent break-words">
                      {hospital.name}
                    </DialogTitle>
                    <DialogDescription className="text-purple-200 flex items-center gap-2 text-sm sm:text-base md:text-lg mt-2 break-words">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>{hospital.address || hospital.city}</span>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6 px-4 sm:px-6">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-purple-950/60 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-purple-300">Phone</p>
                          <p className="text-purple-100 font-semibold text-sm sm:text-base break-words">{hospital.contact || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="bg-purple-950/60 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-purple-300">Email</p>
                          <p className="text-purple-100 font-semibold text-sm sm:text-base break-words">{hospital.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="bg-purple-950/60 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold text-purple-100">{hospital.rating || 'N/A'}</span>
                          <span className="text-purple-300">/ 5.0</span>
                        </div>
                        <div className="text-purple-300">
                          {(hospital.total_reviews || 0).toLocaleString()} reviews
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="specialties" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-purple-950/80 border border-purple-600/40 rounded-lg sm:rounded-xl p-1 gap-1">
                        <TabsTrigger value="specialties" className="text-purple-200 data-[state=active]:bg-purple-600/40 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">Specialties</TabsTrigger>
                        <TabsTrigger value="cancers" className="text-purple-200 data-[state=active]:bg-purple-600/40 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">Cancer Types</TabsTrigger>
                        <TabsTrigger value="facilities" className="text-purple-200 data-[state=active]:bg-purple-600/40 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">Facilities</TabsTrigger>
                        <TabsTrigger value="doctors" className="text-purple-200 data-[state=active]:bg-purple-600/40 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2 sm:px-4">Doctors</TabsTrigger>
                      </TabsList>

                      <TabsContent value="specialties" className="mt-3 sm:mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {(hospital.specialties || []).map((specialty, i) => (
                            <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 sm:p-3 flex items-center gap-2">
                              <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                              <span className="text-purple-100 text-xs sm:text-sm break-words">{specialty}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="cancers" className="mt-3 sm:mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {(hospital.cancer_types || []).map((type, i) => (
                            <div key={i} className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-2 sm:p-3">
                              <span className="text-purple-100 text-xs sm:text-sm break-words">{type}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="facilities" className="mt-3 sm:mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {(hospital.facilities || []).map((facility, i) => (
                            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3 flex items-center gap-2">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                              <span className="text-purple-100 text-xs sm:text-sm break-words">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="doctors" className="mt-4" data-testid="doctors-list">
                        {doctors[hospital.id] ? (
                          doctors[hospital.id].length > 0 ? (
                            <div className="space-y-3">
                              {doctors[hospital.id].map((doctor, i) => (
                                <div key={i} className="bg-purple-950/60 rounded-lg p-4 border border-purple-600/40 hover:border-purple-500/60 transition-all">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-purple-100 font-semibold text-lg">{doctor.name}</h4>
                                      <p className="text-purple-400 text-sm mt-1">{doctor.specialization}</p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-purple-300">
                                        <div className="flex items-center gap-1">
                                          <Award className="w-4 h-4" />
                                          {doctor.qualifications}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-4 h-4" />
                                          {doctor.experience} years exp.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-purple-300">No doctors available</p>
                            </div>
                          )
                        ) : (
                          <div className="text-center py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
                            <p className="text-purple-300 mt-4">Loading doctors...</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindHospitals;
