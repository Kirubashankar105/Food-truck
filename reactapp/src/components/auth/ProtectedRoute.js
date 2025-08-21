import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { loading, isAuthenticated, hasRole } = useAuth();

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  const checkAuthenticated = () => {
    if (typeof isAuthenticated !== 'function') {
      console.error('isAuthenticated is not a function in ProtectedRoute');
      return false;
    }
    try {
      return isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication in ProtectedRoute:', error);
      return false;
    }
  };

  // Check if user has required role
  const checkRole = (role) => {
    if (typeof hasRole !== 'function') {
      console.error('hasRole is not a function in ProtectedRoute');
      return false;
    }
    try {
      return hasRole(role);
    } catch (error) {
      console.error('Error checking role in ProtectedRoute:', error);
      return false;
    }
  };

  const isUserAuthenticated = checkAuthenticated();

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !checkRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;