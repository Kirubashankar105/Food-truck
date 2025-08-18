import React from "react";
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h2 className="home-title">
          Welcome to the Food Truck Vendor Application
          <span className="home-emoji">🚚✨</span>
        </h2>
        <p className="home-description">
          Discover the best food trucks in Chennai & Bangalore!  
          Join our community of skilled vendors and connect with food lovers eager to explore street food.
        </p>
        <p className="home-description">
          Whether you're a vendor looking to share your delicious offerings or a foodie wanting to
          explore vibrant street food, you've come to the right place!
        </p>
        <div className="home-cta">
          <Link to="/apply" className="become-vendor-btn">
            Become a Vendor
          </Link>
        </div>
        
        <div className="home-features">
          <div className="feature-item">
            <span className="feature-icon">🍔</span>
            <h3 className="feature-title">Quality Food</h3>
            <p className="feature-desc">Discover amazing cuisines from talented vendors</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📍</span>
            <h3 className="feature-title">Prime Locations</h3>
            <p className="feature-desc">Operating in Chennai and Bangalore</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <h3 className="feature-title">Community</h3>
            <p className="feature-desc">Join our growing network of vendors</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;