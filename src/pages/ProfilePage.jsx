import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, User, Calendar, MapPin, Phone, UserCircle, Heart, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    age: '',
    city: '',
    country: '',
    phone: '',
    photo_url: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
  });

  // Fetch current profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('byonco_jwt');
        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;
        
        // Prefill form with existing data
        setFormData({
          full_name: userData.full_name || '',
          date_of_birth: userData.date_of_birth || '',
          age: userData.age || '',
          city: userData.city || '',
          country: userData.country || '',
          phone: userData.phone || '',
          photo_url: userData.photo_url || '',
          emergency_contact_name: userData.emergency_contact_name || '',
          emergency_contact_relationship: userData.emergency_contact_relationship || '',
          emergency_contact_phone: userData.emergency_contact_phone || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Calculate age from date of birth
  const handleDateChange = (e) => {
    const dob = e.target.value;
    setFormData({ ...formData, date_of_birth: dob });
    
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const validateForm = () => {
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      setError('Full name is required (minimum 2 characters)');
      return false;
    }
    if (!formData.date_of_birth) {
      setError('Date of birth is required');
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
    if (!formData.phone || formData.phone.trim().length < 10) {
      setError('Phone number is required (minimum 10 digits)');
      return false;
    }
    if (!formData.emergency_contact_name || formData.emergency_contact_name.trim() === '') {
      setError('Emergency contact name is required');
      return false;
    }
    if (!formData.emergency_contact_relationship || formData.emergency_contact_relationship.trim() === '') {
      setError('Emergency contact relationship is required');
      return false;
    }
    if (!formData.emergency_contact_phone || formData.emergency_contact_phone.trim().length < 10) {
      setError('Emergency contact phone is required (minimum 10 digits)');
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
      const token = localStorage.getItem('byonco_jwt');
      const response = await axios.put(
        `${API}/profile`,
        {
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
          photo_url: formData.photo_url || undefined,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_relationship: formData.emergency_contact_relationship,
          emergency_contact_phone: formData.emergency_contact_phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update auth context with new user data
      const updatedUser = response.data;
      updateUser(updatedUser);

      setSuccess(true);

      // Redirect after a brief delay
      setTimeout(() => {
        const redirectParam = searchParams.get('redirect');
        const redirectPath = redirectParam ? decodeURIComponent(redirectParam) : '/';
        navigate(redirectPath, { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3" />
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
            <CardTitle className="text-2xl">Complete your ByOnco profile</CardTitle>
            <CardDescription>
              Please fill in all required information to access our services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="text-sm">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  Profile saved successfully! Redirecting...
                </Alert>
              )}

              {/* Basic Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-purple-600" />
                  Basic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleDateChange}
                        className="pl-10"
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Auto-calculated"
                      value={formData.age}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo_url">Photo URL (Optional)</Label>
                    <Input
                      id="photo_url"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Location & Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
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

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Contact Name *</Label>
                    <Input
                      id="emergency_contact_name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship">Relationship *</Label>
                    <Input
                      id="emergency_contact_relationship"
                      type="text"
                      placeholder="Spouse, Parent, Sibling, etc."
                      value={formData.emergency_contact_relationship}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving profile...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

