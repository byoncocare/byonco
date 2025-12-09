import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Globe, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

export default function MedicalTourismWaitlistPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    cancer_type: '',
    treatment_status: '',
    preferred_destinations: [],
    budget_range: '',
    timeline_urgency: '',
    additional_context: '',
    consent: false,
  });

  // Prefill from profile on mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        country: user.country || '',
      }));
    }
    setFetching(false);
  }, [user]);

  const handleDestinationChange = (destination) => {
    setFormData(prev => {
      const destinations = prev.preferred_destinations.includes(destination)
        ? prev.preferred_destinations.filter(d => d !== destination)
        : [...prev.preferred_destinations, destination];
      return { ...prev, preferred_destinations: destinations };
    });
  };

  const validateForm = () => {
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      setError('Full name is required (minimum 2 characters)');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone || formData.phone.trim().length < 10) {
      setError('Phone number is required (minimum 10 digits)');
      return false;
    }
    if (!formData.city || formData.city.trim() === '') {
      setError('City is required');
      return false;
    }
    if (!formData.country || formData.country.trim() === '') {
      setError('Country is required');
      return false;
    }
    if (!formData.cancer_type || formData.cancer_type.trim() === '') {
      setError('Cancer type is required');
      return false;
    }
    if (!formData.treatment_status) {
      setError('Current treatment status is required');
      return false;
    }
    if (formData.preferred_destinations.length === 0) {
      setError('Please select at least one preferred destination region');
      return false;
    }
    if (!formData.budget_range) {
      setError('Budget range is required');
      return false;
    }
    if (!formData.timeline_urgency) {
      setError('Timeline urgency is required');
      return false;
    }
    if (!formData.consent) {
      setError('You must consent to be contacted regarding medical tourism options');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: user?.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        cancer_type: formData.cancer_type,
        treatment_status: formData.treatment_status,
        preferred_destinations: formData.preferred_destinations,
        budget_range: formData.budget_range,
        timeline_urgency: formData.timeline_urgency,
        additional_context: formData.additional_context || undefined,
      };

      await axios.post(
        `${API}/waitlist/medical-tourism`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank you for joining the waitlist!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We've received your information and will contact you soon about AI Medical Tourism for Oncology options.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto"
                >
                  Return to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const destinations = [
    'India',
    'South-East Asia',
    'Middle East',
    'Europe',
    'North America',
  ];

  const budgetRanges = [
    'Under ₹10,00,000',
    '₹10,00,000 - ₹25,00,000',
    '₹25,00,000 - ₹50,00,000',
    '₹50,00,000 - ₹1,00,00,000',
    'Above ₹1,00,00,000',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-2xl">Join the AI Medical Tourism Waitlist</CardTitle>
              </div>
              <CardDescription>
                Get early access to our AI-powered medical tourism platform. Discover oncology centers across the world by wait time, budget, and treatment needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    {error}
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cancer_type">Cancer Type *</Label>
                    <Input
                      id="cancer_type"
                      type="text"
                      placeholder="e.g., Breast Cancer, Lung Cancer, etc."
                      value={formData.cancer_type}
                      onChange={(e) => setFormData({ ...formData, cancer_type: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatment_status">Current Treatment Status *</Label>
                    <select
                      id="treatment_status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.treatment_status}
                      onChange={(e) => setFormData({ ...formData, treatment_status: e.target.value })}
                      required
                    >
                      <option value="">Select status...</option>
                      <option value="newly_diagnosed">Newly diagnosed</option>
                      <option value="on_treatment">On treatment</option>
                      <option value="completed_treatment">Completed treatment</option>
                      <option value="caregiver">Caregiver exploring options</option>
                    </select>
                  </div>
                </div>

                {/* Travel Preferences */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Travel Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label>Preferred Destination Regions *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {destinations.map((dest) => (
                        <div key={dest} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dest-${dest}`}
                            checked={formData.preferred_destinations.includes(dest)}
                            onCheckedChange={() => handleDestinationChange(dest)}
                          />
                          <Label
                            htmlFor={`dest-${dest}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {dest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget_range">Budget Range (INR) *</Label>
                    <select
                      id="budget_range"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      required
                    >
                      <option value="">Select budget range...</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline_urgency">Timeline Urgency *</Label>
                    <select
                      id="timeline_urgency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.timeline_urgency}
                      onChange={(e) => setFormData({ ...formData, timeline_urgency: e.target.value })}
                      required
                    >
                      <option value="">Select urgency...</option>
                      <option value="urgent">Urgent (within 2 weeks)</option>
                      <option value="soon">Soon (1–3 months)</option>
                      <option value="exploring">Exploring / not urgent</option>
                    </select>
                  </div>
                </div>

                {/* Additional Context */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additional_context">Additional Context (Optional)</Label>
                    <textarea
                      id="additional_context"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Any additional information that would help us assist you better..."
                      value={formData.additional_context}
                      onChange={(e) => setFormData({ ...formData, additional_context: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Consent */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData({ ...formData, consent: checked })}
                      className="mt-1"
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm font-normal cursor-pointer leading-relaxed"
                    >
                      I consent to ByOnco contacting me regarding medical tourism options and understand this is not a substitute for emergency medical care. *
                    </Label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

