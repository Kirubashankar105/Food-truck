import React, { useEffect, useState } from "react";
import './DisplayFoodTruck.css';

function DisplayFoodTruck() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('http://localhost:8080/getAllVendors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      } else {
        console.error('Error fetching vendors');
        alert('Error fetching vendor data. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vendors-page">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading vendors...</div>
          </div>
        </div>
      </div>
    );
  }

  const renderGridView = () => (
    <div className="vendors-grid">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="vendor-card">
          <div className="vendor-id">#{vendor.id}</div>
          <h3 className="vendor-name">{vendor.name}</h3>
          
          <div className="vendor-details">
            <div className="vendor-detail">
              <span className="detail-icon">🍽️</span>
              <div className="detail-content">
                <div className="detail-label">Cuisine Specialties</div>
                <div className="detail-value">
                  <span className="cuisine-tag">{vendor.cuisineSpecialties}</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-detail">
              <span className="detail-icon">📍</span>
              <div className="detail-content">
                <div className="detail-label">Operating Region</div>
                <div className="detail-value">
                  <span className="region-badge">{vendor.operatingRegion}</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-detail">
              <span className="detail-icon">✨</span>
              <div className="detail-content">
                <div className="detail-label">Menu Highlights</div>
                <div className="detail-value">{vendor.menuHighlights}</div>
              </div>
            </div>
            
            <div className="vendor-detail">
              <span className="detail-icon">📞</span>
              <div className="detail-content">
                <div className="detail-label">Phone Number</div>
                <div className="detail-value">
                  <a href={`tel:${vendor.phoneNumber}`} className="phone-link">
                    {vendor.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="vendors-table-container">
      <table className="vendors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Cuisine Specialties</th>
            <th>Operating Region</th>
            <th>Menu Highlights</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td data-label="ID">{vendor.id}</td>
              <td data-label="Name">{vendor.name}</td>
              <td data-label="Cuisine Specialties">{vendor.cuisineSpecialties}</td>
              <td data-label="Operating Region">{vendor.operatingRegion}</td>
              <td data-label="Menu Highlights">{vendor.menuHighlights}</td>
              <td data-label="Phone Number">
                <a href={`tel:${vendor.phoneNumber}`} className="phone-link">
                  {vendor.phoneNumber}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="vendors-page">
      <div className="vendors-container">
        <div className="vendors-header">
          <h2 className="vendors-title">
            <span className="vendors-emoji">🍴</span>
            Registered Food Trucks
          </h2>
          <p className="vendors-subtitle">
            Discover amazing food trucks operating in Chennai and Bangalore
          </p>
        </div>
        
        {vendors.length === 0 ? (
          <div className="no-vendors">
            <span className="no-vendors-icon">🚚</span>
            <p>No vendor applications found.</p>
            <p>Be the first to register your food truck!</p>
          </div>
        ) : (
          <>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                📱 Card View
              </button>
              <button
                className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📋 Table View
              </button>
            </div>
            
            {viewMode === 'grid' ? renderGridView() : renderTableView()}
          </>
        )}
      </div>
    </div>
  );
}

export default DisplayFoodTruck;