import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import LoadingSpinner from '../common/LoadingSpinner';
import { handleApiError, validatePhone } from '../../utils/helpers';
import { REGIONS } from '../../utils/constants';

const VendorProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    cuisineSpecialties: '',
    operatingRegion: '',
    menuHighlights: '',
    phoneNumber: '',
    businessAddress: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await vendorService.getVendorProfile();
      if (profile) {
        setFormData({
          name: profile.name || '',
          cuisineSpecialties: profile.cuisineSpecialties || '',
          operatingRegion: profile.operatingRegion || '',
          menuHighlights: profile.menuHighlights || '',
          phoneNumber: profile.phoneNumber || '',
          businessAddress: profile.businessAddress || ''
        });
        setIsEditing(true);
      }
    } catch (error) {
      // Profile doesn't exist yet, that's okay
      console.log('Profile not found, creating new');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Business name is required');
      return false;
    }

    if (!formData.cuisineSpecialties.trim()) {
      setError('Cuisine specialties are required');
      return false;
    }

    if (!formData.operatingRegion) {
      setError('Operating region is required');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }

    if (!validatePhone(formData.phoneNumber)) {
      setError('Please enter a valid phone number (10 digits)');
      return false;
    }

    if (!formData.businessAddress.trim()) {
      setError('Business address is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      await vendorService.createOrUpdateProfile(formData);
      setSuccess(isEditing ? 'Profile updated successfully!' : 'Profile created successfully!');
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 2000);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="vendor-profile">
      <div className="container">
        <div className="profile-header">
          <h1>{isEditing ? 'Edit Profile' : 'Complete Your Profile'}</h1>
          <p>
            {isEditing 
              ? 'Update your business information' 
              : 'Please complete your vendor profile to start submitting applications'
            }
          </p>
        </div>

        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Business Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Business Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="Enter your business name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="operatingRegion">Operating Region *</label>
                <select
                  id="operatingRegion"
                  name="operatingRegion"
                  value={formData.operatingRegion}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select operating region</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="businessAddress">Business Address *</label>
                <textarea
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="Enter your business address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Menu Information</h2>
              
              <div className="form-group">
                <label htmlFor="cuisineSpecialties">Cuisine Specialties *</label>
                <input
                  type="text"
                  id="cuisineSpecialties"
                  name="cuisineSpecialties"
                  value={formData.cuisineSpecialties}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="e.g., Indian, Italian, Chinese"
                />
                <small className="form-help">
                  List the types of cuisine you specialize in, separated by commas
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="menuHighlights">Menu Highlights</label>
                <textarea
                  id="menuHighlights"
                  name="menuHighlights"
                  value={formData.menuHighlights}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Describe your signature dishes and popular items"
                  rows="4"
                />
                <small className="form-help">
                  Describe your signature dishes and what makes your food special
                </small>
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
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (isEditing ? 'Update Profile' : 'Save Profile')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;