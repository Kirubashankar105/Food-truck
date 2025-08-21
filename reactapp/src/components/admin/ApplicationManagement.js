import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { handleApiError, formatDate, formatStatus, getStatusColor } from '../../utils/helpers';
import { APPLICATION_STATUS } from '../../utils/constants';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  const location = useLocation();

  useEffect(() => {
    // Check if there's a status filter in URL params
    const urlParams = new URLSearchParams(location.search);
    const statusParam = urlParams.get('status');
    if (statusParam) {
      setFilters(prev => ({ ...prev, status: statusParam }));
    }
    fetchApplications();
  }, [location]);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllApplications();
      setApplications(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = applications;

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(app => 
        app.status === filters.status
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.vendor?.name?.toLowerCase().includes(searchTerm) ||
        app.vendor?.user?.username?.toLowerCase().includes(searchTerm) ||
        app.id.toString().includes(searchTerm)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      search: ''
    });
  };

  const openApplicationModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeApplicationModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const getStatusIcon = (status) => {
    const icons = {
      [APPLICATION_STATUS.DRAFT]: '📝',
      [APPLICATION_STATUS.SUBMITTED]: '📨',
      [APPLICATION_STATUS.UNDER_REVIEW]: '🔍',
      [APPLICATION_STATUS.APPROVED]: '✅',
      [APPLICATION_STATUS.REJECTED]: '❌',
      [APPLICATION_STATUS.INSPECTION_SCHEDULED]: '📅',
      [APPLICATION_STATUS.INSPECTION_COMPLETED]: '✅',
      [APPLICATION_STATUS.LICENSED]: '🏆'
    };
    return icons[status] || '📄';
  };

  const getPriorityLevel = (application) => {
    const daysSinceSubmitted = application.submittedAt 
      ? Math.floor((new Date() - new Date(application.submittedAt)) / (1000 * 60 * 60 * 24))
      : 0;

    if (application.status === APPLICATION_STATUS.SUBMITTED && daysSinceSubmitted > 7) {
      return 'high';
    } else if (application.status === APPLICATION_STATUS.SUBMITTED && daysSinceSubmitted > 3) {
      return 'medium';
    }
    return 'low';
  };

  if (loading) {
    return <LoadingSpinner text="Loading applications..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error Loading Applications</h2>
          <p>{error}</p>
          <button onClick={fetchApplications} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-management">
      <div className="container">
        <div className="page-header">
          <h1>Application Management</h1>
          <p>Review and manage vendor applications</p>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {applications.filter(app => app.status === APPLICATION_STATUS.SUBMITTED).length}
            </div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length}
            </div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {applications.filter(app => app.status === APPLICATION_STATUS.LICENSED).length}
            </div>
            <div className="stat-label">Licensed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>Filter Applications</h2>
            <div className="results-count">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by vendor name, username, or ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-control"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Statuses</option>
                {Object.values(APPLICATION_STATUS).map(status => (
                  <option key={status} value={status}>{formatStatus(status)}</option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-outline">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-section">
          {filteredApplications.length > 0 ? (
            <div className="applications-grid">
              {filteredApplications.map((application) => (
                <div 
                  key={application.id} 
                  className={`application-card ${getPriorityLevel(application)}-priority`}
                >
                  <div className="application-header">
                    <div className="application-id">
                      <span className="id-label">Application</span>
                      <span className="id-number">#{application.id}</span>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(application.status) }}
                    >
                      <span className="status-icon">{getStatusIcon(application.status)}</span>
                      <span className="status-text">{formatStatus(application.status)}</span>
                    </div>
                  </div>

                  <div className="application-content">
                    <div className="vendor-info">
                      <h3>{application.vendor?.name || 'N/A'}</h3>
                      <p className="vendor-details">
                        <strong>Username:</strong> {application.vendor?.user?.username}<br/>
                        <strong>Region:</strong> {application.vendor?.operatingRegion}<br/>
                        <strong>Cuisine:</strong> {application.vendor?.cuisineSpecialties}
                      </p>
                    </div>

                    <div className="application-dates">
                      <div className="date-item">
                        <label>Submitted:</label>
                        <span>{formatDate(application.submittedAt)}</span>
                      </div>
                      {application.reviewedAt && (
                        <div className="date-item">
                          <label>Reviewed:</label>
                          <span>{formatDate(application.reviewedAt)}</span>
                        </div>
                      )}
                    </div>

                    {application.comments && (
                      <div className="application-comments">
                        <strong>Comments:</strong>
                        <p>{application.comments}</p>
                      </div>
                    )}

                    {getPriorityLevel(application) === 'high' && (
                      <div className="priority-alert">
                        <span className="alert-icon">⚠️</span>
                        <span>High Priority - Submitted over a week ago</span>
                      </div>
                    )}
                  </div>

                  <div className="application-actions">
                    <button 
                      onClick={() => openApplicationModal(application)}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </button>
                    {application.status === APPLICATION_STATUS.SUBMITTED && (
                      <button className="btn btn-success btn-sm">
                        Start Review
                      </button>
                    )}
                    {application.status === APPLICATION_STATUS.UNDER_REVIEW && (
                      <>
                        <button className="btn btn-success btn-sm">
                          Approve
                        </button>
                        <button className="btn btn-danger btn-sm">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <h3>No applications found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeApplicationModal}
        title={`Application #${selectedApplication?.id} Details`}
        size="large"
      >
        {selectedApplication && (
          <div className="application-modal-content">
            <div className="modal-section">
              <h3>Vendor Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Business Name:</label>
                  <span>{selectedApplication.vendor?.name}</span>
                </div>
                <div className="info-item">
                  <label>Username:</label>
                  <span>{selectedApplication.vendor?.user?.username}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{selectedApplication.vendor?.user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone:</label>
                  <span>{selectedApplication.vendor?.phoneNumber}</span>
                </div>
                <div className="info-item full-width">
                  <label>Address:</label>
                  <span>{selectedApplication.vendor?.businessAddress}</span>
                </div>
                <div className="info-item">
                  <label>Operating Region:</label>
                  <span>{selectedApplication.vendor?.operatingRegion}</span>
                </div>
                <div className="info-item">
                  <label>Cuisine:</label>
                  <span>{selectedApplication.vendor?.cuisineSpecialties}</span>
                </div>
                <div className="info-item full-width">
                  <label>Menu Highlights:</label>
                  <span>{selectedApplication.vendor?.menuHighlights}</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>Application Status</h3>
              <div className="status-timeline">
                <div className="timeline-item">
                  <span className="timeline-date">{formatDate(selectedApplication.createdAt)}</span>
                  <span className="timeline-event">Application Created</span>
                </div>
                {selectedApplication.submittedAt && (
                  <div className="timeline-item">
                    <span className="timeline-date">{formatDate(selectedApplication.submittedAt)}</span>
                    <span className="timeline-event">Application Submitted</span>
                  </div>
                )}
                {selectedApplication.reviewedAt && (
                  <div className="timeline-item">
                    <span className="timeline-date">{formatDate(selectedApplication.reviewedAt)}</span>
                    <span className="timeline-event">Application Reviewed</span>
                  </div>
                )}
              </div>
            </div>

            {selectedApplication.comments && (
              <div className="modal-section">
                <h3>Comments</h3>
                <p>{selectedApplication.comments}</p>
              </div>
            )}

            <div className="modal-actions">
              {selectedApplication.status === APPLICATION_STATUS.SUBMITTED && (
                <>
                  <button className="btn btn-success">
                    Start Review
                  </button>
                  <button className="btn btn-outline">
                    Assign Inspector
                  </button>
                </>
              )}
              {selectedApplication.status === APPLICATION_STATUS.UNDER_REVIEW && (
                <>
                  <button className="btn btn-success">
                    Approve Application
                  </button>
                  <button className="btn btn-danger">
                    Reject Application
                  </button>
                </>
              )}
              <button onClick={closeApplicationModal} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationManagement;