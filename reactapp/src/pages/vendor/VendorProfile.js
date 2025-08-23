// pages/vendor/VendorProfile.js
import React, { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/apiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import './VendorProfile.css';

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisineSpecialties: '',
    operatingRegion: '',
    menuHighlights: '',
    phoneNumber: '',
    businessAddress: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await vendorAPI.getProfile();
      
      if (response.data && !response.data.message) {
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          cuisineSpecialties: response.data.cuisineSpecialties || '',
          operatingRegion: response.data.operatingRegion || '',
          menuHighlights: response.data.menuHighlights || '',
          phoneNumber: response.data.phoneNumber || '',
          businessAddress: response.data.businessAddress || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status !== 404) {
        setError('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Business name is required';
    }

    if (!formData.cuisineSpecialties.trim()) {
      errors.cuisineSpecialties = 'Cuisine specialties are required';
    }

    if (!formData.operatingRegion) {
      errors.operatingRegion = 'Operating region is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.businessAddress.trim()) {
      errors.businessAddress = 'Business address is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await vendorAPI.createOrUpdateProfile(formData);
      setProfile(response.data.vendor);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.error || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading profile..." />;
  }

  return (
    <div className="vendor-profile">
      <div className="container">
        <div className="profile-header">
          <h1>{profile ? 'Edit Profile' : 'Create Profile'}</h1>
          <p>Manage your food truck business information</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')}
          />
        )}

        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.name ? 'error' : ''}`}
                  placeholder="Your food truck business name"
                  disabled={isSaving}
                />
                {validationErrors.name && (
                  <span className="error-text">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.phoneNumber ? 'error' : ''}`}
                  placeholder="Your contact number"
                  disabled={isSaving}
                />
                {validationErrors.phoneNumber && (
                  <span className="error-text">{validationErrors.phoneNumber}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cuisineSpecialties" className="form-label">
                Cuisine Specialties *
              </label>
              <input
                type="text"
                id="cuisineSpecialties"
                name="cuisineSpecialties"
                value={formData.cuisineSpecialties}
                onChange={handleChange}
                className={`form-input ${validationErrors.cuisineSpecialties ? 'error' : ''}`}
                placeholder="e.g., Indian, Chinese, Italian, Street Food"
                disabled={isSaving}
              />
              {validationErrors.cuisineSpecialties && (
                <span className="error-text">{validationErrors.cuisineSpecialties}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="operatingRegion" className="form-label">
                Operating Region *
              </label>
              <select
                id="operatingRegion"
                name="operatingRegion"
                value={formData.operatingRegion}
                onChange={handleChange}
                className={`form-input ${validationErrors.operatingRegion ? 'error' : ''}`}
                disabled={isSaving}
              >
                <option value="">Select your operating region</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
              {validationErrors.operatingRegion && (
                <span className="error-text">{validationErrors.operatingRegion}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="menuHighlights" className="form-label">
                Menu Highlights
              </label>
              <textarea
                id="menuHighlights"
                name="menuHighlights"
                value={formData.menuHighlights}
                onChange={handleChange}
                className="form-input"
                placeholder="Describe your signature dishes and popular items"
                rows="4"
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessAddress" className="form-label">
                Business Address *
              </label>
              <textarea
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className={`form-input ${validationErrors.businessAddress ? 'error' : ''}`}
                placeholder="Your business address or headquarters location"
                rows="3"
                disabled={isSaving}
              />
              {validationErrors.businessAddress && (
                <span className="error-text">{validationErrors.businessAddress}</span>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? <LoadingSpinner size="small" message="" /> : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;