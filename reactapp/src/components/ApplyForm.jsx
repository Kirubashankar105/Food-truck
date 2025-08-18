import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ApplyForm.css';

function ApplyForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cuisineSpecialties: "",
    operatingRegion: "",
    menuHighlights: "",
    phoneNumber: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.cuisineSpecialties.trim()) {
      newErrors.cuisineSpecialties = 'Cuisine Specialties are required';
    }

    if (!formData.operatingRegion) {
      newErrors.operatingRegion = 'Operating Region is required';
    }

    if (!formData.menuHighlights.trim()) {
      newErrors.menuHighlights = 'Menu Highlights are required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/addVendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          name: "",
          cuisineSpecialties: "",
          operatingRegion: "",
          menuHighlights: "",
          phoneNumber: ""
        });
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/getAllVendors');
        }, 2500);
      } else {
        console.error('Error submitting application');
        alert('Error submitting application. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="apply-form-page">
      <div className={`apply-form-container ${isLoading ? 'form-loading' : ''}`}>
        <h2 className="form-title">
          <span className="form-emoji">🚚</span>
          Vendor Application Form
        </h2>
        
        {showSuccess && (
          <div className="success-modal">
            <p>Application submitted successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cuisineSpecialties" className="form-label">Cuisine Specialties</label>
            <input
              type="text"
              id="cuisineSpecialties"
              name="cuisineSpecialties"
              value={formData.cuisineSpecialties}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Indian, Chinese, Italian"
              disabled={isLoading}
            />
            {errors.cuisineSpecialties && <span className="form-error">{errors.cuisineSpecialties}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="operatingRegion" className="form-label">Operating Region</label>
            <select
              id="operatingRegion"
              name="operatingRegion"
              value={formData.operatingRegion}
              onChange={handleChange}
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Select an operating region</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            {errors.operatingRegion && <span className="form-error">{errors.operatingRegion}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="menuHighlights" className="form-label">Menu Highlights</label>
            <input
              type="text"
              id="menuHighlights"
              name="menuHighlights"
              value={formData.menuHighlights}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Biriyani, Dosa, Pizza"
              disabled={isLoading}
            />
            {errors.menuHighlights && <span className="form-error">{errors.menuHighlights}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              disabled={isLoading}
            />
            {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button 
              type="button" 
              onClick={handleBack} 
              className="btn btn-back"
              disabled={isLoading}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyForm;