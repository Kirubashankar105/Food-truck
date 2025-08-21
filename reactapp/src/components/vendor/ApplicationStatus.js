import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vendorService from '../../services/vendorService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError, formatDate, formatStatus, getStatusColor } from '../../utils/helpers';
import { APPLICATION_STATUS } from '../../utils/constants';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getVendorApplications();
      setApplications(data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      [APPLICATION_STATUS.DRAFT]: 'Application created but not yet submitted.',
      [APPLICATION_STATUS.SUBMITTED]: 'Application has been submitted and is awaiting review.',
      [APPLICATION_STATUS.UNDER_REVIEW]: 'Our team is reviewing your application and documents.',
      [APPLICATION_STATUS.APPROVED]: 'Your application has been approved and inspection is being scheduled.',
      [APPLICATION_STATUS.REJECTED]: 'Your application was not approved. Please check comments for details.',
      [APPLICATION_STATUS.INSPECTION_SCHEDULED]: 'An inspection has been scheduled for your food truck.',
      [APPLICATION_STATUS.INSPECTION_COMPLETED]: 'Inspection completed. Awaiting final approval.',
      [APPLICATION_STATUS.LICENSED]: 'Congratulations! Your permit has been issued.'
    };
    return descriptions[status] || 'Status unknown';
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

  const getNextSteps = (status) => {
    const steps = {
      [APPLICATION_STATUS.DRAFT]: 'Complete and submit your application to begin the review process.',
      [APPLICATION_STATUS.SUBMITTED]: 'We will review your application within 3-5 business days.',
      [APPLICATION_STATUS.UNDER_REVIEW]: 'Please wait while we review your documents. We may contact you for additional information.',
      [APPLICATION_STATUS.APPROVED]: 'We will schedule an inspection and contact you with the details.',
      [APPLICATION_STATUS.REJECTED]: 'Review the feedback and resubmit your application with the required changes.',
      [APPLICATION_STATUS.INSPECTION_SCHEDULED]: 'Prepare for your inspection. Ensure all equipment and documentation is ready.',
      [APPLICATION_STATUS.INSPECTION_COMPLETED]: 'We are processing your final approval. You will be notified soon.',
      [APPLICATION_STATUS.LICENSED]: 'You can now operate your food truck! Make sure to display your permit prominently.'
    };
    return steps[status] || 'Please contact support for more information.';
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
    <div className="application-status">
      <div className="container">
        <div className="page-header">
          <div className="header-content">
            <h1>My Applications</h1>
            <p>Track the status of your food truck permit applications</p>
          </div>
          <div className="header-actions">
            <Link to="/vendor/application" className="btn btn-primary">
              New Application
            </Link>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <div className="no-applications-content">
              <div className="no-applications-icon">📋</div>
              <h2>No Applications Found</h2>
              <p>You haven't submitted any applications yet.</p>
              <Link to="/vendor/application" className="btn btn-primary">
                Create Your First Application
              </Link>
            </div>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application.id} className="application-card">
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
                  <div className="application-dates">
                    <div className="date-item">
                      <label>Created:</label>
                      <span>{formatDate(application.createdAt)}</span>
                    </div>
                    {application.submittedAt && (
                      <div className="date-item">
                        <label>Submitted:</label>
                        <span>{formatDate(application.submittedAt)}</span>
                      </div>
                    )}
                    {application.reviewedAt && (
                      <div className="date-item">
                        <label>Reviewed:</label>
                        <span>{formatDate(application.reviewedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="status-description">
                    <p>{getStatusDescription(application.status)}</p>
                  </div>

                  {application.comments && (
                    <div className="application-comments">
                      <h4>Comments:</h4>
                      <p>{application.comments}</p>
                    </div>
                  )}

                  <div className="next-steps">
                    <h4>Next Steps:</h4>
                    <p>{getNextSteps(application.status)}</p>
                  </div>
                </div>

                <div className="application-actions">
                  {application.status === APPLICATION_STATUS.DRAFT && (
                    <button className="btn btn-primary btn-sm">
                      Complete Application
                    </button>
                  )}
                  {application.status === APPLICATION_STATUS.REJECTED && (
                    <Link to="/vendor/application" className="btn btn-primary btn-sm">
                      Resubmit Application
                    </Link>
                  )}
                  {application.status === APPLICATION_STATUS.LICENSED && (
                    <button className="btn btn-success btn-sm">
                      Download Permit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Process Info */}
        <div className="process-info">
          <h2>Application Process Timeline</h2>
          <div className="process-timeline">
            <div className="timeline-step">
              <div className="step-marker">1</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Complete your profile and submit your application with required information.</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker">2</div>
              <div className="step-content">
                <h3>Document Review</h3>
                <p>Our team reviews your business information and supporting documents.</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker">3</div>
              <div className="step-content">
                <h3>Inspection</h3>
                <p>Schedule and complete an on-site inspection of your food truck.</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker">4</div>
              <div className="step-content">
                <h3>Permit Issued</h3>
                <p>Receive your food truck permit and begin operations!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h2>Need Help?</h2>
          <div className="help-grid">
            <div className="help-item">
              <h3>📞 Contact Support</h3>
              <p>Have questions about your application? Contact our support team.</p>
              <a href="mailto:support@foodtruckpermit.com" className="help-link">
                support@foodtruckpermit.com
              </a>
            </div>
            <div className="help-item">
              <h3>📋 Requirements</h3>
              <p>Review the complete list of requirements for your permit application.</p>
              <Link to="/help/requirements" className="help-link">
                View Requirements
              </Link>
            </div>
            <div className="help-item">
              <h3>🕐 Processing Times</h3>
              <p>Learn about typical processing times for each stage of your application.</p>
              <Link to="/help/processing-times" className="help-link">
                View Processing Times
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;