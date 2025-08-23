// components/layout/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isVendor } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
            🚚 FoodTruck Hub
          </Link>

          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/vendors" className="nav-link" onClick={closeMobileMenu}>
              Browse Vendors
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="nav-link nav-register" onClick={closeMobileMenu}>
                  Register
                </Link>
              </>
            ) : (
              <>
                {isAdmin() && (
                  <div className="nav-dropdown">
                    <span className="nav-link dropdown-toggle">Admin</span>
                    <div className="dropdown-menu">
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={closeMobileMenu}>
                        Dashboard
                      </Link>
                      <Link to="/admin/pending-users" className="dropdown-item" onClick={closeMobileMenu}>
                        Pending Users
                      </Link>
                      <Link to="/admin/vendors" className="dropdown-item" onClick={closeMobileMenu}>
                        All Vendors
                      </Link>
                      <Link to="/admin/applications" className="dropdown-item" onClick={closeMobileMenu}>
                        Applications
                      </Link>
                    </div>
                  </div>
                )}

                {isVendor() && (
                  <div className="nav-dropdown">
                    <span className="nav-link dropdown-toggle">Vendor</span>
                    <div className="dropdown-menu">
                      <Link to="/vendor/dashboard" className="dropdown-item" onClick={closeMobileMenu}>
                        Dashboard
                      </Link>
                      <Link to="/vendor/profile" className="dropdown-item" onClick={closeMobileMenu}>
                        Profile
                      </Link>
                      <Link to="/vendor/applications" className="dropdown-item" onClick={closeMobileMenu}>
                        Applications
                      </Link>
                    </div>
                  </div>
                )}

                <div className="nav-dropdown">
                  <span className="nav-link dropdown-toggle">
                    👋 {user?.username}
                  </span>
                  <div className="dropdown-menu">
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="nav-toggle" onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;