import React, { useState, useEffect } from 'react';
import vendorService from '../../services/vendorService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError } from '../../utils/helpers';
import { REGIONS } from '../../utils/constants';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    cuisine: '',
    search: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vendors, filters]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAllVendors();
      setVendors(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = vendors;

    // Filter by region
    if (filters.region !== 'all') {
      filtered = filtered.filter(vendor => 
        vendor.operatingRegion === filters.region
      );
    }

    // Filter by cuisine
    if (filters.cuisine) {
      filtered = filtered.filter(vendor =>
        vendor.cuisineSpecialties?.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm) ||
        vendor.cuisineSpecialties?.toLowerCase().includes(searchTerm) ||
        vendor.menuHighlights?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredVendors(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      region: 'all',
      cuisine: '',
      search: ''
    });
  };

  const getUniqueValues = (field) => {
    const values = vendors
      .map(vendor => vendor[field])
      .filter(value => value)
      .flatMap(value => value.split(',').map(v => v.trim()))
      .filter((value, index, array) => array.indexOf(value) === index);
    return values;
  };

  if (loading) {
    return <LoadingSpinner text="Loading vendors..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error Loading Vendors</h2>
          <p>{error}</p>
          <button onClick={fetchVendors} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Food Truck Vendors</h1>
          <p>Discover amazing food trucks operating in Chennai and Bangalore</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filter Vendors</h3>
            <button onClick={clearFilters} className="btn btn-outline btn-sm">
              Clear Filters
            </button>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by name, cuisine, or specialty..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                className="form-control"
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="all">All Regions</option>
                {REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="cuisine">Cuisine Type</label>
              <input
                type="text"
                id="cuisine"
                className="form-control"
                placeholder="e.g., Indian, Chinese, Italian..."
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              />
            </div>
          </div>

          <div className="results-count">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="vendors-section">
          {filteredVendors.length > 0 ? (
            <div className="vendors-grid">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-header">
                    <h3 className="vendor-name">{vendor.name}</h3>
                    <span className="vendor-region">{vendor.operatingRegion}</span>
                  </div>

                  <div className="vendor-details">
                    {vendor.cuisineSpecialties && (
                      <div className="vendor-detail">
                        <strong>Cuisine:</strong>
                        <span>{vendor.cuisineSpecialties}</span>
                      </div>
                    )}

                    {vendor.menuHighlights && (
                      <div className="vendor-detail">
                        <strong>Specialties:</strong>
                        <span>{vendor.menuHighlights}</span>
                      </div>
                    )}

                    {vendor.phoneNumber && (
                      <div className="vendor-detail">
                        <strong>Phone:</strong>
                        <span>{vendor.phoneNumber}</span>
                      </div>
                    )}

                    {vendor.businessAddress && (
                      <div className="vendor-detail">
                        <strong>Address:</strong>
                        <span>{vendor.businessAddress}</span>
                      </div>
                    )}
                  </div>

                  <div className="vendor-footer">
                    <span className="vendor-status">
                      {vendor.profileComplete ? 'Verified Vendor' : 'In Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No vendors found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorList;