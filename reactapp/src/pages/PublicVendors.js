// pages/PublicVendors.js
import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import './PublicVendors.css';

const PublicVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    region: '',
    cuisine: '',
    search: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vendors, filters]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await publicAPI.getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Failed to load vendors');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = vendors;

    if (filters.region) {
      filtered = filtered.filter(vendor => 
        vendor.operatingRegion === filters.region
      );
    }

    if (filters.cuisine) {
      filtered = filtered.filter(vendor =>
        vendor.cuisineSpecialties?.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(vendor =>
        vendor.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.cuisineSpecialties?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.menuHighlights?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      cuisine: '',
      search: '',
    });
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading vendors..." />;
  }

  return (
    <div className="public-vendors">
      <div className="container">
        <div className="page-header">
          <h1>Browse Food Truck Vendors</h1>
          <p>Discover amazing food trucks in Chennai and Bangalore</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="search" className="filter-label">Search</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Search by name, cuisine, or menu items..."
              />
            </div>

            <div className="filter-group">
              <label htmlFor="region" className="filter-label">Region</label>
              <select
                id="region"
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">All Regions</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="cuisine" className="filter-label">Cuisine Type</label>
              <input
                type="text"
                id="cuisine"
                name="cuisine"
                value={filters.cuisine}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="e.g., Indian, Chinese, Italian"
              />
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-header">
          <h2>
            {filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'} Found
          </h2>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="no-vendors">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Vendors Found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Show All Vendors
              </button>
            </div>
          </div>
        ) : (
          <div className="vendors-grid">
            {filteredVendors.map(vendor => (
              <div key={vendor.id} className="vendor-card">
                <div className="vendor-header">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <span className="vendor-region">{vendor.operatingRegion}</span>
                </div>

                <div className="vendor-details">
                  <div className="detail-row">
                    <span className="detail-label">Cuisine:</span>
                    <span className="detail-value">{vendor.cuisineSpecialties}</span>
                  </div>

                  {vendor.phoneNumber && (
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{vendor.phoneNumber}</span>
                    </div>
                  )}

                  {vendor.businessAddress && (
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{vendor.businessAddress}</span>
                    </div>
                  )}
                </div>

                {vendor.menuHighlights && (
                  <div className="vendor-menu">
                    <h4>Menu Highlights</h4>
                    <p>{vendor.menuHighlights}</p>
                  </div>
                )}

                <div className="vendor-footer">
                  <span className="profile-status">
                    {vendor.profileComplete ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVendors;