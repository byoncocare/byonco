import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Search, Activity, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Force port 8000 to match backend server (backend runs on 127.0.0.1:8000)
const BACKEND_URL = 'http://127.0.0.1:8000';
const API = `${BACKEND_URL}/api`;

// Debug: Log the backend URL being used
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Backend URL configured as:', BACKEND_URL);
}

export default function RareCancersPage() {
  const navigate = useNavigate();
  const [rareCancers, setRareCancers] = useState([]);
  const [commonCancers, setCommonCancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [specialistsOpen, setSpecialistsOpen] = useState(false);
  const [selectedCancer, setSelectedCancer] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(false);
  const [specialistsError, setSpecialistsError] = useState('');

  // Fetch cancer types from backend
  const fetchRareCancers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Try /api/cancer-types first (has both rare and common)
      try {
        console.log('Fetching from:', `${API}/cancer-types`);
        const response = await axios.get(`${API}/cancer-types`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response data keys:', Object.keys(response.data || {}));

        const data = response.data;

        // Handle structured format: { rare_cancers, common_cancers, all_cancers }
        if (data && data.rare_cancers && data.common_cancers) {
          console.log('Using structured format from /api/cancer-types');
          console.log('Rare cancers count:', data.rare_cancers.length);
          console.log('Common cancers count:', data.common_cancers.length);
          setRareCancers(data.rare_cancers || []);
          setCommonCancers(data.common_cancers || []);
          return; // Success, exit early
        }
        // Handle flat array format: [{ name, category, type, ... }]
        else if (Array.isArray(data)) {
          console.log('Using array format, total items:', data.length);
          const rare = data.filter(
            (c) =>
              c.category &&
              ['ultra-rare', 'very-rare', 'rare'].includes(c.category)
          );
          const common = data.filter(
            (c) =>
              c.category && ['common', 'less-common'].includes(c.category)
          );
          console.log('Filtered rare:', rare.length, 'common:', common.length);
          setRareCancers(rare);
          setCommonCancers(common);
          return; // Success, exit early
        }
      } catch (cancerTypesError) {
        console.warn('Failed to fetch from /api/cancer-types, trying /api/rare-cancers:', cancerTypesError);
      }

      // Fallback: Try /api/rare-cancers endpoint
      try {
        console.log('Fetching from fallback:', `${API}/rare-cancers`);
        const rareResponse = await axios.get(`${API}/rare-cancers`, {
          timeout: 10000,
        });
        
        const rareData = Array.isArray(rareResponse.data) ? rareResponse.data : [];
        console.log('Got rare cancers from /api/rare-cancers:', rareData.length);
        
        // Also try to get common cancers from cancer-types
        try {
          const commonResponse = await axios.get(`${API}/cancer-types`);
          const commonData = commonResponse.data;
          if (commonData && commonData.common_cancers) {
            setCommonCancers(commonData.common_cancers);
          } else if (Array.isArray(commonData)) {
            setCommonCancers(commonData.filter(c => 
              c.category && ['common', 'less-common'].includes(c.category)
            ));
          }
        } catch (commonError) {
          console.warn('Could not fetch common cancers:', commonError);
          setCommonCancers([]);
        }
        
        setRareCancers(rareData);
      } catch (rareError) {
        throw rareError; // Re-throw to be caught by outer catch
      }
      
    } catch (err) {
      console.error('Error fetching cancer types:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      const errorMessage = err.response?.status === 404 
        ? 'Backend endpoint not found. Please ensure the server is running on port 8000.'
        : err.response?.status === 500
        ? 'Server error. Please check backend logs.'
        : err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')
        ? 'Cannot connect to backend. Please ensure the server is running on http://localhost:8000'
        : `Failed to load cancer types: ${err.message}`;
      
      setError(errorMessage);
      setRareCancers([]);
      setCommonCancers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const openSpecialistsDialog = async (cancer) => {
    if (!cancer?.name) return;
    
    console.log('Opening specialists dialog for:', cancer.name);
    
    setSelectedCancer(cancer);
    setSpecialistsOpen(true);
    setSpecialistsLoading(true);
    setSpecialistsError('');
    setSpecialists([]);
    
    try {
      const encoded = encodeURIComponent(cancer.name);
      const url = `${API}/rare-cancers/${encoded}/specialists`;
      console.log('Fetching specialists from:', url);
      
      const res = await axios.get(url, {
        timeout: 10000,
      });
      
      console.log('Specialists response:', res.data);
      console.log('Response status:', res.status);
      console.log('Response data type:', typeof res.data);
      console.log('Is array?', Array.isArray(res.data));
      
      const specialistsList = Array.isArray(res.data) ? res.data : (res.data || []);
      console.log('Specialists list length:', specialistsList.length);
      
      setSpecialists(specialistsList);
      
      if (specialistsList.length === 0) {
        setSpecialistsError(`No specialists found for "${cancer.name}". The backend may need to be restarted to load the new specialist data.`);
      } else {
        setSpecialistsError(''); // Clear any previous errors
      }
    } catch (err) {
      console.error('Error fetching specialists:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      setSpecialists([]);
      if (err.response?.status === 404) {
        setSpecialistsError('No specialists found for this cancer type yet.');
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setSpecialistsError('Cannot connect to backend. Please ensure the server is running.');
      } else {
        setSpecialistsError('Unable to load specialists right now. Please try again.');
      }
    } finally {
      setSpecialistsLoading(false);
    }
  };

  useEffect(() => {
    fetchRareCancers();
  }, [fetchRareCancers]);

  // Search functionality (client-side, using already-fetched data)
  const handleSearch = useCallback(
    (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // Combine all cancers for search
      const allCancers = [...rareCancers, ...commonCancers];
      const q = query.toLowerCase().trim();
      
      console.log('Searching for:', q);
      console.log('Total cancers to search:', allCancers.length);
      
      const filtered = allCancers.filter(
        (cancer) => {
          const nameMatch = cancer.name?.toLowerCase().includes(q);
          const typeMatch = cancer.type?.toLowerCase().includes(q);
          const descMatch = cancer.description?.toLowerCase().includes(q);
          const categoryMatch = cancer.category?.toLowerCase().includes(q);
          
          return nameMatch || typeMatch || descMatch || categoryMatch;
        }
      );

      console.log('Search results:', filtered.length);
      setSearchResults(filtered);
      setIsSearching(false);
    },
    [rareCancers, commonCancers]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, handleSearch]);

  const filterCancers = (cancers) => {
    if (!searchTerm) return cancers;
    const q = searchTerm.toLowerCase().trim();
    return cancers.filter(cancer => {
      const nameMatch = cancer.name?.toLowerCase().includes(q);
      const typeMatch = cancer.type?.toLowerCase().includes(q);
      const descMatch = cancer.description?.toLowerCase().includes(q);
      const categoryMatch = cancer.category?.toLowerCase().includes(q);
      return nameMatch || typeMatch || descMatch || categoryMatch;
    });
  };

  const ultraRare = rareCancers.filter(c => c.category === 'ultra-rare');
  const veryRare = rareCancers.filter(c => c.category === 'very-rare');
  const rare = rareCancers.filter(c => c.category === 'rare');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0515] to-[#080510] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-200 text-lg">Loading cancer types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0515] to-[#080510] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="text-white hover:text-purple-300 hover:bg-purple-950/30 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Badge className="mb-4 bg-red-500/20 text-red-300 border-red-500/40 px-4 py-1.5 text-sm font-semibold">
            <Activity className="h-3 w-3 mr-1.5 inline" />
            Specialized Care
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 px-2">
            Rare & Ultra-Rare Cancers
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-3xl mx-auto px-2 leading-relaxed">
            Expertise in 45+ rare cancer types with access to global specialists and cutting-edge treatments
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 max-w-2xl mx-auto"
          >
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-purple-400 z-10 pointer-events-none" />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 animate-spin z-10 pointer-events-none" />
            )}
            <input
              type="text"
              placeholder="Search cancer types..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-slate-800/80 border border-purple-500/40 rounded-lg sm:rounded-xl text-white placeholder:text-purple-300/70 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-sm sm:text-base font-normal leading-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <p className="text-center text-purple-300 text-sm mt-4 mb-0">
              {isSearching ? 'Searching...' : searchResults.length > 0 
                ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                : 'No results found'}
            </p>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="ultra-rare" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <TabsList className="inline-flex h-auto w-full bg-slate-900/80 border border-purple-500/40 rounded-lg sm:rounded-xl p-1 sm:p-1.5 gap-1 sm:gap-2 overflow-x-auto">
              <TabsTrigger 
                value="ultra-rare" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-purple-200 font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base flex-1 min-w-0 shrink-0"
              >
                <span className="whitespace-nowrap">Ultra-Rare ({ultraRare.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="very-rare" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white text-purple-200 font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base flex-1 min-w-0 shrink-0"
              >
                <span className="whitespace-nowrap">Very Rare ({veryRare.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rare" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-yellow-700 data-[state=active]:text-white text-purple-200 font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base flex-1 min-w-0 shrink-0"
              >
                <span className="whitespace-nowrap">Rare ({rare.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="common" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white text-purple-200 font-medium py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base flex-1 min-w-0 shrink-0"
              >
                <span className="whitespace-nowrap">Common ({commonCancers.length})</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Ultra-Rare Tab */}
          <TabsContent value="ultra-rare" className="mt-0">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filterCancers(ultraRare).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-purple-300 text-lg">No ultra-rare cancers found.</p>
                </div>
              ) : (
                filterCancers(ultraRare).map((cancer, idx) => (
                  <motion.div
                    key={cancer.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-[#0f0515] via-[#1a0a1a] to-[#0f0515] border-red-500/40 hover:border-red-500/60 transition-all duration-300 shadow-lg hover:shadow-red-500/30 h-full flex flex-col overflow-hidden">
                      <CardHeader className="flex-grow p-5 pb-3">
                        <Badge className="w-fit bg-red-500/20 text-red-300 border-red-500/40 mb-3 text-xs font-semibold px-2 py-1">
                          <span className="truncate block max-w-full">{cancer.type || 'Ultra-Rare'}</span>
                        </Badge>
                        <CardTitle className="text-lg sm:text-xl text-white font-semibold mb-3 leading-snug break-words hyphens-auto">
                          {cancer.name}
                        </CardTitle>
                        {cancer.description && (
                          <CardDescription className="text-purple-200/80 text-sm leading-relaxed line-clamp-3 break-words">
                            {cancer.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2.5 text-sm sm:text-base"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openSpecialistsDialog(cancer);
                          }}
                        >
                          <span className="truncate">View Specialists</span>
                          <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* Very Rare Tab */}
          <TabsContent value="very-rare" className="mt-0">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filterCancers(veryRare).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-purple-300 text-lg">No very rare cancers found.</p>
                </div>
              ) : (
                filterCancers(veryRare).map((cancer, idx) => (
                  <motion.div
                    key={cancer.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-[#0f0515] via-[#1a0a1a] to-[#0f0515] border-orange-500/40 hover:border-orange-500/60 transition-all duration-300 shadow-lg hover:shadow-orange-500/30 h-full flex flex-col overflow-hidden">
                      <CardHeader className="flex-grow p-5 pb-3">
                        <Badge className="w-fit bg-orange-500/20 text-orange-300 border-orange-500/40 mb-3 text-xs font-semibold px-2 py-1">
                          <span className="truncate block max-w-full">{cancer.type || 'Very Rare'}</span>
                        </Badge>
                        <CardTitle className="text-lg sm:text-xl text-white font-semibold mb-3 leading-snug break-words hyphens-auto">
                          {cancer.name}
                        </CardTitle>
                        {cancer.description && (
                          <CardDescription className="text-purple-200/80 text-sm leading-relaxed line-clamp-3 break-words">
                            {cancer.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-2.5 text-sm sm:text-base"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openSpecialistsDialog(cancer);
                          }}
                        >
                          <span className="truncate">View Specialists</span>
                          <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* Rare Tab */}
          <TabsContent value="rare" className="mt-0">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filterCancers(rare).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-purple-300 text-lg">No rare cancers found.</p>
                </div>
              ) : (
                filterCancers(rare).map((cancer, idx) => (
                  <motion.div
                    key={cancer.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-[#0f0515] via-[#1a0a1a] to-[#0f0515] border-yellow-500/40 hover:border-yellow-500/60 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 h-full flex flex-col overflow-hidden">
                      <CardHeader className="flex-grow p-5 pb-3">
                        <Badge className="w-fit bg-yellow-500/20 text-yellow-300 border-yellow-500/40 mb-3 text-xs font-semibold px-2 py-1">
                          <span className="truncate block max-w-full">{cancer.type || 'Rare'}</span>
                        </Badge>
                        <CardTitle className="text-lg sm:text-xl text-white font-semibold mb-3 leading-snug break-words hyphens-auto">
                          {cancer.name}
                        </CardTitle>
                        {cancer.description && (
                          <CardDescription className="text-purple-200/80 text-sm leading-relaxed line-clamp-3 break-words">
                            {cancer.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium py-2.5 text-sm sm:text-base"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openSpecialistsDialog(cancer);
                          }}
                        >
                          <span className="truncate">View Specialists</span>
                          <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>

          {/* Common Tab */}
          <TabsContent value="common" className="mt-0">
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filterCancers(commonCancers).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-purple-300 text-lg">No common cancers found.</p>
                </div>
              ) : (
                filterCancers(commonCancers).map((cancer, idx) => (
                  <motion.div
                    key={cancer.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="h-full"
                  >
                    <Card className="bg-gradient-to-br from-[#0f0515] via-[#1a0a1a] to-[#0f0515] border-purple-500/40 hover:border-purple-500/60 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 h-full flex flex-col overflow-hidden">
                      <CardHeader className="flex-grow p-5 pb-3">
                        <Badge className="w-fit bg-purple-500/20 text-purple-300 border-purple-500/40 mb-3 text-xs font-semibold px-2 py-1">
                          <span className="truncate block max-w-full">{cancer.type || 'Common'}</span>
                        </Badge>
                        <CardTitle className="text-lg sm:text-xl text-white font-semibold mb-3 leading-snug break-words hyphens-auto">
                          {cancer.name}
                        </CardTitle>
                        {cancer.description && (
                          <CardDescription className="text-purple-200/80 text-sm leading-relaxed line-clamp-3 break-words">
                            {cancer.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium py-2.5 text-sm sm:text-base"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openSpecialistsDialog(cancer);
                          }}
                        >
                          <span className="truncate">View Specialists</span>
                          <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Specialists Dialog - Apple-style */}
      <Dialog open={specialistsOpen} onOpenChange={(open) => {
        setSpecialistsOpen(open);
        if (!open) {
          setSelectedCancer(null);
          setSpecialists([]);
          setSpecialistsError('');
        }
      }}>
        <DialogContent 
          className="bg-white/95 backdrop-blur-xl border border-gray-200/50 text-gray-900 w-[95vw] sm:w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-0 shadow-2xl rounded-xl sm:rounded-3xl mx-2 sm:mx-4"
          style={{ zIndex: 9999 }}
        >
          {/* Header - Apple style */}
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200/50">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 break-words">
              {selectedCancer?.name ? `Specialists for ${selectedCancer.name}` : "Specialist Oncologists"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {specialists.length > 0 
                ? `Found ${specialists.length} specialist${specialists.length !== 1 ? 's' : ''} for this cancer type. Click on any specialist to view details.`
                : 'Curated list of global experts for this rare cancer type. Contact a specialist to start your care journey.'}
            </DialogDescription>
          </DialogHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
            {specialistsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <p className="text-gray-600 text-sm font-medium">Loading specialists…</p>
              </div>
            ) : specialistsError ? (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 my-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-900 font-semibold">Unable to load specialists</p>
                  <p className="text-xs text-red-700 mt-1">{specialistsError}</p>
                </div>
              </div>
            ) : specialists.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-600 text-base">No specialists found for this cancer type yet.</p>
                <p className="text-gray-500 text-sm mt-2">Please check back soon or contact our team.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {specialists.map((doc, idx) => (
                  <Dialog key={`${doc.name}-${idx}`}>
                    <DialogTrigger asChild>
                      <div
                        className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/80 px-4 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-300"
                      >
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900 mb-1">
                              {doc.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1 break-words">
                              {doc.title}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 break-words">
                              {doc.institution}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 break-words">
                              {doc.city}, {doc.country} {doc.region ? `· ${doc.region}` : ''}
                            </p>
                            {doc.experience_years && (
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 font-medium">
                                {doc.experience_years}+ years of experience
                              </p>
                            )}
                          </div>
                          
                          {doc.specialties && doc.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                              {doc.specialties.slice(0, 3).map((s, sIdx) => (
                                <span
                                  key={`${s}-${sIdx}`}
                                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 break-words"
                                >
                                  {s}
                                </span>
                              ))}
                              {doc.specialties.length > 3 && (
                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                  +{doc.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="bg-white/98 backdrop-blur-xl border border-gray-200/60 text-gray-900 w-[95vw] sm:w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-0 shadow-2xl rounded-xl sm:rounded-3xl mx-2 sm:mx-4">
                      <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200/50">
                        <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 break-words">
                          {doc.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-xs sm:text-sm break-words">
                          {doc.title}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
                        <div className="space-y-4 sm:space-y-5">
                          {/* Institution & Location */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/60">
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Institution</p>
                              <p className="text-sm sm:text-base text-gray-900 break-words">{doc.institution}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/60">
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Location</p>
                              <p className="text-sm sm:text-base text-gray-900 break-words">{doc.city}, {doc.country}</p>
                              {doc.region && (
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{doc.region}</p>
                              )}
                            </div>
                          </div>

                          {/* Experience */}
                          {doc.experience_years && (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200/60">
                              <p className="text-xs sm:text-sm font-semibold text-purple-900 mb-1">Experience</p>
                              <p className="text-xl sm:text-2xl font-bold text-purple-700">{doc.experience_years}+</p>
                              <p className="text-xs sm:text-sm text-purple-600">years of experience</p>
                            </div>
                          )}

                          {/* Specialties */}
                          {doc.specialties && doc.specialties.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs sm:text-sm font-semibold text-gray-700">Specialties</p>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {doc.specialties.map((s, sIdx) => (
                                  <span
                                    key={`${s}-${sIdx}`}
                                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 break-words"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cancer Type */}
                          {selectedCancer?.name && (
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200/60">
                              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Specializes In</p>
                              <p className="text-sm sm:text-base text-gray-900 break-words">{selectedCancer.name}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200/50 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          Close
                        </Button>
                        <Button
                          className="flex-1 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/get-started');
                          }}
                        >
                          Contact Specialist
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Close button */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200/50 flex justify-end">
            <Button
              variant="outline"
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSpecialistsOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
