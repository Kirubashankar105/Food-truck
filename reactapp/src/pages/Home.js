// pages/Home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isVendor()) {
        navigate('/vendor/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">FoodTruck Hub</span>
          </h1>
          <p className="hero-subtitle">
            The premier platform connecting food truck vendors with customers 
            across Chennai and Bangalore. Join our growing community of culinary entrepreneurs!
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary hero-btn" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
            <Link to="/vendors" className="btn btn-outline hero-btn">
              Browse Vendors
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="food-truck-illustration">
            🚚
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose FoodTruck Hub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Easy Registration</h3>
              <p>Simple and streamlined vendor registration process with quick approval workflow.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Verified Vendors</h3>
              <p>All vendors go through our thorough verification and inspection process for quality assurance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Regional Coverage</h3>
              <p>Currently serving Chennai and Bangalore with plans to expand to more cities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Diverse Cuisine</h3>
              <p>Discover a wide variety of culinary offerings from local and international cuisines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Registered Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cuisine Types</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Food Truck Journey?</h2>
            <p>Join our community of successful food truck vendors and grow your business with us.</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Register as Vendor
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;