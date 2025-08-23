// pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/apiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>System overview and management controls</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{dashboardData?.pendingUserVerifications || 0}</div>
              <div className="stat-label">Pending User Verifications</div>
            </div>
            <Link to="/admin/pending-users" className="stat-link">
              View Details →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <div className="stat-number">{dashboardData?.totalVendors || 0}</div>
              <div className="stat-label">Total Vendors</div>
            </div>
            <Link to="/admin/vendors" className="stat-link">
              View All →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{dashboardData?.totalApplications || 0}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <Link to="/admin/applications" className="stat-link">
              View All →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{dashboardData?.pendingApplications || 0}</div>
              <div className="stat-label">Pending Applications</div>
            </div>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="dashboard-section">
          <h2>Application Status Overview</h2>
          <div className="status-grid">
            <div className="status-item pending">
              <div className="status-number">{dashboardData?.pendingApplications || 0}</div>
              <div className="status-label">Pending</div>
            </div>
            <div className="status-item approved">
              <div className="status-number">{dashboardData?.approvedApplications || 0}</div>
              <div className="status-label">Approved</div>
            </div>
            <div className="status-item rejected">
              <div className="status-number">{dashboardData?.rejectedApplications || 0}</div>
              <div className="status-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/pending-users" className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-content">
                <h3>User Verifications</h3>
                <p>Review and approve pending user registrations</p>
                {dashboardData?.pendingUserVerifications > 0 && (
                  <span className="action-badge">{dashboardData.pendingUserVerifications}</span>
                )}
              </div>
            </Link>

            <Link to="/admin/applications" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h3>Review Applications</h3>
                <p>Process vendor license applications</p>
                {dashboardData?.pendingApplications > 0 && (
                  <span className="action-badge">{dashboardData.pendingApplications}</span>
                )}
              </div>
            </Link>

            <Link to="/admin/vendors" className="action-card">
              <div className="action-icon">🏪</div>
              <div className="action-content">
                <h3>Manage Vendors</h3>
                <p>View and manage all registered vendors</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>System Status</h2>
          <div className="status-overview">
            <div className="status-card">
              <h4>User Management</h4>
              <p>
                {dashboardData?.pendingUserVerifications > 0 
                  ? `${dashboardData.pendingUserVerifications} users awaiting verification`
                  : 'All users verified'
                }
              </p>
            </div>
            <div className="status-card">
              <h4>Application Processing</h4>
              <p>
                {dashboardData?.pendingApplications > 0 
                  ? `${dashboardData.pendingApplications} applications need review`
                  : 'No pending applications'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;