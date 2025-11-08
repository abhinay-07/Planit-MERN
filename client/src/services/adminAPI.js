import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

// Admin API service
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const api = createAuthAxios();
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Students Management
  getStudents: async (params = {}) => {
    const api = createAuthAxios();
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  verifyStudent: async (studentId, status, reason = '') => {
    const api = createAuthAxios();
    const response = await api.put(`/admin/students/${studentId}/verify`, {
      status,
      reason
    });
    return response.data;
  },

  // Business Management
  getBusinesses: async (params = {}) => {
    const api = createAuthAxios();
    const response = await api.get('/admin/businesses', { params });
    return response.data;
  },

  verifyBusiness: async (businessId, status, reason = '') => {
    const api = createAuthAxios();
    const response = await api.put(`/admin/businesses/${businessId}/verify`, {
      status,
      reason
    });
    return response.data;
  },

  // Places Management
  getPlaces: async (params = {}) => {
    const api = createAuthAxios();
    const response = await api.get('/admin/places', { params });
    return response.data;
  },

  createPlace: async (placeData) => {
    const api = createAuthAxios();
    const response = await api.post('/admin/places', placeData);
    return response.data;
  },

  updatePlace: async (placeId, placeData) => {
    const api = createAuthAxios();
    const response = await api.put(`/admin/places/${placeId}`, placeData);
    return response.data;
  },

  deletePlace: async (placeId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/admin/places/${placeId}`);
    return response.data;
  },

  // Vehicles Management
  getVehicles: async (params = {}) => {
    const api = createAuthAxios();
    const response = await api.get('/admin/vehicles', { params });
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const api = createAuthAxios();
    const response = await api.post('/admin/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    const api = createAuthAxios();
    const response = await api.put(`/admin/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (vehicleId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/admin/vehicles/${vehicleId}`);
    return response.data;
  },

  // Reviews Management
  getReviews: async (params = {}) => {
    const api = createAuthAxios();
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },

  moderateReview: async (reviewId, action, reason = '') => {
    const api = createAuthAxios();
    const response = await api.put(`/admin/reviews/${reviewId}/moderate`, {
      action,
      reason
    });
    return response.data;
  },

  // Recent Activity
  getRecentActivity: async () => {
    const api = createAuthAxios();
    const response = await api.get('/admin/recent-activity');
    return response.data;
  },

  // Analytics & Reports
  getAnalytics: async () => {
    const api = createAuthAxios();
    const response = await api.get('/admin/reports/analytics');
    return response.data;
  }
};

export default adminAPI;