import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator: 10.0.2.2:5000
// For iOS simulator: localhost:5000
// For physical device: Your computer IP:5000
const API_BASE_URL = Platform.select({
  ios: 'http://localhost:5000',
  android: 'http://192.168.1.10:5000',
  default: 'http://localhost:5000'
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data ? { ...config.data, password: config.data.password ? '***' : undefined } : undefined
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear stored auth data
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      // You might want to redirect to login screen here
      // For now, we'll just reject
    }
    
    return Promise.reject(error);
  }
);

// Test connection
export const testConnection = async () => {
  try {
    const response = await api.get('/api/health');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
        details: error.response?.data
      };
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
        details: error.response?.data
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile'
      };
    }
  },

  // Logout (client-side only for JWT)
  logout: async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData', 'userStats']);
    return { success: true };
  }
};

// User API
export const userAPI = {
  // Update user profile
  updateProfile: async (userId, data) => {
    try {
      const response = await api.put(`/api/users/profile/${userId}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Update failed'
      };
    }
  },

  // Get user friends
  getFriends: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/friends`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get friends'
      };
    }
  }
};

// Mantra API
export const mantraAPI = {
  // Get all mantras
  getAllMantras: async (params = {}) => {
    try {
      const response = await api.get('/api/mantras', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get mantras'
      };
    }
  },

  // Get popular mantras
  getPopularMantras: async () => {
    try {
      const response = await api.get('/api/mantras/popular');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get popular mantras'
      };
    }
  },

  // Get mantra by ID
  getMantraById: async (id) => {
    try {
      const response = await api.get(`/api/mantras/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get mantra'
      };
    }
  },

  // Search mantras
  searchMantras: async (query) => {
    try {
      const response = await api.get(`/api/mantras/search/${query}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to search mantras'
      };
    }
  }
};

// Chanting API
// Update the chantingAPI functions in services/api.js:
export const chantingAPI = {
  // Start chanting session - Fixed: No userId parameter needed
  startSession: async (mantraId, sessionType = 'normal') => {
    try {
      const response = await api.post('/api/chanting/start', { mantraId, sessionType });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Start session API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to start session'
      };
    }
  },

  // End chanting session
  endSession: async (sessionId, data) => {
    try {
      const response = await api.post(`/api/chanting/end/${sessionId}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('End session API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to end session'
      };
    }
  },

  // Get chanting history - FIXED: Remove userId parameter
  getHistory: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/chanting/history', {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get history API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get history'
      };
    }
  },

  // Get today's stats - FIXED: Remove userId parameter
  getTodayStats: async () => {
    try {
      const response = await api.get('/api/chanting/today');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get today stats API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get today stats'
      };
    }
  }
};

// Update analyticsAPI too:
export const analyticsAPI = {
  // Get user analytics - FIXED: Remove userId parameter
  getUserAnalytics: async (period = 'all') => {
    try {
      const response = await api.get('/api/analytics', {
        params: { period }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get analytics API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get analytics'
      };
    }
  },

  // Get leaderboard
  getLeaderboard: async (type = 'weekly', limit = 10) => {
    try {
      const response = await api.get('/api/analytics/leaderboard', {
        params: { type, limit }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get leaderboard'
      };
    }
  }
};

export default api;