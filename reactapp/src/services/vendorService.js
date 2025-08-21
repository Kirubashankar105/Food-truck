import api from './api';

const vendorService = {
  // Public endpoints
  getAllVendors: async () => {
    try {
      const response = await api.get('/getAllVendors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addVendor: async (vendorData) => {
    try {
      const response = await api.post('/addVendor', vendorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vendor dashboard endpoints
  getVendorProfile: async () => {
    try {
      const response = await api.get('/api/vendor/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createOrUpdateProfile: async (profileData) => {
    try {
      const response = await api.post('/api/vendor/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createApplication: async () => {
    try {
      const response = await api.post('/api/vendor/application');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitApplication: async (applicationId) => {
    try {
      const response = await api.put(`/api/vendor/application/${applicationId}/submit`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVendorApplications: async () => {
    try {
      const response = await api.get('/api/vendor/applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVendorDashboard: async () => {
    try {
      const response = await api.get('/api/vendor/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default vendorService;