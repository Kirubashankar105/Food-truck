import api from './api';

const adminService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllVendors: async () => {
    try {
      const response = await api.get('/api/admin/vendors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVendorsByRegion: async (region) => {
    try {
      const response = await api.get(`/api/admin/vendors/region/${region}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllApplications: async () => {
    try {
      const response = await api.get('/api/admin/applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getApplicationsByStatus: async (status) => {
    try {
      const response = await api.get(`/api/admin/applications/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;