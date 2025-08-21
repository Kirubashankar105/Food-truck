import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError } from '../../utils/helpers';

const ApplicationForm = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicationId, setApplicationId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkProfileAndCreateApplication();
  }, []);

  const checkProfileAndCreateApplication = async () => {
    try {
      setLoading(true);
      const profileData = await vendorService.getVendorProfile();
      
      if (!profileData || !profileData.profileComplete) {
        setError('Please complete your profile before creating an application.');
        setTimeout(() => {
          navigate('/vendor/profile');
        }, 3000);
        return;
      }

      setProfile(profileData);
      
      // Create a new application
      const application = await vendorService.createApplication();
      setApplicationId(application.id);
      
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationId) {
      setError('No application found to submit.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await vendorService.submitApplication(applicationId);
      setSuccess('Application submitted successfully! You will receive updates on your application status.');
      setTimeout(() => {
        navigate('/vendor/applications');
      }, 3000);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing application..." />;
  }

  if (error && !profile) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Profile Required</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="application-form">
      <div className="container">
        <div className="application-header">
          <h1>Food Truck Permit Application</h1>
          <p>Review your information and submit your application for processing</p>
        </div>

        <div className="application-content">
          {/* Application Information */}
          <div className="application-card">
            <div className="card-header">
              <h2>Application Information</h2>
              {applicationId && (
                <span className="application-id">ID: #{applicationId}</span>
              )}
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Applicant</label>
                  <span>{user?.username}</span>
                </div>
                <div className="info-item">
                  <label>Application Type</label>
                  <span>Food Truck Permit</span>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span className="status-badge draft">Draft</span>
                </div>
                <div className="info-item">
                  <label>Created</label>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Review */}
          {profile && (
            <div className="application-card">
              <div className="card-header">
                <h2>Business Profile Review</h2>
                <button 
                  onClick={() => navigate('/vendor/profile')}
                  className="btn btn-outline btn-sm"
                >
                  Edit Profile
                </button>
              </div>
              <div className="card-content">
                <div className="profile-review">
                  <div className="profile-section">
                    <h3>Business Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Business Name</label>
                        <span>{profile.name}</span>
                      </div>
                      <div className="info-item">
                        <label>Operating Region</label>
                        <span>{profile.operatingRegion}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone Number</label>
                        <span>{profile.phoneNumber}</span>
                      </div>
                      <div className="info-item full-width">
                        <label>Business Address</label>
                        <span>{profile.businessAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-section">
                    <h3>Menu Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Cuisine Specialties</label>
                        <span>{profile.cuisineSpecialties}</span>
                      </div>
                      <div className="info-item full-width">
                        <label>Menu Highlights</label>
                        <span>{profile.menuHighlights || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Required Documents */}
          <div className="application-card">
            <div className="card-header">
              <h2>Required Documents</h2>
            </div>
            <div className="card-content">
              <div className="documents-info">
                <p>The following documents will be required for your application review:</p>
                <div className="document-list">
                  <div className="document-item">
                    <span className="document-icon">📄</span>
                    <div className="document-details">
                      <strong>Business License</strong>
                      <p>Valid business registration and license</p>
                    </div>
                  </div>
                  <div className="document-item">
                    <span className="document-icon">🍽️</span>
                    <div className="document-details">
                      <strong>Food Safety Certification</strong>
                      <p>Food handler's permit and safety certificates</p>
                    </div>
                  </div>
                  <div className="document-item">
                    <span className="document-icon">🚚</span>
                    <div className="document-details">
                      <strong>Vehicle Registration</strong>
                      <p>Food truck registration and inspection papers</p>
                    </div>
                  </div>
                  <div className="document-item">
                    <span className="document-icon">🛡️</span>
                    <div className="document-details">
                      <strong>Insurance Papers</strong>
                      <p>General liability and vehicle insurance</p>
                    </div>
                  </div>
                </div>
                <div className="document-note">
                  <p><strong>Note:</strong> You can upload these documents after submitting your application. Our team will contact you with specific requirements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="application-card">
            <div className="card-header">
              <h2>Application Process</h2>
            </div>
            <div className="card-content">
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Application Submitted</h4>
                    <p>Your application is received and assigned to a reviewer</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Document Review</h4>
                    <p>Our team reviews your documents and business information</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div class="step-content">
                    <h4>Inspection Scheduled</h4>
                    <p>On-site inspection of your food truck and equipment</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h4>Permit Issued</h4>
                    <p>Upon successful completion, your permit is issued</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div class="application-card">
            <div class="card-header">
              <h2>Terms and Conditions</h2>
            </div>
            <div class="card-content">
              <div class="terms-content">
                <ul class="terms-list">
                  <li>All information provided must be accurate and truthful</li>
                  <li>Required documents must be valid and up-to-date</li>
                  <li>Inspection must be passed to receive permit</li>
                  <li>Permit must be renewed annually</li>
                  <li>Operating region restrictions apply as specified</li>
                  <li>Health and safety regulations must be followed at all times</li>
                </ul>
                <div className="terms-agreement">
                  <label className="checkbox-container">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    I agree to the terms and conditions and certify that all information provided is accurate
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* Submit Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/vendor/dashboard')}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitApplication}
              className="btn btn-primary"
              disabled={submitting || !applicationId}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;