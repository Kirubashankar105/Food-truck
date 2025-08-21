import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError, formatDate } from '../../utils/helpers';
import { REGIONS } from '../../utils/constants';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    search: '',
    status: 'all'
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
      const data = await adminService.getAllVendors();
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

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm) ||
        vendor.cuisineSpecialties?.toLowerCase().includes(searchTerm) ||
        vendor.user?.username?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'complete') {
        filtered = filtered.filter(vendor => vendor.profileComplete);
      } else if (filters.status === 'incomplete') {
        filtered = filtered.filter(vendor => !vendor.profileComplete);
      }
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
      search: '',
      status: 'all'
    });
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
    <div className="vendor-management">
      <div className="container">
        <div className="page-header">
          <h1>Vendor Management</h1>
          <p>Manage and monitor all registered vendors</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>Filter Vendors</h2>
            <div className="results-count">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </div>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by name, cuisine, or username..."
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
              <label htmlFor="status">Profile Status</label>
              <select
                id="status"
                className="form-control"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-outline">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="vendors-section">
          {filteredVendors.length > 0 ? (
            <div className="table-container">
              <table className="vendors-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Contact</th>
                    <th>Cuisine</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        <div className="vendor-info">
                          <div className="vendor-name">{vendor.name}</div>
                          <div className="vendor-username">@{vendor.user?.username}</div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="phone">{vendor.phoneNumber || 'N/A'}</div>
                          <div className="email">{vendor.user?.email}</div>
                        </div>
                      </td>
                      <td>
                        <div className="cuisine-info">
                          {vendor.cuisineSpecialties || 'Not specified'}
                        </div>
                      </td>
                      <td>
                        <span className="region-badge">
                          {vendor.operatingRegion}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${vendor.profileComplete ? 'complete' : 'incomplete'}`}>
                          {vendor.profileComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                      <td>
                        <div className="date-info">
                          {formatDate(vendor.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline">
                            View Details
                          </button>
                          <button className="btn btn-sm btn-outline">
                            Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {/* Statistics */}
        <div className="stats-section">
          <h2>Vendor Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{vendors.length}</div>
              <div className="stat-label">Total Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {vendors.filter(v => v.profileComplete).length}
              </div>
              <div className="stat-label">Complete Profiles</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {vendors.filter(v => v.operatingRegion === 'Chennai').length}
              </div>
              <div className="stat-label">Chennai Vendors</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {vendors.filter(v => v.operatingRegion === 'Bangalore').length}
              </div>
              <div className="stat-label">Bangalore Vendors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;