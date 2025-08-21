import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError } from '../../utils/helpers';
import '../../styles/components/admin.css';

const AdminDashboard = () => {
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
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
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

  const {
    totalVendors = 0,
    totalApplications = 0,
    pendingApplications = 0,
    approvedApplications = 0,
    rejectedApplications = 0
  } = dashboardData || {};

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.username}! Manage vendors and applications.</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{totalVendors}</div>
              <div className="stat-label">Total Vendors</div>
              <div className="stat-action">
                <Link to="/admin/vendors" className="stat-link">View All</Link>
              </div>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{totalApplications}</div>
              <div className="stat-label">Total Applications</div>
              <div className="stat-action">
                <Link to="/admin/applications" className="stat-link">View All</Link>
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{pendingApplications}</div>
              <div className="stat-label">Pending Review</div>
              <div className="stat-action">
                <Link to="/admin/applications?status=SUBMITTED" className="stat-link">Review</Link>
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{approvedApplications}</div>
              <div className="stat-label">Approved</div>
              <div className="stat-action">
                <Link to="/admin/applications?status=APPROVED" className="stat-link">View</Link>
              </div>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <div className="stat-number">{rejectedApplications}</div>
              <div className="stat-label">Rejected</div>
              <div className="stat-action">
                <Link to="/admin/applications?status=REJECTED" className="stat-link">View</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-content">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="action-cards">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <div className="action-content">
                  <h3>Review Applications</h3>
                  <p>Review and process pending vendor applications</p>
                  <Link to="/admin/applications" className="btn btn-primary">
                    Start Review
                  </Link>
                </div>
              </div>

              <div className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-content">
                  <h3>Manage Vendors</h3>
                  <p>View and manage all registered vendors</p>
                  <Link to="/admin/vendors" className="btn btn-primary">
                    View Vendors
                  </Link>
                </div>
              </div>

              <div className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-content">
                  <h3>Generate Reports</h3>
                  <p>Create reports on vendor activity and applications</p>
                  <button className="btn btn-primary" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>

              <div className="action-card">
                <div className="action-icon">⚙️</div>
                <div className="action-content">
                  <h3>System Settings</h3>
                  <p>Configure system settings and preferences</p>
                  <button className="btn btn-primary" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>System Overview</h2>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Application Status Distribution</h3>
                <div className="status-distribution">
                  <div className="status-item">
                    <div className="status-bar">
                      <div 
                        className="status-fill submitted"
                        style={{ width: `${totalApplications ? (pendingApplications / totalApplications) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="status-info">
                      <span>Pending: {pendingApplications}</span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-bar">
                      <div 
                        className="status-fill approved"
                        style={{ width: `${totalApplications ? (approvedApplications / totalApplications) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="status-info">
                      <span>Approved: {approvedApplications}</span>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-bar">
                      <div 
                        className="status-fill rejected"
                        style={{ width: `${totalApplications ? (rejectedApplications / totalApplications) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="status-info">
                      <span>Rejected: {rejectedApplications}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>Regional Distribution</h3>
                <div className="region-info">
                  <div className="region-item">
                    <span className="region-name">Chennai</span>
                    <span className="region-count">Coming Soon</span>
                  </div>
                  <div className="region-item">
                    <span className="region-name">Bangalore</span>
                    <span className="region-count">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Tasks */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Priority Tasks</h2>
            </div>
            <div className="task-list">
              {pendingApplications > 0 && (
                <div className="task-item high">
                  <div className="task-icon">⚡</div>
                  <div className="task-content">
                    <h4>Applications Awaiting Review</h4>
                    <p>{pendingApplications} applications need to be reviewed</p>
                  </div>
                  <div className="task-action">
                    <Link to="/admin/applications" className="btn btn-sm btn-primary">
                      Review Now
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="task-item medium">
                <div className="task-icon">📈</div>
                <div className="task-content">
                  <h4>Weekly Report Due</h4>
                  <p>Generate weekly vendor activity report</p>
                </div>
                <div className="task-action">
                  <button className="btn btn-sm btn-outline" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>

              {pendingApplications === 0 && (
                <div className="task-item low">
                  <div className="task-icon">✅</div>
                  <div className="task-content">
                    <h4>All Caught Up!</h4>
                    <p>No urgent tasks requiring immediate attention</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;