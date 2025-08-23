// pages/vendor/VendorDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorAPI } from '../../services/apiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await vendorAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'SUBMITTED': return 'orange';
      case 'UNDER_REVIEW': return 'blue';
      default: return 'gray';
    }
  };

  const createApplication = async () => {
    try {
      setIsLoading(true);
      await vendorAPI.createApplication();
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating application:', error);
      setError(error.response?.data?.error || 'Failed to create application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading dashboard..." />;
  }

  return (
    <div className="vendor-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Vendor Dashboard</h1>
          <p>Manage your food truck business profile and applications</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        <div className="dashboard-grid">
          {/* Profile Status Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Profile Status</h3>
            </div>
            <div className="card-content">
              {dashboardData?.profile ? (
                <div className="profile-info">
                  <div className="profile-detail">
                    <strong>Business Name:</strong> {dashboardData.profile.name}
                  </div>
                  <div className="profile-detail">
                    <strong>Region:</strong> {dashboardData.profile.operatingRegion}
                  </div>
                  <div className="profile-detail">
                    <strong>Cuisine:</strong> {dashboardData.profile.cuisineSpecialties}
                  </div>
                  <div className={`status-badge ${dashboardData.profile.profileComplete ? 'complete' : 'incomplete'}`}>
                    {dashboardData.profile.profileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </div>
                </div>
              ) : (
                <div className="no-profile">
                  <p>No profile found. Please create your vendor profile first.</p>
                </div>
              )}
              <div className="card-actions">
                <Link to="/vendor/profile" className="btn btn-primary">
                  {dashboardData?.profile ? 'Edit Profile' : 'Create Profile'}
                </Link>
              </div>
            </div>
          </div>

          {/* Applications Summary Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Applications Overview</h3>
            </div>
            <div className="card-content">
              <div className="applications-summary">
                <div className="summary-item">
                  <span className="summary-number">{dashboardData?.applicationCount || 0}</span>
                  <span className="summary-label">Total Applications</span>
                </div>
              </div>
              
              {dashboardData?.applications && dashboardData.applications.length > 0 ? (
                <div className="recent-applications">
                  <h4>Recent Applications</h4>
                  {dashboardData.applications.slice(0, 3).map(app => (
                    <div key={app.id} className="application-item">
                      <div className="application-info">
                        <span className="application-id">#{app.id}</span>
                        <span className="application-date">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(app.status) }}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-applications">
                  <p>No applications found.</p>
                  {dashboardData?.profile?.profileComplete && (
                    <button 
                      onClick={createApplication}
                      className="btn btn-success"
                      disabled={isLoading}
                    >
                      Create New Application
                    </button>
                  )}
                </div>
              )}
              
              <div className="card-actions">
                <Link to="/vendor/applications" className="btn btn-outline">
                  View All Applications
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="quick-actions">
                <Link to="/vendor/profile" className="action-item">
                  <div className="action-icon">👤</div>
                  <div className="action-text">
                    <strong>Manage Profile</strong>
                    <span>Update your business information</span>
                  </div>
                </Link>
                
                <Link to="/vendor/applications" className="action-item">
                  <div className="action-icon">📋</div>
                  <div className="action-text">
                    <strong>View Applications</strong>
                    <span>Track your application status</span>
                  </div>
                </Link>

                {dashboardData?.profile?.profileComplete && (
                  <button onClick={createApplication} className="action-item action-button">
                    <div className="action-icon">➕</div>
                    <div className="action-text">
                      <strong>New Application</strong>
                      <span>Submit a new license application</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Getting Started Tips</h3>
            </div>
            <div className="card-content">
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-number">1</span>
                  <span className="tip-text">Complete your vendor profile with all required information</span>
                </div>
                <div className="tip-item">
                  <span className="tip-number">2</span>
                  <span className="tip-text">Submit your license application for review</span>
                </div>
                <div className="tip-item">
                  <span className="tip-number">3</span>
                  <span className="tip-text">Wait for admin approval and inspection scheduling</span>
                </div>
                <div className="tip-item">
                  <span className="tip-number">4</span>
                  <span className="tip-text">Start operating once approved and licensed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;