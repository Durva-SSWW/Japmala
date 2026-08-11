# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

Adding this in for first commit





//----
now let's do further screens of users - 

let's do step by step okay - 

first let's focus on dashboard - where we are showing real progreess of our user ...i want everything from abckend integration properly - 

this is frontend code of Japmala/app/(tabs)/dashboard.js

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../Context/AuthContext';
import { chantingAPI, mantraAPI } from '../../services/api';
import StatsCard from '../../components/analytics/StatsCard';
import { colors } from '../../constants/Colors';


const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, todayStats, userStats, loadTodayStats } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [recentMantras, setRecentMantras] = useState([]);
  const [popularMantras, setPopularMantras] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Load popular mantras
      const mantraResult = await mantraAPI.getPopularMantras();
      if (mantraResult.success) {
        setPopularMantras(mantraResult.data.data || []);
      }

      // Load recent chanting history
      const historyResult = await chantingAPI.getHistory(user.id, 1, 5);
      if (historyResult.success) {
        setRecentMantras(historyResult.data.data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      if (user) {
        await loadTodayStats(user.id);
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const QuickAction = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <LinearGradient colors={[colors.primary, '#6B46C1']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Devotee'}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </LinearGradient>

      {/* Today's Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Goal</Text>
            <Text style={styles.progressCount}>{todayStats.count}/{userStats.dailyGoal}</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, (todayStats.count / userStats.dailyGoal) * 100)}%` 
                }
              ]} 
            />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak 🔥</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.totalChants}</Text>
              <Text style={styles.statLabel}>Total Chants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{todayStats.sessions || 0}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickAction 
            icon="play-circle" 
            title="Start Chanting" 
            color={colors.primary}
            onPress={() => router.push('/(tabs)/chant')}
          />
          <QuickAction 
            icon="book" 
            title="Browse Mantras" 
            color={colors.success}
            onPress={() => router.push('/(tabs)/mantras')}
          />
          <QuickAction 
            icon="stats-chart" 
            title="Analytics" 
            color={colors.warning}
            onPress={() => router.push('/(tabs)/analytics')}
          />
          <QuickAction 
            icon="trophy" 
            title="Achievements" 
            color={colors.info}
            onPress={() => router.push('/(tabs)/profile')}
          />
        </View>
      </View>

      {/* Popular Mantras */}
      {popularMantras.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Mantras</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/mantras')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMantras.slice(0, 5).map((mantra) => (
              <TouchableOpacity 
                key={mantra._id || mantra.id}
                style={styles.mantraCard}
                onPress={() => router.push({
                  pathname: '/(tabs)/chant',
                  params: { mantraId: mantra._id || mantra.id }
                })}
              >
                <View style={styles.mantraCardContent}>
                  <Text style={styles.mantraName}>{mantra.name}</Text>
                  <Text style={styles.mantraSanskrit}>{mantra.sanskritText}</Text>
                  <Text style={styles.mantraDescription} numberOfLines={2}>
                    {mantra.description}
                  </Text>
                  <View style={styles.mantraStats}>
                    <View style={styles.mantraStat}>
                      <Ionicons name="time-outline" size={14} color={colors.gray} />
                      <Text style={styles.mantraStatText}>{mantra.duration}s</Text>
                    </View>
                    <View style={styles.mantraStat}>
                      <Ionicons name="trending-up" size={14} color={colors.gray} />
                      <Text style={styles.mantraStatText}>{mantra.popularityScore}%</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Activity */}
      {recentMantras.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityCard}>
            {recentMantras.map((session, index) => (
              <View key={session._id || index} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityMantra}>
                    {session.mantraId?.name || 'Unknown Mantra'}
                  </Text>
                  <Text style={styles.activityDetails}>
                    {session.count} chants • {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.repeatButton}
                  onPress={() => router.push({
                    pathname: '/(tabs)/chant',
                    params: { mantraId: session.mantraId?._id || session.mantraId }
                  })}
                >
                  <Ionicons name="repeat" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Daily Quote */}
      <View style={styles.section}>
        <View style={styles.quoteCard}>
          <Ionicons name="quote" size={24} color={colors.primary} />
          <Text style={styles.quoteText}>
            "The repetition of the divine name is the best medicine for the disease of the mind."
          </Text>
          <Text style={styles.quoteAuthor}>- Ramana Maharshi</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: colors.lightText,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
  },
  progressCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
  },
  mantraCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mantraCardContent: {
    flex: 1,
  },
  mantraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  mantraSanskrit: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 8,
  },
  mantraDescription: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 10,
    lineHeight: 16,
  },
  mantraStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  mantraStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mantraStatText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightestGray,
  },
  activityInfo: {
    flex: 1,
  },
  activityMantra: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.gray,
  },
  repeatButton: {
    padding: 8,
    backgroundColor: colors.lightestGray,
    borderRadius: 8,
  },
  quoteCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.darkGray,
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
});

