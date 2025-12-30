import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "@/App.css";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Check,
  Globe,
  Activity,
  Users,
  BarChart3,
  Clock,
  Award,
  Shield,
  Zap,
  ChevronRight,
  ArrowRight,
  Search,
  FileText,
  MapPin,
  Building2,
  CheckCircle2,
  Hospital,
  Stethoscope,
  Calculator,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import axios from "axios";
import TypesCovered from "@/components/TypesCovered";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUBSCRIPTION_PLANS } from "@/utils/payments/subscriptionPlans";
import { initiatePayment } from "@/utils/payments/razorpayClient";
import PriceTag from "@/components/ui/PriceTag";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

// Trusted Hospitals Data
const trustedHospitals = [
  // India
  { name: "Tata Memorial Centre", city: "Mumbai", country: "India", region: "India" },
  { name: "AIIMS Delhi – Dr. B.R.A. IRCH", city: "New Delhi", country: "India", region: "India" },
  { name: "Apollo Cancer Centres", city: "Chennai", country: "India", region: "India" },
  { name: "Fortis Healthcare", city: "Mulund", country: "India", region: "India" },
  { name: "HCG Cancer Centre", city: "Bengaluru", country: "India", region: "India" },
  { name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai", country: "India", region: "India" },
  
  // USA
  { name: "Memorial Sloan Kettering Cancer Center", city: "New York", country: "USA", region: "USA" },
  { name: "MD Anderson Cancer Center", city: "Houston", country: "USA", region: "USA" },
  { name: "Mayo Clinic Cancer Center", city: "Rochester", country: "USA", region: "USA" },
  { name: "Dana-Farber Cancer Institute", city: "Boston", country: "USA", region: "USA" },
  { name: "Johns Hopkins Sidney Kimmel Cancer Center", city: "Baltimore", country: "USA", region: "USA" },
  { name: "Cedars-Sinai Cancer Center", city: "Los Angeles", country: "USA", region: "USA" },
  
  // Europe / Canada
  { name: "The Royal Marsden Hospital", city: "London", country: "UK", region: "Europe" },
  { name: "Gustave Roussy Cancer Campus", city: "Paris", country: "France", region: "Europe" },
  { name: "Charité – Universitätsmedizin Berlin", city: "Berlin", country: "Germany", region: "Europe" },
  { name: "Princess Margaret Cancer Centre", city: "Toronto", country: "Canada", region: "Europe" },
  
  // Asia-Pacific / Middle East
  { name: "National Cancer Centre Singapore", city: "Singapore", country: "Singapore", region: "Asia-Pacific / Middle East" },
  { name: "National Cancer Center Hospital", city: "Tokyo", country: "Japan", region: "Asia-Pacific / Middle East" },
  { name: "Bumrungrad International Hospital", city: "Bangkok", country: "Thailand", region: "Asia-Pacific / Middle East" },
  { name: "Mediclinic City Hospital", city: "Dubai", country: "UAE", region: "Asia-Pacific / Middle East" },
];

const MedTourismLanding = () => {
  const navigate = useNavigate();   // ✅ Added navigation hook (needed for onClick)
  const { isAuthenticated, user, logout } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (userData) => {
    if (!userData) return 'U';
    const name = userData.full_name || userData.email || 'User';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Handle logout with redirect
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [showContactForm, setShowContactForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [cycleIndex, setCycleIndex] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const cyclingWords = ["Treatment.", "Hope.", "Care.", "Future."];

  // Handle subscription payment
  const handleSubscribe = async (planId) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setPaymentLoading(true);
    try {
      await initiatePayment({
        amount: plan.amount,
        currency: plan.currency,
        description: `${plan.name} - ${plan.subtitle}`,
        serviceType: plan.serviceType,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name
        },
        onSuccess: (result) => {
          // Store subscription status
          localStorage.setItem('subscription_status', JSON.stringify({
            planId: plan.id,
            planName: plan.name,
            subscribedAt: new Date().toISOString(),
            paymentId: result.payment_id,
            orderId: result.order_id
          }));
          
          // Show success message
          alert('Payment successful! Your subscription is now active.');
          
          // Optionally redirect or refresh
          window.location.reload();
        },
        onError: (error) => {
          console.error('Payment error:', error);
          alert(error.message || 'Payment failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // rotating word in hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % cyclingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // scroll-in animations
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "This field is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "This field is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "This field is required.";
    }
    if (!formData.message.trim()) {
      errors.message = "This field is required.";
    }
    
    setFormErrors(errors);
    
    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setSubmitStatus("loading");
    
    try {
      const response = await axios.post(`${API}/contact`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      }, {
        timeout: 60000, // 60 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && (response.data.status === "success" || response.data.message)) {
        setSubmitStatus("success");
        setFormErrors({});
        // Don't clear form or close modal immediately - show success message
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const detail = error.response.data?.detail || error.response.data?.message;
        
        if (status === 404) {
          setSubmitStatus("error");
          setFormErrors({ 
            submit: "This feature is currently being updated. We're adding improvements to serve you better. Please try again later." 
          });
        } else if (status === 500) {
          setSubmitStatus("error");
          setFormErrors({ 
            submit: "Our service is temporarily unavailable. Please try again in a few moments." 
          });
        } else {
          setSubmitStatus("error");
          setFormErrors({ 
            submit: "We're having trouble processing your request. Please try again in a moment." 
          });
        }
      } else if (error.request) {
        // Request was made but no response received
        setSubmitStatus("error");
        setFormErrors({ 
          submit: "We cannot reach our servers at the moment. Please check your internet connection and try again." 
        });
      } else {
        // Error setting up request
        setSubmitStatus("error");
        setFormErrors({ 
          submit: "We're having trouble connecting right now. Please try again in a moment." 
        });
      }
    }
  };

  const patientFeatures = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Live Bed & Queue Visibility",
      description:
        "Real-time hospital bed availability and queue status across India with verified center profiles in US, EU, and Middle East",
      color: "from-purple-500 via-violet-500 to-purple-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Hospital Matching",
      description:
        "Smart matching based on disease type, budget, outcomes, insurance/scheme eligibility, visa requirements, and language preferences",
      color: "from-cyan-500 via-blue-500 to-indigo-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "All-Inclusive Medical Packages",
      description:
        "Complete treatment packages with itemized costs, travel arrangements, accommodation, translators, and dedicated local care coordinators",
      color: "from-violet-500 via-purple-500 to-fuchsia-600",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Rapid Second Opinions",
      description:
        "Expert second opinions delivered in under 24 hours, plus clinical trial matching and subsidy discovery in a multilingual app",
      color: "from-blue-500 via-cyan-500 to-teal-600",
    },
  ];

  const hospitalFeatures = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "Qualified International Referrals",
      description:
        "Receive pre-screened international patients with complete case documentation and verified medical records",
      stat: "1,000+ families connected",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Real-Time Queue & Bed Analytics",
      description:
        "Comprehensive dashboard showing occupancy rates, patient conversion metrics, and referral performance reporting",
      stat: "14,300+ hospitals mapped",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Monthly Active Users" },
    { value: "1,000+", label: "Families Guided" },
    { value: "1300+", label: "Hospitals Mapped" },
    { value: "<12 Hours", label: "Second Opinions" },
  ];

  // Use subscription plans from source of truth
  const plans = SUBSCRIPTION_PLANS.map(plan => ({
    ...plan,
    price: `₹${plan.amount.toLocaleString('en-IN')}`,
    cta: plan.id === 'byonco-pro' ? 'Subscribe Now' : 'Request Demo'
  }));

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">
              <span className="logo-by">by</span>
              <span className="logo-onco"><span className="logo-o">O</span>nco</span>
            </span>
          </div>
          <div className="nav-links">
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#pricing" className="nav-link">
              Pricing
            </a>
            <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              About
            </a>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full transition-all"
                    aria-label="User menu"
                  >
                    {user?.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={user.full_name || user.email || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-purple-500/30">
                        {getUserInitials(user)}
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-purple-500/30 text-white shadow-xl">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-purple-500/30" />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="cursor-pointer text-purple-200 focus:text-white focus:bg-purple-500/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-500/30" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-violet-400/60 text-white hover:border-purple-400 hover:bg-white/5 transition"
                >
                  Login
                </button>
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate("/get-started");
                    } else {
                      navigate("/auth?redirect=/get-started");
                    }
                  }}
                  className="cta-button"
                  data-testid="nav-contact-button"
                >
                  Get Started <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30"
          >
            <div className="flex flex-col p-4 space-y-4">
              <a
                href="#services"
                className="nav-link-mobile text-purple-200 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#features"
                className="nav-link-mobile text-purple-200 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="nav-link-mobile text-purple-200 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="nav-link-mobile text-purple-200 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-3 border-t border-purple-500/20 mt-2">
                    {user?.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={user.full_name || user.email || 'User'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-purple-500/30">
                        {getUserInitials(user)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-purple-200 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-purple-200 hover:text-white hover:bg-purple-500/10 rounded-md transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setMenuOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-2 rounded-full text-sm font-medium border border-violet-400/60 text-white hover:border-purple-400 hover:bg-white/5 transition"
                  >
                    Login
                  </button>
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/get-started");
                      } else {
                        navigate("/auth?redirect=/get-started");
                      }
                      setMenuOpen(false);
                    }}
                    className="cta-button-mobile w-full mt-2"
                  >
                    Get Started <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <motion.div
          className="hero-content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Badge className="hero-badge" data-testid="hero-badge">
              <Award className="w-4 h-4 mr-2" />
              YC W25 • AI-Powered Medical Tourism
            </Badge>
            <h1 className="hero-title" data-testid="hero-title">
              World's Most Powerful
              <br />
              <span className="gradient-text">Oncology</span>
              <br />
              <span className="cycling-word">{cyclingWords[cycleIndex]}</span>
            </h1>
            <p className="hero-subtitle" data-testid="hero-subtitle">
              Navigate rare and ultra-rare cancers with AI-powered hospital matching,
              real-time bed visibility, and all-inclusive treatment packages across India
              and globally.
            </p>
            <div className="hero-cta">
              <Button
                size="lg"
                className="primary-cta"
                onClick={() => navigate("/find-hospitals")}
                data-testid="hero-cta-primary"
              >
                Find Hospitals <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="secondary-cta"
                onClick={() => navigate("/cost-calculator")}
                data-testid="hero-cta-secondary"
              >
                Calculate Cost
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="hero-card glass-card floating">
              <div className="hero-card-content">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="status-badge success">Live Bed Available</Badge>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Apollo Cancer Center
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Mumbai • CAR-T Therapy
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="stat-mini">
                    <span className="stat-mini-label">Success Rate</span>
                    <span className="stat-mini-value">94%</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-label">Wait Time</span>
                    <span className="stat-mini-value">3 Days</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    ₹42,50,000
                  </span>
                  <Button 
                    size="sm" 
                    className="mini-cta"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/find-hospitals?hospital=apollo");
                      } else {
                        navigate("/auth?redirect=/find-hospitals?hospital=apollo");
                      }
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section fade-in-section">
        <motion.div
          className="stats-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              data-testid={`stat-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trusted Hospitals Section */}
      <section className="hospitals-logos-section fade-in-section py-12 md:py-16">
        <motion.div
          className="hospitals-logos-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
            Trusted by the World's Leading Cancer Hospitals
          </h2>
          
          <p
            className="mt-4 max-w-3xl mx-auto text-center text-base md:text-lg"
            style={{
              fontFamily: "'Newsreader', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              background: "linear-gradient(to right, #a855f7, #fb7185, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 18px rgba(168, 85, 247, 0.45))",
            }}
          >
            From Tata Memorial and AIIMS to MD Anderson, Mayo Clinic, Royal Marsden, Gustave Roussy and other global leaders, ByOnco works across the world's leading cancer centers and connects your cancer journey with the best treatment and care.
          </p>
        </motion.div>
      </section>

      {/* Services Navigation Section */}
      <section id="services" className="services-section fade-in-section" style={{ marginTop: "4rem", marginBottom: "4rem" }}>
        <div className="section-header">
          <Badge className="section-badge">Our Services</Badge>
          <h2 className="section-title">
            Complete Cancer Care Solutions
          </h2>
          <p className="section-subtitle">
            Access all our AI-powered tools and services to navigate your cancer care journey
          </p>
        </div>
        <div className="services-grid">
          {[
            {
              title: "Find Hospitals",
              description: "AI-powered hospital matching based on your specific needs, budget, and location",
              icon: <Hospital className="w-8 h-8" />,
              color: "from-purple-500 to-violet-600",
              route: "/find-hospitals"
            },
            {
              title: "Cost Calculator",
              description: "Get accurate cost estimates for cancer treatment across 9 countries",
              icon: <Calculator className="w-8 h-8" />,
              color: "from-cyan-500 to-blue-600",
              route: "/cost-calculator"
            },
            {
              title: "Rare Cancers",
              description: "Specialized care for 45+ rare and ultra-rare cancer types",
              icon: <Activity className="w-8 h-8" />,
              color: "from-red-500 to-rose-600",
              route: "/rare-cancers"
            },
            {
              title: "Second Opinion",
              description: "Expert second opinions delivered in under 24 hours",
              icon: <FileText className="w-8 h-8" />,
              color: "from-emerald-500 to-teal-600",
              route: "/second-opinion"
            },
            {
              title: "Teleconsultation",
              description: "Connect with top oncologists via secure video consultations",
              icon: <Stethoscope className="w-8 h-8" />,
              color: "from-orange-500 to-amber-600",
              route: "/teleconsultation"
            },
            {
              title: "AI Medical Tourism for Oncology",
              description: "Discover oncology centers across the world by wait time, budget, and treatment needs",
              icon: <Globe className="w-8 h-8" />,
              color: "from-indigo-500 to-purple-600",
              route: "/journey-builder",
              isWaitlist: false
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card
                className="service-card"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  background: "rgba(30, 20, 50, 0.35)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                }}
                onClick={() => navigate(service.route)}
              >
                <CardContent className="feature-card-content" style={{ padding: "2rem" }}>
                  <div
                    className={`feature-icon bg-gradient-to-br ${service.color}`}
                    style={{ marginBottom: "1.5rem" }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="feature-title" style={{ marginBottom: "0.75rem" }}>
                    {service.title}
                  </h3>
                  <p className="feature-description" style={{ marginBottom: "1.5rem" }}>
                    {service.description}
                  </p>
                  <Button
                    variant="outline"
                    className="service-cta"
                    style={{
                      width: "100%",
                      borderColor: "rgba(139, 92, 246, 0.4)",
                      color: "#a78bfa"
                    }}
                  >
                    {service.isWaitlist ? "Join Waitlist" : "Get Started"} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Patient Features */}
      <section id="features" className="features-section fade-in-section">
        <div className="section-header">
          <Badge className="section-badge">For Patients</Badge>
          <h2
            className="section-title"
            data-testid="patient-features-title"
          >
            Your Complete Cancer Care Companion
          </h2>
          <p className="section-subtitle">
            From discovery to treatment, we guide you every step of the way with
            AI-powered intelligence
          </p>
        </div>
        <div className="features-grid">
          {patientFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                className="feature-card"
                data-testid={`patient-feature-${index}`}
              >
                <CardContent className="feature-card-content">
                  <div
                    className={`feature-icon bg-gradient-to-br ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

{/* Specialized Care – Rare & Ultra-Rare Cancer */}
<section className="features-section fade-in-section">
  <div className="section-header">
    <span
      className="section-badge"
      style={{
        background: "rgba(220,38,38,0.15)",
        border: "1px solid rgba(220,38,38,0.4)",
        color: "#ef4444",
      }}
    >
      Specialized Care
    </span>

    <h2 className="section-title">Rare & Ultra-Rare Cancer Expertise</h2>
    <p className="section-subtitle">
      We specialize in 45+ rare cancer types, connecting you with the right global specialists.
    </p>

      <Button
        className="primary-cta"
        style={{
          background: "#ef4444",
          padding: "1rem 2rem",
          borderRadius: "9999px",
          fontWeight: 600,
          marginTop: "2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "1.05rem",
        }}
        onClick={() => navigate("/rare-cancers")}
      >
        View All Rare Cancers <ArrowRight size={20} />
      </Button>
  </div>

  {/* CARD GRID */}
  <div
    className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-stretch mt-6 md:mt-12 px-2 md:px-0"
  >
    {/* CARD 1 — ULTRA RARE */}
    <div
      className="hover-card w-full md:w-[33%] rounded-xl md:rounded-[20px] p-4 md:p-7 transition-all duration-300 flex flex-col md:h-full md:justify-between"
      style={{
        background: "rgba(30, 20, 50, 0.35)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        boxShadow: "0 0 18px rgba(100, 50, 200, 0.25)",
      }}
    >
      <div>
        <h3 className="feature-title text-lg md:text-xl lg:text-2xl break-words">Ultra-Rare Cancers</h3>
        <p className="feature-description text-sm md:text-base mt-2 md:mt-3 break-words leading-relaxed">
          14 ultra-rare types including DIPG, ATRT, NUT carcinoma.
          Pediatric tumors, rare carcinomas & aggressive sarcomas.
        </p>
      </div>

      <div className="mt-6 md:mt-auto">
        <TypesCovered 
          count={14} 
          numberColor="text-[#ff4747]" 
          glowClass="shadow-[0_0_35px_rgba(255,74,74,0.45)]"
        />
      </div>
    </div>

    {/* CARD 2 — VERY RARE */}
    <div
      className="hover-card w-full md:w-[33%] rounded-xl md:rounded-[20px] p-4 md:p-7 transition-all duration-300 flex flex-col md:h-full md:justify-between"
      style={{
        background: "rgba(30, 20, 50, 0.35)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        boxShadow: "0 0 18px rgba(100, 50, 200, 0.25)",
      }}
    >
      <div>
        <h3 className="feature-title text-lg md:text-xl lg:text-2xl break-words">Very Rare Cancers</h3>
        <p className="feature-description text-sm md:text-base mt-2 md:mt-3 break-words leading-relaxed">
          12 high-risk types including Chordoma, Merkel Cell & Angiosarcoma.
        </p>
      </div>

      <div className="mt-6 md:mt-auto">
        <TypesCovered 
          count={12} 
          numberColor="text-[#ff9f1c]" 
          glowClass="shadow-[0_0_35px_rgba(255,165,0,0.45)]"
        />
      </div>
    </div>

    {/* CARD 3 — RARE */}
    <div
      className="hover-card w-full md:w-[33%] rounded-xl md:rounded-[20px] p-4 md:p-7 transition-all duration-300 flex flex-col md:h-full md:justify-between"
      style={{
        background: "rgba(30, 20, 50, 0.35)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        boxShadow: "0 0 18px rgba(100, 50, 200, 0.25)",
      }}
    >
      <div>
        <h3 className="feature-title text-lg md:text-xl lg:text-2xl break-words">Rare Cancers</h3>
        <p className="feature-description text-sm md:text-base mt-2 md:mt-3 break-words leading-relaxed">
          13 moderately complex types including GIST & Mesothelioma.
        </p>
      </div>

      <div className="mt-6 md:mt-auto">
        <TypesCovered 
          count={13} 
          numberColor="text-[#facc15]" 
          glowClass="shadow-[0_0_35px_rgba(255,215,0,0.45)]"
        />
      </div>
    </div>

  </div>
</section>

{/* International Care – Medical Tourism Packages */}
<section className="features-section fade-in-section" style={{ marginTop: "6rem" }}>
  <div className="section-header">
    <span
      className="section-badge"
      style={{
        background: "rgba(139,92,246,0.15)",
        border: "1px solid rgba(139,92,246,0.4)",
        color: "#a78bfa",
      }}
    >
      International Care
    </span>

    <h2 className="section-title">Medical Tourism Packages</h2>
    <p className="section-subtitle">
      All-inclusive cancer care packages for international patients covering 31 major cities worldwide
    </p>
  </div>

  {/* MAIN WRAPPER */}
  <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-6 md:mt-12 px-2 md:px-0 justify-center">
    {/* LEFT BOX – CITIES */}
    <div
      className="med-tourism-card w-full md:w-[48%] rounded-xl md:rounded-[20px] p-4 md:p-6 lg:p-10"
      style={{
        background: "rgba(30, 20, 50, 0.35)",
        border: "1px solid rgba(139,92,246,0.25)",
        boxShadow: "0 0 25px rgba(100, 50, 200, 0.25)",
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <MapPin size={22} className="md:w-6 md:h-6 flex-shrink-0" color="#a78bfa" />
        <h3 className="feature-title text-base md:text-lg lg:text-xl xl:text-[1.5rem] break-words text-white font-semibold">31 Premium Cities Worldwide</h3>
      </div>

      <p className="feature-description text-sm md:text-base mt-2 md:mt-3 break-words text-gray-300">
        Access world-class cancer treatment centers across the world's top medical hubs
      </p>

      {/* CITY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 lg:gap-5 mt-4 md:mt-6 lg:mt-8">
        {[
          { name: "Mumbai", country: "India", facilities: "Top-tier facilities" },
          { name: "New Delhi", country: "India", facilities: "Top-tier facilities" },
          { name: "New York City", country: "USA", facilities: "NCI-designated centers" },
          { name: "Houston", country: "USA", facilities: "MD Anderson Cancer Center" },
          { name: "London", country: "UK", facilities: "Royal Marsden Hospital" },
          { name: "Singapore", country: "Singapore", facilities: "JCI-accredited centers" },
          { name: "Tokyo", country: "Japan", facilities: "Advanced treatment" },
          { name: "Paris", country: "France", facilities: "Gustave Roussy" },
        ].map((city, idx) => (
          <div
            key={idx}
            className="city-card p-2 md:p-3 lg:p-5 rounded-lg md:rounded-[14px] text-center"
            style={{
              background: "rgba(20,20,35,0.55)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div className="text-sm md:text-base lg:text-lg font-semibold text-white break-words">
              {city.name}
            </div>
            <div className="text-xs md:text-sm mt-1 md:mt-2 text-gray-300 font-medium break-words">
              {city.country}
            </div>
            <div className="text-xs md:text-sm lg:text-base mt-1 md:mt-2 text-gray-400 break-words">
              {city.facilities}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 md:mt-4 lg:mt-6 text-center">
        <p className="text-xs md:text-sm lg:text-base text-gray-300 font-medium break-words px-2">
          + 23 more cities including Boston, Toronto, Berlin, Dubai, Bangkok, and more
        </p>
      </div>
    </div>

    {/* RIGHT BOX – PACKAGE INCLUSIONS */}
    <div
      className="med-tourism-card blue w-full md:w-[48%] rounded-xl md:rounded-[20px] p-4 md:p-6 lg:p-10"
      style={{
        background: "rgba(20, 30, 50, 0.30)",
        border: "1px solid rgba(56,189,248,0.20)",
        boxShadow: "0 0 25px rgba(56,189,248,0.25)",
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <Building2 size={22} className="md:w-6 md:h-6 flex-shrink-0" color="#38bdf8" />
        <h3 className="feature-title text-base md:text-lg lg:text-xl xl:text-[1.5rem] break-words text-white font-semibold">Package Inclusions</h3>
      </div>

      <p className="feature-description text-sm md:text-base mt-2 md:mt-3 break-words text-gray-300">
        Everything you need for a seamless medical journey
      </p>

      <ul className="mt-4 md:mt-6 lg:mt-8 pl-0 space-y-2 md:space-y-3 lg:space-y-4">
        {[
          "Treatment with itemized costs",
          "Visa assistance & documentation",
          "Airport pickup & transfers",
          "Accommodation for patient & family",
          "Professional translators",
          "Dedicated care coordinator",
          "24/7 emergency support",
        ].map((item, idx) => (
          <li
            key={idx}
            className="flex items-start md:items-center gap-2 md:gap-3 text-sm md:text-base lg:text-lg text-white break-words"
          >
            <CheckCircle2 size={18} className="md:w-5 md:h-5 flex-shrink-0 mt-0.5 md:mt-0" color="#38bdf8" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div> {/* ← FIXED: closes main wrapper */}

</section>


      {/* Hospital Features */}
      <section className="hospitals-section fade-in-section">
        <div className="section-header">
          <Badge className="section-badge">For Hospitals</Badge>
          <h2
            className="section-title"
            data-testid="hospital-features-title"
          >
            Grow Your International Patient Base
          </h2>
          <p className="section-subtitle">
            Connect with qualified patients globally and optimize your care delivery
          </p>
        </div>
        <div className="hospitals-grid">
          {hospitalFeatures.map((feature, index) => (
            <Card
              key={index}
              className="hospital-card"
              data-testid={`hospital-feature-${index}`}
            >
              <CardHeader>
                <div className="hospital-icon">{feature.icon}</div>
              </CardHeader>
              <CardContent>
                <CardTitle className="hospital-card-title">
                  {feature.title}
                </CardTitle>
                <CardDescription className="hospital-card-description">
                  {feature.description}
                </CardDescription>
                <div className="hospital-stat">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>{feature.stat}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section fade-in-section">
        <div className="section-header">
          <Badge className="section-badge">Pricing</Badge>
          <h2 className="section-title" data-testid="pricing-title">
            Simple, Transparent Pricing
          </h2>
          <p className="section-subtitle">
            Choose the plan that fits your needs
          </p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              data-testid={`pricing-plan-${index}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <CardHeader>
                <CardTitle className="plan-name">{plan.name}</CardTitle>
                <CardDescription className="plan-subtitle">
                  {plan.subtitle}
                </CardDescription>
                <div className="plan-price">
                  <PriceTag 
                    currencySymbol="₹" 
                    amount={plan.amount} 
                    periodText={plan.period}
                  />
                </div>
                <p className="plan-description">{plan.description}</p>
              </CardHeader>
              <CardContent className="plan-features">
                {plan.features.map((feature, fIndex) => (
                  <div
                    key={fIndex}
                    className="feature-item"
                    data-testid={`plan-${index}-feature-${fIndex}`}
                  >
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className={`plan-cta ${plan.popular ? "popular" : ""}`}
                  onClick={() => {
                    if (plan.id === 'byonco-pro') {
                      handleSubscribe(plan.id);
                    } else {
                      setShowContactForm(true);
                    }
                  }}
                  data-testid={`plan-${index}-cta`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section fade-in-section">
        <div className="team-container">
          <h3 className="team-title">Built by a world-class team</h3>
          <div className="team-logos">
            <div className="team-logo-item">
              <img
                src="https://www.byoncocare.com/logos/meta.svg"
                alt="Meta"
              />
            </div>
            <div className="team-logo-item">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
              />
            </div>
            <div className="team-logo-item">
              <img
                src="https://www.byoncocare.com/logos/microsoft.svg"
                alt="Microsoft"
              />
            </div>
          </div>
          <p className="team-tagline">
            Built by people who understand your pain, powered by people who can
            solve it
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-section fade-in-section">
        <div className="faqs-container">
          <div className="section-header">
            <Badge className="section-badge">FAQs</Badge>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faqs-grid">
            <details className="faq-item">
              <summary className="faq-question">
                How does ByOnco help with rare and ultra-rare cancers?
              </summary>
              <div className="faq-answer">
                ByOnco specializes in matching patients with rare and ultra-rare
                cancers to the right treatment centers globally. Our AI analyzes
                your specific cancer type, treatment requirements, and matches
                you with hospitals in India, US, EU, and Middle East that have
                expertise in treating your condition.
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                What is included in the all-inclusive medical packages?
              </summary>
              <div className="faq-answer">
                Our packages include treatment plan with itemized costs, travel
                arrangements (flights, visa support), accommodation for patient
                and family, professional translators, local care coordinator,
                and complete medical tourism support from start to finish.
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                How fast can I get a second opinion?
              </summary>
              <div className="faq-answer">
                We provide expert second opinions in under 24 hours. Our network
                includes top oncologists from India and internationally who can
                review your case quickly and provide detailed recommendations.
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                What is the ByOnco PRO subscription?
              </summary>
              <div className="faq-answer">
                ByOnco PRO at ₹99/month gives you unlimited access to real-time
                bed and queue visibility across India, AI-powered hospital
                matching, subsidy and clinical trial matching, fast second
                opinions, multilingual app support, and dedicated care
                coordination.
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                How does the Hospital SaaS work?
              </summary>
              <div className="faq-answer">
                Our Hospital SaaS (₹15,000–25,000/month) provides cancer
                centers with qualified international patient referrals, complete
                case documentation, real-time bed and queue analytics, patient
                conversion tracking, and revenue forecasting tools to grow their
                international patient base.
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                Do you help with visa and insurance?
              </summary>
              <div className="faq-answer">
                Yes! We assist with visa applications for medical tourism, help
                identify insurance coverage options, match you with government
                schemes and NGO subsidies, and provide complete financial
                planning for your treatment journey.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="about" className="final-cta-section fade-in-section">
        <div className="final-cta-glow" />
        <motion.div
          className="final-cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="final-cta-title"
            data-testid="final-cta-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Navigate Your Cancer Care Journey?
          </motion.h2>
          <motion.p
            className="final-cta-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join 10,000+ families who found hope, clarity, and faster treatment
            starts with ByOnco
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="final-cta-button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/get-started");
                } else {
                  navigate("/auth?redirect=/get-started");
                }
              }}
              data-testid="final-cta-button"
            >
              Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-main">
            <div className="footer-logo">
              <span className="logo-text">
                <span className="logo-by">by</span>
                <span className="logo-onco"><span className="logo-o">O</span>nco</span>
              </span>
            </div>
            <p className="footer-description">
              AI-powered oncology medical tourism OS helping patients find the
              right treatment, faster.
            </p>
            <div className="footer-address">
              <p className="footer-address-title">
                PraesidioCare Private Limited
              </p>
              <p className="footer-address-text">Bengaluru, Karnataka, India</p>
              <p className="footer-address-text">
                Email: contact@byoncocare.com
              </p>
            </div>
            <div className="built-in-india">
              <span className="india-flag">🇮🇳</span>
              <span>Built in India</span>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <a href="/find-hospitals" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/find-hospitals"); }}>
              Find Hospitals
            </a>
            <a href="/cost-calculator" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/cost-calculator"); }}>
              Cost Calculator
            </a>
            <a href="/rare-cancers" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/rare-cancers"); }}>
              Rare Cancers
            </a>
            <a href="/second-opinion" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/second-opinion"); }}>
              Second Opinion
            </a>
            <a href="/teleconsultation" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/teleconsultation"); }}>
              Teleconsultation
            </a>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <a href="/about" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              About
            </a>
            <a href="/careers" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/careers"); }}>
              Careers
            </a>
            <a href="/get-started" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/get-started"); }}>
              Get Started
            </a>
            <a href="/products/vayu" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/products/vayu"); }}>
              Products
            </a>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <a href="/privacy" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/terms-and-conditions"); }}>
              Terms of Service
            </a>
            <a href="/security" className="footer-link" onClick={(e) => { e.preventDefault(); navigate("/security"); }}>
              Security
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 ByOnco by PraesidioCare Private Limited. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowContactForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Get Started with ByOnco</h3>
              <button
                className="modal-close"
                onClick={() => setShowContactForm(false)}
                data-testid="modal-close-button"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleContactSubmit}
              className="contact-form"
            >
              {submitStatus === "success" ? (
                <div className="text-center py-6 sm:py-8">
                  <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg font-semibold text-white mb-2">
                    Thank you for connecting with us!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 px-2">
                    Our team will contact you soon. Thanks for connecting with ByOnco.
                  </p>
                  <Button
                    onClick={() => {
                      setShowContactForm(false);
                      setSubmitStatus("");
                      setFormData({ name: "", email: "", phone: "", message: "" });
                      setFormErrors({});
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: "" });
                        }
                      }}
                      placeholder="Enter your name"
                      data-testid="contact-name-input"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: "" });
                        }
                      }}
                      placeholder="your@email.com"
                      data-testid="contact-email-input"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) {
                          setFormErrors({ ...formErrors, phone: "" });
                        }
                      }}
                      placeholder="+91 12345 67890"
                      data-testid="contact-phone-input"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (formErrors.message) {
                          setFormErrors({ ...formErrors, message: "" });
                        }
                      }}
                      placeholder="Tell us about your needs..."
                      data-testid="contact-message-input"
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.message}</p>
                    )}
                  </div>

                  {submitStatus === "error" && formErrors.submit && (
                    <div
                      className="alert error"
                      data-testid="contact-error-message"
                    >
                      {formErrors.submit}
                    </div>
                  )}
                  
                  {submitStatus === "loading" && (
                    <div className="text-center py-4">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
                      <p className="text-white/70 mt-2">Submitting...</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="form-submit"
                    disabled={submitStatus === "success" || submitStatus === "loading"}
                    data-testid="contact-submit-button"
                  >
                    {submitStatus === "loading" ? "Sending..." : "Send Message"}
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedTourismLanding;
