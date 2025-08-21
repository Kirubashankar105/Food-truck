import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_VENDOR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const user = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Redirect based on role
      if (user.role === 'ROLE_VENDOR') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">📝</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join our food truck community</p>
          </div>

          <form onSubmit={handleSubmit} className={`auth-form ${loading ? 'loading' : ''}`}>
            <div className="role-selection">
              <label>Account Type</label>
              <div className="role-options">
                <div className="role-option">
                  <input
                    type="radio"
                    id="vendor"
                    name="role"
                    value="ROLE_VENDOR"
                    checked={formData.role === 'ROLE_VENDOR'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="vendor" className="role-label">
                    <div className="role-icon">🚚</div>
                    <div className="role-name">Vendor</div>
                    <p className="role-description">Apply for food truck permits</p>
                  </label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="ROLE_ADMIN"
                    checked={formData.role === 'ROLE_ADMIN'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="admin" className="role-label">
                    <div className="role-icon">👤</div>
                    <div className="role-name">Admin</div>
                    <p className="role-description">Manage applications and vendors</p>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Choose a username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;