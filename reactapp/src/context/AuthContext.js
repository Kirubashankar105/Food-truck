import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const token = authService.getToken();
        const storedUser = authService.getCurrentUser();
        
        console.log('Auth data:', { token: !!token, storedUser });
        
        if (token && storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        console.log('Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Add safety wrapper
  const isAuthenticated = () => {
    try {
      if (typeof authService.isAuthenticated !== 'function') {
        console.error('authService.isAuthenticated is not a function');
        return false;
      }
      return authService.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // Add safety wrapper
  const hasRole = (role) => {
    try {
      if (typeof authService.hasRole !== 'function') {
        console.error('authService.hasRole is not a function');
        return false;
      }
      return authService.hasRole(role);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    loading
  };

  // Debug log
  console.log('AuthContext providing:', {
    user: !!user,
    loading,
    isAuthenticated: typeof isAuthenticated,
    hasRole: typeof hasRole
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};