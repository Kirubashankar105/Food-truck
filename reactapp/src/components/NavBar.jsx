import React, { useState } from "react";
import { Link } from "react-router-dom";
import './NavBar.css';

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          🍔 Food Truck Vendor
        </div>
        
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/getAllVendors"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Vendor Details
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/apply"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Become a Vendor
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;