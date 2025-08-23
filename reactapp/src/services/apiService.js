import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  getProfile: () => apiClient.get('/api/auth/profile'),
  test: () => apiClient.get('/api/auth/test'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiClient.get('/api/admin/dashboard'),
  getPendingUsers: () => apiClient.get('/api/admin/pending-users'),
  verifyUser: (userId, approve) => apiClient.post(`/api/admin/verify-user/${userId}?approve=${approve}`),
  getAllVendors: () => apiClient.get('/api/admin/vendors'),
  getVendorsByRegion: (region) => apiClient.get(`/api/admin/vendors/region/${region}`),
  getAllApplications: () => apiClient.get('/api/admin/applications'),
  getApplicationsByStatus: (status) => apiClient.get(`/api/admin/applications/status/${status}`),
};

// Vendor API
export const vendorAPI = {
  getDashboard: () => apiClient.get('/api/vendor/dashboard'),
  getProfile: () => apiClient.get('/api/vendor/profile'),
  createOrUpdateProfile: (profileData) => apiClient.post('/api/vendor/profile', profileData),
  getApplications: () => apiClient.get('/api/vendor/applications'),
  createApplication: () => apiClient.post('/api/vendor/application'),
  submitApplication: (applicationId) => apiClient.put(`/api/vendor/application/${applicationId}/submit`),
};

// Public API
export const publicAPI = {
  getAllVendors: () => apiClient.get('/getAllVendors'),
  addVendor: (vendorData) => apiClient.post('/addVendor', vendorData),
};

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.Authorization;
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.Authorization;
};

export default apiClient;