import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Search, Filter } from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000';
const API = `${BACKEND_URL}/api`;

export default function FindOncologistsPage() {
  const navigate = useNavigate();
  const [oncologists, setOncologists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [minExperience, setMinExperience] = useState('');

  const regions = ['All', 'USA', 'Singapore', 'Europe', 'India'];

  const fetchOncologists = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API}/rare-cancers/specialists`);
      const data = Array.isArray(res.data) ? res.data : [];
      setOncologists(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching oncologists:', err);
      setError('Unable to load oncologists right now. Please try again in a bit.');
      setOncologists([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOncologists();
  }, [fetchOncologists]);

  useEffect(() => {
    let list = [...oncologists];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          (doc.cancer_name && doc.cancer_name.toLowerCase().includes(q)) ||
          (doc.institution && doc.institution.toLowerCase().includes(q))
      );
    }

    if (selectedRegion !== 'All') {
      list = list.filter((doc) => (doc.region || '').toLowerCase() === selectedRegion.toLowerCase());
    }

    if (minExperience) {
      const minExp = parseInt(minExperience, 10);
      if (!Number.isNaN(minExp)) {
        list = list.filter((doc) => (doc.experience_years || 0) >= minExp);
      }
    }

    setFiltered(list);
  }, [oncologists, searchTerm, selectedRegion, minExperience]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0515] to-[#080510] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-purple-300 hover:text-purple-100 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8 text-center px-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent break-words">
            Find World-Class Oncologists
          </h1>
          <p className="mt-2 sm:mt-3 text-purple-200/80 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Search ultra-rare and rare cancer specialists across the USA, Singapore, Europe, and India.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-slate-950/70 border border-purple-600/40 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-end">
            <div className="flex-1">
              <label className="block text-[10px] sm:text-xs text-purple-200/80 mb-1 sm:mb-1.5">Search by name, cancer type, or institution</label>
              <div className="relative">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 text-purple-300 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Souweidane, DIPG, Tata Memorial"
                  className="pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 h-auto bg-slate-950/80 border-purple-700/60 text-purple-50 placeholder:text-purple-400 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="w-full md:w-48 lg:w-52">
              <label className="block text-[10px] sm:text-xs text-purple-200/80 mb-1 sm:mb-1.5 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Region
              </label>
              <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v)}>
                <SelectTrigger className="bg-slate-950/80 border-purple-700/60 text-purple-50 h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border border-purple-700/60 text-purple-50 max-h-72 overflow-y-auto">
                  {regions.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs sm:text-sm">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-36 lg:w-40">
              <label className="block text-[10px] sm:text-xs text-purple-200/80 mb-1 sm:mb-1.5">Min. Years Experience</label>
              <Input
                type="number"
                min="0"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                placeholder="e.g. 10"
                className="bg-slate-950/80 border-purple-700/60 text-purple-50 placeholder:text-purple-400 h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
              />
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-400 border-r-transparent" />
            <p className="text-purple-200">Loading oncologists…</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-300 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-purple-200 text-sm">
            No oncologists match your current filters. Try adjusting your search.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((doc, idx) => (
              <Card
                key={`${doc.name}-${idx}`}
                className="bg-gradient-to-br from-[#0f0515] via-[#120a1a] to-[#0f0515] border-purple-600/40 hover:border-purple-500/70 transition-all duration-300 shadow-lg hover:shadow-purple-500/40 flex flex-col overflow-hidden"
              >
                <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg md:text-xl text-white font-semibold leading-snug break-words">
                        {doc.name}
                      </CardTitle>
                      <p className="text-[10px] sm:text-xs uppercase tracking-wide text-purple-300/90 mt-0.5 sm:mt-1 font-semibold break-words">
                        {doc.title}
                      </p>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-200 border-purple-500/60 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 flex-shrink-0">
                      {doc.region}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-100/90 mt-1.5 sm:mt-2 break-words">
                    {doc.city}, {doc.country}
                  </p>
                  <p className="text-[10px] sm:text-xs text-purple-200/80 mt-0.5 sm:mt-1 break-words">
                    {doc.institution}
                  </p>
                  <p className="text-[10px] sm:text-xs text-purple-300/80 mt-0.5 sm:mt-1 break-words">
                    {doc.experience_years ? `${doc.experience_years}+ years` : 'Experience N/A'} • {doc.cancer_name}
                  </p>
                </CardHeader>
                <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 flex-1 flex flex-col justify-between">
                  {doc.specialties && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 mb-3 sm:mb-4">
                      {doc.specialties.map((s) => (
                        <span
                          key={s}
                          className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wide bg-purple-900/60 border border-purple-600/50 text-purple-100 break-words"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs sm:text-sm font-semibold mt-auto py-2 sm:py-2.5 min-h-[40px] sm:min-h-[44px]"
                    onClick={() => navigate('/get-started')}
                  >
                    Contact This Specialist
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}


