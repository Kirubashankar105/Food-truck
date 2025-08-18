import React from "react";
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          🍔 Food Truck Vendor
        </div>
        
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#contact" className="footer-link">Contact Us</a>
          <a href="#help" className="footer-link">Help Center</a>
        </div>
        
        <div className="footer-social">
          <a href="#facebook" className="social-icon" aria-label="Facebook">
            📘
          </a>
          <a href="#twitter" className="social-icon" aria-label="Twitter">
            🐦
          </a>
          <a href="#instagram" className="social-icon" aria-label="Instagram">
            📷
          </a>
          <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
            💼
          </a>
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-info">
          <div className="footer-section">
            <h4>For Vendors</h4>
            <p>Join our platform and connect with food lovers in Chennai and Bangalore.</p>
          </div>
          <div className="footer-section">
            <h4>For Customers</h4>
            <p>Discover amazing food trucks and enjoy delicious street food experiences.</p>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>Need help? <a href="mailto:support@foodtruck.com">support@foodtruck.com</a></p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-text">
            © {currentYear} Food Truck Vendor Application. All rights reserved.
            <span className="footer-emoji">🚚</span>
            Made with love for food enthusiasts!
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;