import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Calendar, MapPin, Phone, UserCircle, Heart, ChevronLeft, Upload, Image as ImageIcon, Crown, CreditCard, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { getSubscriptionStatus, isSubscriptionActive, getDaysRemaining, isAdmin, clearSubscription } from '@/utils/subscription';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { initiatePayment } from '@/utils/payments/razorpay-new';
import { SUBSCRIPTION_PLANS } from '@/utils/payments/subscriptionPlans';
import { toast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    age: '',
    city: '',
    country: '',
    phone: '',
    photo_url: '',
    photo_file: null,
    photo_preview: null,
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
          navigate('/authentication');
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
          photo_file: null,
          photo_preview: userData.photo_url || null,
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

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        setSubscriptionLoading(true);
        try {
          const sub = await getSubscriptionStatus(user);
          setSubscription(sub);
          
          // Check if subscription is expired or about to expire
          if (sub && !isSubscriptionActive(sub)) {
            setShowExpiryModal(true);
            // Clear expired subscription from localStorage
            clearSubscription();
            setSubscription(null);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setSubscriptionLoading(false);
        }
      } else {
        setSubscriptionLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo_file: file,
          photo_preview: reader.result,
          photo_url: reader.result, // Use base64 for now, can be uploaded to cloud storage later
        });
      };
      reader.readAsDataURL(file);
    }
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
        <Card className="w-full bg-[#0b0f1f]/95 border border-white/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white hover:text-white/80 hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Complete your ByOnco profile</CardTitle>
                <CardDescription className="text-white/80">
                  Please fill in all required information to access our services
                </CardDescription>
              </div>
              {!subscriptionLoading && user && isAdmin(user) && (
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none px-3 py-1.5 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Subscribed</span>
                </Badge>
              )}
              {!subscriptionLoading && subscription && isSubscriptionActive(subscription) && !isAdmin(user) && (
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none px-3 py-1.5 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Subscribed</span>
                </Badge>
              )}
            </div>
            {!subscriptionLoading && user && isAdmin(user) && (
              <div className="mt-3 text-sm text-white/70">
                <span>Admin Account - Full Access</span>
              </div>
            )}
            {!subscriptionLoading && subscription && isSubscriptionActive(subscription) && !isAdmin(user) && (
              <div className="mt-3 text-sm text-white/70">
                <span>Plan expires in {getDaysRemaining(subscription)} days</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="text-sm bg-red-500/20 border-red-500/50 text-white">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/20 border-green-500/50 text-white">
                  Profile saved successfully! Redirecting...
                </Alert>
              )}

              {/* Basic Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-purple-400" />
                  Basic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-white">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleDateChange}
                        className="pl-10 bg-white/10 border-white/20 text-white focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Auto-calculated"
                      value={formData.age}
                      readOnly
                      className="bg-white/5 border-white/20 text-white/70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo_file" className="text-white">Profile Photo (Optional)</Label>
                    <div className="space-y-2">
                      {formData.photo_preview ? (
                        <div className="relative">
                          <img
                            src={formData.photo_preview}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, photo_file: null, photo_preview: null, photo_url: '' })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="photo_file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-white/60" />
                            <p className="mb-2 text-sm text-white/80">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-white/60">PNG, JPG, GIF up to 5MB</p>
                          </div>
                          <input
                            id="photo_file"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Contact Section */}
              <div className="space-y-4 pt-4 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Location & Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">Country *</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="India"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-4 pt-4 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name" className="text-white">Contact Name *</Label>
                    <Input
                      id="emergency_contact_name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship" className="text-white">Relationship *</Label>
                    <Input
                      id="emergency_contact_relationship"
                      type="text"
                      placeholder="Spouse, Parent, Sibling, etc."
                      value={formData.emergency_contact_relationship}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emergency_contact_phone" className="text-white">Contact Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        placeholder="+91 1234567890"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" disabled={loading}>
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

        {/* Subscription Expiry Modal */}
        <Dialog open={showExpiryModal} onOpenChange={setShowExpiryModal}>
          <DialogContent className="bg-[#0b0f1f] border-white/30 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Subscription Expired
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Your subscription has expired. Renew to continue accessing all ByOnco services.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-white/90">
                  <strong>ByOnco PRO</strong> - ₹99/week
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Access to all services including Find Hospitals, Cost Calculator, Rare Cancers, Teleconsultation, and AI Medical Tourism
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    setPaymentProcessing(true);
                    const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'byonco-pro');
                    if (!plan) return;
                    
                    try {
                      await initiatePayment({
                        amount: plan.amount,
                        currency: plan.currency,
                        description: `${plan.name} - ${plan.subtitle}`,
                        serviceType: plan.serviceType,
                        metadata: { plan_id: plan.id },
                        onSuccess: async (result) => {
                          if (result.subscription) {
                            setSubscription(result.subscription);
                            localStorage.setItem('subscription_status', JSON.stringify(result.subscription));
                          }
                          setShowExpiryModal(false);
                          toast({
                            variant: "success",
                            title: "Subscription renewed!",
                            description: "Your subscription is now active.",
                          });
                          window.location.reload();
                        },
                        onError: (error) => {
                          toast({
                            variant: "error",
                            title: "Payment failed",
                            description: error.message || "Failed to process payment.",
                          });
                          setPaymentProcessing(false);
                        }
                      });
                    } catch (error) {
                      console.error('Payment initiation error:', error);
                      setPaymentProcessing(false);
                    }
                  }}
                  disabled={paymentProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Renew Subscription - ₹99
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    clearSubscription();
                    setShowExpiryModal(false);
                  }}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