this is Japmala/service/api.js 

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator: 10.0.2.2:5000
// For iOS simulator: localhost:5000
// For physical device: Your computer IP:5000
const API_BASE_URL = Platform.select({
  ios: 'http://localhost:5000',
  android: 'http://10.112.184.172:5000',
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
export const chantingAPI = {
  // Start chanting session
  startSession: async (userId, mantraId, sessionType = 'normal') => {
    try {
      const response = await api.post('/api/chanting/start', { userId, mantraId, sessionType });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
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
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to end session'
      };
    }
  },

  // Get chanting history
  getHistory: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/chanting/history/${userId}`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get history'
      };
    }
  },

  // Get today's stats
  getTodayStats: async (userId) => {
    try {
      const response = await api.get(`/api/chanting/today/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get today stats'
      };
    }
  }
};

// Analytics API
export const analyticsAPI = {
  // Get user analytics
  getUserAnalytics: async (userId, period = 'all') => {
    try {
      const response = await api.get(`/api/analytics/${userId}`, {
        params: { period }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
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



this is backend/src/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'mr']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  settings: {
    notifications: { 
      type: Boolean, 
      default: true 
    },
    dailyGoal: { 
      type: Number, 
      default: 108,
      min: [1, 'Daily goal must be at least 1'],
      max: [1000, 'Daily goal cannot exceed 1000']
    },
    japamalaType: { 
      type: String, 
      default: 'rudraksh',
      enum: ['rudraksh', 'tulsi', 'chandan', 'crystal', 'kamalbij', 'karungali']
    },
    reminderTime: { 
      type: String, 
      default: '07:00',
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    }
  },
  streak: {
    current: { 
      type: Number, 
      default: 0 
    },
    longest: { 
      type: Number, 
      default: 0 
    },
    lastChanted: { 
      type: Date 
    }
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
   // Password reset fields
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  
  // Security fields
  passwordChangedAt: {
    type: Date
  },
  passwordResetAt: {
    type: Date
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};


// Add reset token method
userSchema.methods.createPasswordResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and save to database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Set expiry (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Add password changed timestamp
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

module.exports = mongoose.model('User', userSchema);


this is backend/src/UserAnalytics.js

const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  totalCount: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  mantras: [{
    mantraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mantra'
    },
    count: {
      type: Number,
      default: 0
    }
  }]
});

const weeklyStatSchema = new mongoose.Schema({
  weekStart: {
    type: Date,
    required: true
  },
  totalCount: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  averageDailyCount: {
    type: Number,
    default: 0
  }
});

const favoriteMantraSchema = new mongoose.Schema({
  mantraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mantra',
    required: true
  },
  totalCount: {
    type: Number,
    default: 0
  },
  lastChanted: {
    type: Date,
    default: Date.now
  }
});

const achievementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['streak', 'count', 'duration', 'special', 'challenge'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  icon: {
    type: String,
    default: '🏆'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  }
});

const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalChants: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  dailyStats: [dailyStatSchema],
  weeklyStats: [weeklyStatSchema],
  favoriteMantras: [favoriteMantraSchema],
  achievements: [achievementSchema],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  averageDailyCount: {
    type: Number,
    default: 0
  },
  bestDay: {
    date: Date,
    count: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ 'dailyStats.date': -1 });

// Update lastUpdated on save
userAnalyticsSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);

this is backend/src/routes/analytics.js

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/leaderboard', analyticsController.getLeaderboard);

// Protected routes
router.use(protect);
router.get('/:userId', analyticsController.getUserAnalytics);
router.get('/:userId/streak-calendar', analyticsController.getStreakCalendar);

module.exports = router;

