// pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isVendor()) {
        navigate('/vendor/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, isVendor, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { token, user, status } = response.data;

      if (status === 'SUCCESS') {
        login(user, token);
        
        // Redirect based on role
        if (user.roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard');
        } else if (user.roles.includes('ROLE_VENDOR')) {
          navigate('/vendor/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 403) {
        setError('Account not verified. Please wait for admin approval.');
      } else if (error.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your FoodTruck Hub account</p>
          </div>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? <LoadingSpinner size="small" message="" /> : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? {' '}
              <Link to="/register" className="link">
                Register as Vendor
              </Link>
            </p>
          </div>

          {/* Demo credentials info */}
          <div className="demo-info">
            <h4>Demo Login:</h4>
            <p><strong>Admin:</strong> username: admin, password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;