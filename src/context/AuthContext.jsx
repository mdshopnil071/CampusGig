import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/usersApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Sync user from backend on mount if token exists
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('access_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const userData = await usersApi.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Failed to sync current user:', err);
      // If unauthorized and refresh fails, logout is handled by client.js interceptor
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to global logout events triggered by expired tokens in axios
    const handleGlobalLogout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, [refreshUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const tokenData = await authApi.login(email, password);
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
      setToken(tokenData.access_token);

      // Fetch user profile immediately
      const profile = await usersApi.getMe();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));

      toast.success(`Welcome back, ${profile.full_name}! 👋`);
      return { success: true, user: profile };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password. Please try again.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Signup handler
  const signup = async (userData) => {
    try {
      const createdUser = await authApi.signup(userData);
      toast.success('Account created successfully! Please log in.');
      return { success: true, user: createdUser };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please check your information.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      toast.success('You have been logged out.');
    }
  };

  // Update profile
  const updateUser = async (updateData) => {
    try {
      const updated = await usersApi.updateMe(updateData);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile updated successfully!');
      return { success: true, user: updated };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
