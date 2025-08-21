import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError, formatDate, formatStatus, getStatusColor } from '../../utils/helpers';
import '../../styles/components/vendor.css';

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getVendorDashboard();
      setDashboardData(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { profile, applications = [], applicationCount = 0 } = dashboardData || {};
  const hasProfile = profile && profile.profileComplete;
  
  const getLatestApplication = () => {
    if (applications && applications.length > 0) {
      return applications[applications.length - 1];
    }
    return null;
  };

  const latestApplication = getLatestApplication();

  return (
    <div className="vendor-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Vendor Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <div className="stat-number">{applicationCount}</div>
              <div className="stat-label">Applications</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">
                {hasProfile ? '1' : '0'}
              </div>
              <div className="stat-label">Profile Complete</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <div className="stat-number">
                {profile?.operatingRegion || 'N/A'}
              </div>
              <div className="stat-label">Operating Region</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-main">
            {/* Profile Status */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Profile Status</h2>
                <Link to="/vendor/profile" className="btn btn-outline btn-sm">
                  {hasProfile ? 'Edit Profile' : 'Complete Profile'}
                </Link>
              </div>
              <div className="card-content">
                {hasProfile ? (
                  <div className="profile-summary">
                    <div className="profile-status complete">
                      <span className="status-icon">✅</span>
                      <span>Profile Complete</span>
                    </div>
                    <div className="profile-details">
                      <div className="profile-detail">
                        <strong>Business Name:</strong> {profile.name}
                      </div>
                      <div className="profile-detail">
                        <strong>Cuisine:</strong> {profile.cuisineSpecialties}
                      </div>
                      <div className="profile-detail">
                        <strong>Region:</strong> {profile.operatingRegion}
                      </div>
                      <div className="profile-detail">
                        <strong>Phone:</strong> {profile.phoneNumber}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-incomplete">
                    <div className="profile-status incomplete">
                      <span className="status-icon">⚠️</span>
                      <span>Profile Incomplete</span>
                    </div>
                    <p>Complete your profile to start submitting applications.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Application */}
            {latestApplication && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Latest Application</h2>
                  <Link to="/vendor/applications" className="btn btn-outline btn-sm">
                    View All
                  </Link>
                </div>
                <div className="card-content">
                  <div className="application-summary">
                    <div className="application-header">
                      <span className="application-id">
                        Application #{latestApplication.id}
                      </span>
                      <span 
                        className="application-status"
                        style={{ backgroundColor: getStatusColor(latestApplication.status) }}
                      >
                        {formatStatus(latestApplication.status)}
                      </span>
                    </div>
                    <div className="application-dates">
                      <div className="date-info">
                        <strong>Submitted:</strong> {formatDate(latestApplication.submittedAt)}
                      </div>
                      {latestApplication.reviewedAt && (
                        <div className="date-info">
                          <strong>Reviewed:</strong> {formatDate(latestApplication.reviewedAt)}
                        </div>
                      )}
                    </div>
                    {latestApplication.comments && (
                      <div className="application-comments">
                        <strong>Comments:</strong>
                        <p>{latestApplication.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="card-content">
                <div className="action-buttons">
                  {!hasProfile ? (
                    <Link to="/vendor/profile" className="action-btn primary">
                      <span className="action-icon">👤</span>
                      <span>Complete Profile</span>
                    </Link>
                  ) : (
                    <>
                      <Link to="/vendor/application" className="action-btn primary">
                        <span className="action-icon">📝</span>
                        <span>New Application</span>
                      </Link>
                      <Link to="/vendor/applications" className="action-btn secondary">
                        <span className="action-icon">📋</span>
                        <span>View Applications</span>
                      </Link>
                      <Link to="/vendor/profile" className="action-btn secondary">
                        <span className="action-icon">✏️</span>
                        <span>Edit Profile</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            {/* Application History */}
            {applications && applications.length > 0 && (
              <div className="sidebar-card">
                <h3>Recent Applications</h3>
                <div className="application-list">
                  {applications.slice(-3).reverse().map((application) => (
                    <div key={application.id} className="application-item">
                      <div className="application-item-header">
                        <span className="application-item-id">
                          #{application.id}
                        </span>
                        <span 
                          className="application-item-status"
                          style={{ backgroundColor: getStatusColor(application.status) }}
                        >
                          {formatStatus(application.status)}
                        </span>
                      </div>
                      <div className="application-item-date">
                        {formatDate(application.submittedAt)}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/vendor/applications" className="sidebar-link">
                  View All Applications →
                </Link>
              </div>
            )}

            {/* Help & Support */}
            <div className="sidebar-card">
              <h3>Need Help?</h3>
              <div className="help-links">
                <a href="/help/application-guide" className="help-link">
                  📖 Application Guide
                </a>
                <a href="/help/requirements" className="help-link">
                  📋 Requirements
                </a>
                <a href="/help/contact" className="help-link">
                  📞 Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;