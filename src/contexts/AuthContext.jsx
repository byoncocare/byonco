import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, getUser, logout as logoutUtil } from '@/utils/auth';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://byonco-fastapi-backend.onrender.com';
const API = `${BACKEND_URL}/api/auth`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Fetch user profile from backend
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(`${API}/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        // Fetch fresh profile data from backend
        const profileData = await fetchUserProfile(storedToken);
        if (profileData) {
          setUser(profileData);
          setProfileCompleted(profileData.profile_completed || false);
        } else {
          // Fallback to stored user if fetch fails
          setUser(storedUser);
          setProfileCompleted(storedUser.profile_completed || false);
        }
        setToken(storedToken);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (userData, authToken) => {
    try {
      // Store token and initial user data immediately
      localStorage.setItem('byonco_jwt', authToken);
      localStorage.setItem('byonco_user', JSON.stringify(userData));
      
      // Set initial state
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);
      setProfileCompleted(userData.profile_completed || false);
      
      // Try to fetch fresh profile data (non-blocking)
      try {
        const profileData = await fetchUserProfile(authToken);
        if (profileData) {
          const finalUserData = profileData;
          setUser(finalUserData);
          setProfileCompleted(finalUserData.profile_completed || false);
          // Update localStorage with fresh data
          localStorage.setItem('byonco_user', JSON.stringify(finalUserData));
        }
      } catch (profileError) {
        // Profile fetch failed, but login still succeeds with initial data
        console.warn('Could not fetch fresh profile, using initial user data:', profileError);
      }
    } catch (error) {
      console.error('Error in login function:', error);
      throw error; // Re-throw to let caller handle
    }
  };

  const logout = () => {
    // Clear all auth data
    logoutUtil();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setProfileCompleted(false);
    
    // Clear any axios default headers if they exist
    // This ensures no stale tokens are sent in future requests
    try {
      if (axios && axios.defaults && axios.defaults.headers && axios.defaults.headers.common) {
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      // Ignore errors when clearing headers
      console.warn('Could not clear axios headers:', e);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    setProfileCompleted(userData.profile_completed || false);
    localStorage.setItem('byonco_user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isAuthenticated,
    profileCompleted,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

