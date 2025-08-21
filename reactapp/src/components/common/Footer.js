import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>FoodTruck Permit System</h4>
            <p>Streamlining food truck licensing and permits in Chennai and Bangalore.</p>
          </div>
          
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/vendors">Find Vendors</a></li>
              <li><a href="/register">Apply for Permit</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h5>Operating Regions</h5>
            <ul>
              <li>Chennai</li>
              <li>Bangalore</li>
            </ul>
          </div>

          <div className="footer-section">
            <h5>Contact Info</h5>
            <p>Email: support@foodtruckpermit.com</p>
            <p>Phone: +91-80-1234-5678</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; 2025 FoodTruck Permit System. All rights reserved.</p>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;