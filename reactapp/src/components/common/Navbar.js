import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/common.css';

const Navbar = () => {
  // Always call hooks at the top level - no conditional calls
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract values from context - these can be undefined if context isn't ready
  const { user, logout, isAuthenticated, hasRole, loading } = authContext || {};

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Safe check for authentication
  const checkAuthenticated = () => {
    if (typeof isAuthenticated !== 'function') {
      return false;
    }
    try {
      return isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  // Safe check for roles
  const checkRole = (role) => {
    if (typeof hasRole !== 'function') {
      return false;
    }
    try {
      return hasRole(role);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🚚</span>
            FoodTruck Permit
          </Link>
          <div className="navbar-menu">
            <div className="navbar-nav">
              Loading...
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isUserAuthenticated = checkAuthenticated();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-icon">🚚</span>
          FoodTruck Permit
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="navbar-nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/vendors" 
              className={`nav-link ${isActive('/vendors') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Find Vendors
            </Link>

            {isUserAuthenticated ? (
              <>
                {checkRole('ROLE_VENDOR') && (
                  <div className="nav-dropdown">
                    <span className="nav-link dropdown-toggle">Vendor</span>
                    <div className="dropdown-menu">
                      <Link 
                        to="/vendor/dashboard" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/vendor/profile" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/vendor/applications" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Applications
                      </Link>
                    </div>
                  </div>
                )}

                {checkRole('ROLE_ADMIN') && (
                  <div className="nav-dropdown">
                    <span className="nav-link dropdown-toggle">Admin</span>
                    <div className="dropdown-menu">
                      <Link 
                        to="/admin/dashboard" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/vendors" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Vendors
                      </Link>
                      <Link 
                        to="/admin/applications" 
                        className="dropdown-item"
                        onClick={closeMobileMenu}
                      >
                        Applications
                      </Link>
                    </div>
                  </div>
                )}

                <div className="nav-user">
                  <span className="user-name">Welcome, {user?.username}</span>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="nav-auth">
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;