import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, Loader2, CheckCircle2, Sparkles, Clock, Shield, Upload, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecondOpinionAIPage from './SecondOpinionAIPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api`;

const STORAGE_SUBSCRIPTION = 'byonco_subscription_status';

export default function SecondOpinionPage() {
  const navigate = useNavigate();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showPremiumForm, setShowPremiumForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    cancer_type: '',
    current_diagnosis: '',
    current_treatment: '',
    medical_history: '',
    questions: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Check subscription status
    const subscription = localStorage.getItem(STORAGE_SUBSCRIPTION) === 'true';
    setHasSubscription(subscription);
    // If subscribed, show premium form directly; otherwise show AI interface
    setShowPremiumForm(subscription);
  }, []);

  // If not subscribed, show AI interface first
  // This check must come AFTER all hooks are called
  if (!showPremiumForm) {
    return <SecondOpinionAIPage />;
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or image files.`);
        return false;
      }
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append files
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`files`, file);
      });
      
      const response = await axios.post(`${API}/second-opinion`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting second opinion request:', error);
      alert('Failed to submit request. Please try again.');
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
            <Card className="bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl rounded-xl sm:rounded-2xl">
              <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
                <motion.div
                  className="flex justify-center mb-3 sm:mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/50 rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-emerald-400" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-slate-100 mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-bold break-words px-2">
                  Second Opinion Request Submitted!
                </CardTitle>
                <CardDescription className="text-purple-200 text-sm sm:text-base md:text-lg font-medium px-2">
                  Your request has been received and is being reviewed by our expert team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="bg-slate-800/80 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 border border-purple-500/30">
                  <div>
                    <div className="text-xs sm:text-sm text-purple-300 mb-1 font-medium">Request ID</div>
                    <div className="text-slate-100 font-mono text-sm sm:text-base md:text-lg font-semibold break-all">{result.id}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-purple-300 mb-1 font-medium">Patient Name</div>
                    <div className="text-slate-100 text-base sm:text-lg font-semibold break-words">{result.patient_name}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-purple-300 mb-1 font-medium">Status</div>
                    <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50 px-2 sm:px-3 py-0.5 sm:py-1 font-semibold text-xs sm:text-sm">
                      {result.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-purple-300 mb-1 font-medium">Estimated Time</div>
                    <div className="text-slate-100 text-base sm:text-lg flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                      <span>{result.estimated_time}</span>
                    </div>
                  </div>
                </div>

                {result.ai_preliminary_analysis && (
                  <motion.div
                    className="bg-gradient-to-br from-emerald-900/50 to-slate-900/80 border border-emerald-500/40 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2 sm:mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0" />
                      <span>AI Preliminary Analysis</span>
                    </h3>
                    <p className="text-slate-200 whitespace-pre-wrap leading-relaxed font-medium text-sm sm:text-base break-words">{result.ai_preliminary_analysis}</p>
                    <p className="text-xs sm:text-sm text-purple-300 mt-3 sm:mt-4 italic font-medium">
                      Note: This is a preliminary AI analysis. A specialist will review your case and provide a detailed second opinion.
                    </p>
                  </motion.div>
                )}

                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/40 rounded-xl p-6">
                  <h4 className="text-slate-100 font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-base sm:text-lg">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                    <span>What happens next?</span>
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-slate-200 text-xs sm:text-sm font-medium">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      Our team of specialists will review your case thoroughly
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      You'll receive a detailed second opinion within 12-24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      We'll contact you via email with the complete analysis
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1 font-bold">•</span>
                      You can schedule a consultation call to discuss the findings
                    </li>
                  </ul>
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
          <Badge className="mb-3 sm:mb-4 bg-pink-500/20 text-pink-400 border-pink-500/40 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
            <FileText className="h-3 w-3 mr-1.5 inline" />
            Expert Second Opinion
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent break-words">
            Get a Second Opinion
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-purple-200 max-w-2xl mx-auto">
            Expert oncology review in under 24 hours from board-certified specialists
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-slate-900/95 border-purple-500/30 backdrop-blur-xl shadow-2xl rounded-xl sm:rounded-2xl">
            <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl text-slate-100 font-bold break-words">Submit Your Case</CardTitle>
              <CardDescription className="text-purple-200 text-sm sm:text-base md:text-lg font-medium mt-1 sm:mt-2">
                Fill in the details below. All information is confidential and secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Patient Name *</Label>
                  <Input
                    required
                    placeholder="Full name"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Cancer Type *</Label>
                  <Input
                    required
                    placeholder="e.g., Breast Cancer, Lung Cancer"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 h-auto text-sm sm:text-base"
                    value={formData.cancer_type}
                    onChange={(e) => setFormData({...formData, cancer_type: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Current Diagnosis *</Label>
                  <Textarea
                    required
                    placeholder="Describe your current diagnosis in detail"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[100px] sm:min-h-[120px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                    value={formData.current_diagnosis}
                    onChange={(e) => setFormData({...formData, current_diagnosis: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Current Treatment (if any)</Label>
                  <Textarea
                    placeholder="Describe any ongoing treatment"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[80px] sm:min-h-[100px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                    value={formData.current_treatment}
                    onChange={(e) => setFormData({...formData, current_treatment: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Medical History</Label>
                  <Textarea
                    placeholder="Any relevant medical history, previous conditions, surgeries, etc."
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[80px] sm:min-h-[100px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                    value={formData.medical_history}
                    onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Specific Questions or Concerns</Label>
                  <Textarea
                    placeholder="Any specific questions you'd like the specialist to address"
                    className="bg-slate-800/60 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[80px] sm:min-h-[100px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
                    value={formData.questions}
                    onChange={(e) => setFormData({...formData, questions: e.target.value})}
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <Label className="text-purple-200 mb-1.5 sm:mb-2 block text-sm sm:text-base">Attach Medical Reports or Documents (Optional)</Label>
                  <div className="space-y-3 sm:space-y-4">
                    <div 
                      className="border-2 border-dashed border-purple-500/40 rounded-lg sm:rounded-xl p-4 sm:p-6 bg-slate-800/40 hover:border-purple-500/60 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = Array.from(e.dataTransfer.files);
                        const validFiles = files.filter(file => {
                          const maxSize = 10 * 1024 * 1024; // 10MB
                          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                          
                          if (file.size > maxSize) {
                            alert(`${file.name} is too large. Maximum file size is 10MB.`);
                            return false;
                          }
                          if (!allowedTypes.includes(file.type)) {
                            alert(`${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or image files.`);
                            return false;
                          }
                          return true;
                        });
                        setUploadedFiles(prev => [...prev, ...validFiles]);
                      }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                        <div className="bg-purple-500/20 rounded-full p-3 sm:p-4">
                          <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                        </div>
                        <div className="text-center px-2">
                          <p className="text-slate-200 font-medium mb-1 text-sm sm:text-base">Click to upload or drag and drop</p>
                          <p className="text-xs sm:text-sm text-purple-300">PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-purple-600/20 border-purple-500/40 text-purple-200 hover:bg-purple-600/30 hover:border-purple-500/60 cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-upload')?.click();
                          }}
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-purple-300 font-medium">Uploaded Files ({uploadedFiles.length}):</p>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-slate-800/60 border border-purple-500/30 rounded-lg p-2 sm:p-3"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-200 text-xs sm:text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-purple-300 text-[10px] sm:text-xs">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2 p-1.5 sm:p-2"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/40 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    📝 <strong className="text-slate-100">Note:</strong> Upload medical reports, scans, pathology reports, or any relevant documents to help our specialists provide a more comprehensive review.
                  </p>
                </div>

                {/* Data Protection Note */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/80 border border-emerald-500/40 rounded-lg sm:rounded-xl p-4 sm:p-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-emerald-500/20 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-emerald-300 font-semibold mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>Your Data is Protected</span>
                      </h4>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
                        All information you provide, including medical records and personal details, is encrypted and stored securely. 
                        We comply with HIPAA and international data protection regulations. Your data will only be accessed by 
                        authorized medical professionals involved in your case review and will never be shared with third parties 
                        without your explicit consent. All communications are confidential and protected by medical privacy laws.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-base sm:text-lg py-4 sm:py-6 min-h-[44px]"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    'Submit for Second Opinion'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            {
              icon: <FileText className="h-6 w-6 text-emerald-400" />,
              title: "Expert Review",
              description: "Board-certified oncologists with 15+ years experience"
            },
            {
              icon: <Clock className="h-6 w-6 text-cyan-400" />,
              title: "Quick Turnaround",
              description: "Detailed second opinion within 12-24 hours"
            },
            {
              icon: <Sparkles className="h-6 w-6 text-purple-400" />,
              title: "Comprehensive Report",
              description: "Detailed analysis with treatment recommendations"
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
