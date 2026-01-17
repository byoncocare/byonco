import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useStackApp } from '@stackframe/react';
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

// Wrapper component that uses Stack Auth hooks
export const AuthProvider = ({ children }) => {
  const stackUser = useUser();
  const stackApp = useStackApp();
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

  // Sync Stack Auth user with our context
  useEffect(() => {
    const syncStackAuth = async () => {
      if (stackUser) {
        // User is logged in via Stack Auth
        try {
          // Get access token from Stack Auth
          const accessToken = await stackUser.getAccessToken();
          
          // Convert Stack Auth user to our format
          const userData = {
            id: stackUser.id,
            email: stackUser.primaryEmail,
            full_name: stackUser.displayName || stackUser.primaryEmail.split('@')[0],
            phone: stackUser.phoneNumber || '',
            is_verified: stackUser.primaryEmailVerified || false,
            auth_provider: 'stack',
            profile_completed: false, // Will be determined by profile data
            created_at: stackUser.createdAtMillis ? new Date(stackUser.createdAtMillis).toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Try to fetch profile from backend (if exists)
          try {
            const profileData = await fetchUserProfile(accessToken);
            if (profileData) {
              // Merge Stack Auth data with backend profile
              Object.assign(userData, profileData);
            }
          } catch (e) {
            // Backend profile doesn't exist yet, that's okay
            console.log('No backend profile found, using Stack Auth data');
          }

          setUser(userData);
          setToken(accessToken);
          setIsAuthenticated(true);
          setProfileCompleted(userData.profile_completed || false);
        } catch (error) {
          console.error('Error syncing Stack Auth user:', error);
        }
      } else {
        // Check for legacy auth (for migration period)
        const storedToken = getAuthToken();
        const storedUser = getUser();

        if (storedToken && storedUser) {
          // Legacy auth - fetch fresh profile data from backend
          const profileData = await fetchUserProfile(storedToken);
          if (profileData) {
            setUser(profileData);
            setProfileCompleted(profileData.profile_completed || false);
          } else {
            setUser(storedUser);
            setProfileCompleted(storedUser.profile_completed || false);
          }
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // No auth
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          setProfileCompleted(false);
        }
      }
      setLoading(false);
    };

    syncStackAuth();
  }, [stackUser]);

  const login = async (userData, authToken) => {
    // Legacy login function - kept for backward compatibility
    // Stack Auth handles login automatically, but we keep this for migration period
    try {
      localStorage.setItem('byonco_jwt', authToken);
      localStorage.setItem('byonco_user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);
      setProfileCompleted(userData.profile_completed || false);
      
      try {
        const profileData = await fetchUserProfile(authToken);
        if (profileData) {
          const finalUserData = profileData;
          setUser(finalUserData);
          setProfileCompleted(finalUserData.profile_completed || false);
          localStorage.setItem('byonco_user', JSON.stringify(finalUserData));
        }
      } catch (profileError) {
        console.warn('Could not fetch fresh profile, using initial user data:', profileError);
      }
    } catch (error) {
      console.error('Error in login function:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Logout from Stack Auth if logged in
    if (stackUser) {
      try {
        await stackApp.signOut();
      } catch (error) {
        console.error('Error signing out from Stack Auth:', error);
      }
    }
    
    // Clear legacy auth data
    logoutUtil();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setProfileCompleted(false);
    
    // Clear axios headers
    try {
      if (axios && axios.defaults && axios.defaults.headers && axios.defaults.headers.common) {
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (e) {
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

