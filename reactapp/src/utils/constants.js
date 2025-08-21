export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  VENDOR: 'ROLE_VENDOR',
  USER: 'ROLE_USER'
};

export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  INSPECTION_SCHEDULED: 'INSPECTION_SCHEDULED',
  INSPECTION_COMPLETED: 'INSPECTION_COMPLETED',
  LICENSED: 'LICENSED'
};

export const REGIONS = ['Chennai', 'Bangalore'];

export const STATUS_COLORS = {
  [APPLICATION_STATUS.DRAFT]: '#6c757d',
  [APPLICATION_STATUS.SUBMITTED]: '#007bff',
  [APPLICATION_STATUS.UNDER_REVIEW]: '#ffc107',
  [APPLICATION_STATUS.APPROVED]: '#28a745',
  [APPLICATION_STATUS.REJECTED]: '#dc3545',
  [APPLICATION_STATUS.INSPECTION_SCHEDULED]: '#17a2b8',
  [APPLICATION_STATUS.INSPECTION_COMPLETED]: '#6f42c1',
  [APPLICATION_STATUS.LICENSED]: '#20c997'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY: '/api/auth/verify',
    PROFILE: '/api/auth/profile'
  },
  VENDOR: {
    PROFILE: '/api/vendor/profile',
    APPLICATION: '/api/vendor/application',
    APPLICATIONS: '/api/vendor/applications',
    DASHBOARD: '/api/vendor/dashboard'
  },
  ADMIN: {
    VENDORS: '/api/admin/vendors',
    APPLICATIONS: '/api/admin/applications',
    DASHBOARD: '/api/admin/dashboard'
  },
  PUBLIC: {
    ALL_VENDORS: '/getAllVendors',
    ADD_VENDOR: '/addVendor'
  }
};