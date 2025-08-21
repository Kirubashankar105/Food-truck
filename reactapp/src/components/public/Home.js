import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Chennai & Bangalore Food Truck Permits</h1>
            <p className="hero-subtitle">
              Get your food truck permit quickly and easily. Join the growing community of mobile food vendors in Chennai and Bangalore.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Apply for Permit
              </Link>
              <Link to="/vendors" className="btn btn-outline btn-large">
                View Vendors
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <div className="food-truck-icon">🚚</div>
              <div className="food-icon">🍔</div>
              <div className="location-icon">📍</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <p>Streamlined permit process for food truck vendors</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Processing</h3>
              <p>Fast track your application with our streamlined digital process. Get approved in days, not weeks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Digital Platform</h3>
              <p>Complete everything online - from application to document submission and status tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Expert Support</h3>
              <p>Get guidance from our team of experts who understand the food truck industry inside out.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Verified Vendors</h3>
              <p>Join our network of verified food truck vendors operating across Chennai and Bangalore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get your food truck permit in 4 simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Profile</h3>
                <p>Register and complete your vendor profile with business information</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Fill out the permit application with required details and documentation</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Review & Inspection</h3>
                <p>Our team reviews your application and schedules an inspection</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get Licensed</h3>
                <p>Receive your permit and start operating your food truck legally</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Licensed Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Approval Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Avg. Days Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Food Truck Business?</h2>
            <p>Join hundreds of successful food truck vendors in Chennai and Bangalore</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Today
              </Link>
              <Link to="/vendors" className="btn btn-outline btn-large">
                View Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;