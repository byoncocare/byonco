/**
 * Authentication utilities
 */

export const getAuthToken = () => {
  return localStorage.getItem('byonco_jwt');
};

export const getUser = () => {
  const userStr = localStorage.getItem('byonco_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  localStorage.removeItem('byonco_jwt');
  localStorage.removeItem('byonco_user');
  window.location.href = '/';
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
















