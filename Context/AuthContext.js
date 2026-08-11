import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, chantingAPI } from "../services/api";
import { router } from "expo-router";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    count: 0,
    duration: 0,
    sessions: 0,
  });
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalChants: 0,
    dailyGoal: 108,
    totalDuration: 0,
  });

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

 const checkAuthStatus = async () => {
  try {
    console.log('🔍 Checking authentication status...');
    
    const [token, userData] = await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('userData')
    ]);
    
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userData);
    
    if (token && userData) {
      // Validate token by making API call
      try {
        // Try to get user profile to validate token
        const profileResult = await authAPI.getProfile();
        if (profileResult.success) {
          const parsedUser = profileResult.data.data.user || profileResult.data.data;
          setUser(parsedUser);
          setIsLoggedIn(true);
          
          // Update stored user data with latest from server
          await AsyncStorage.setItem('userData', JSON.stringify(parsedUser));
          
          // Load today's stats
          loadTodayStats(); // Fixed: No parameter needed
          
          console.log('✅ User authenticated and profile loaded');
        } else {
          console.log('❌ Profile validation failed:', profileResult.error);
          await logout();
        }
      } catch (error) {
        console.log('❌ Token validation failed:', error);
        await logout();
      }
    } else {
      console.log('ℹ️ No stored auth data found');
    }
  } catch (error) {
    console.error('❌ Error checking auth status:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Update the loadTodayStats function in AuthContext.js:
const loadTodayStats = async (userId) => {
  try {
    // Changed: Remove userId parameter, API now uses JWT token
    const result = await chantingAPI.getTodayStats();
    if (result.success) {
      setTodayStats(result.data);
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        streak: result.data.streak || 0,
        totalChants: result.data.totalCount || 0,
        totalDuration: result.data.totalDuration || 0
      }));
      
      console.log('✅ Today stats loaded:', result.data);
    } else {
      console.error('Failed to load today stats:', result.error);
    }
  } catch (error) {
    console.error('Failed to load today stats:', error);
  }
};

  // Register new user
  const register = async (userData) => {
    try {
      console.log("📝 Registering user:", userData);

      // const result = await authAPI.register(userData);

      // To this (add destructuring):
      const result = await authAPI.register({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
      });

      if (result.success) {
        // Save token and user data
        await AsyncStorage.setItem("userToken", result.data.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(result.data.data.user)
        );

        // Set auth state
        setUser(result.data.data.user);
        setIsLoggedIn(true);

        console.log("✅ Registration successful");
        return { success: true, message: "Registration successful!" };
      } else {
        console.log("❌ Registration failed:", result.error);
        return {
          success: false,
          error: result.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  // Login user
  const login = async (username, password) => {
    try {
      console.log("🔑 Attempting login for:", username);

      const result = await authAPI.login(username, password);

      if (result.success) {
        // Save token and user data
        await AsyncStorage.setItem("userToken", result.data.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(result.data.data.user)
        );

        // Set auth state
        setUser(result.data.data.user);
        setIsLoggedIn(true);

        // Load today's stats
        loadTodayStats(result.data.data.user.id);

        console.log("✅ Login successful");
        return { success: true, message: "Login successful!" };
      } else {
        console.log("❌ Login failed:", result.error);
        return {
          success: false,
          error: result.error || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        error: "Network error. Please check your connection.",
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      console.log("👋 Logging out...");

      // Clear all stored data
      await AsyncStorage.multiRemove([
        "userToken",
        "userData",
        "userStats",
        "hasSeenOnboarding",
      ]);

      // Reset state
      setIsLoggedIn(false);
      setUser(null);
      setTodayStats({ count: 0, duration: 0, sessions: 0 });
      setUserStats({
        streak: 0,
        totalChants: 0,
        dailyGoal: 108,
        totalDuration: 0,
      });

      // Redirect to login
      router.replace("/(auth)/login");

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  // Update user data
  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  // Update today's chanting stats
  const updateTodayStats = async (count, duration) => {
    try {
      const newStats = {
        count: todayStats.count + count,
        duration: todayStats.duration + duration,
        sessions: todayStats.sessions + 1,
      };

      setTodayStats(newStats);

      // Also update total stats
      setUserStats((prev) => ({
        ...prev,
        totalChants: prev.totalChants + count,
        totalDuration: prev.totalDuration + duration,
      }));

      // If this is first chant today, update streak
      if (todayStats.count === 0) {
        setUserStats((prev) => ({
          ...prev,
          streak: prev.streak + 1,
        }));
      }
    } catch (error) {
      console.error("Update stats error:", error);
    }
  };

  // Save chanting session
  // Update the saveChantingSession function:
  // Update the saveChantingSession function in AuthContext.js:
  const saveChantingSession = async (
    mantraId,
    count,
    duration,
    japamalaType = "rudraksh",
    mood = "neutral"
  ) => {
    try {
      if (!user) {
        console.error("❌ User not logged in, cannot save session");
        throw new Error("User not logged in");
      }

      console.log("🎯 Starting chanting session...", {
        userId: user._id || user.id,
        mantraId,
        count,
        duration,
        japamalaType,
        mood,
      });

      // Start session - Fixed: Remove userId from body (it should come from token)
      const startResult = await chantingAPI.startSession(mantraId);

      if (!startResult.success) {
        console.error("❌ Failed to start session:", startResult.error);
        throw new Error(startResult.error || "Failed to start session");
      }

      console.log("✅ Session started:", startResult.data);

      // End session with proper data structure
      const sessionId =
        startResult.data.data.sessionId || startResult.data.sessionId;
      const endResult = await chantingAPI.endSession(sessionId, {
        count: parseInt(count),
        duration: parseInt(duration),
        japamalaType,
        mood,
      });

      if (endResult.success) {
        console.log("✅ Session saved to backend:", endResult.data);

        // Update local stats
        updateTodayStats(count, duration);

        // Check if user maintained streak (at least 108 chants)
        if (count >= 108) {
          console.log(
            `🎉 User chanted ${count} times (>=108), streak maintained/updated`
          );
        } else {
          console.log(
            `⚠️ User chanted ${count} times (<108), streak not updated`
          );
        }

        return {
          success: true,
          message: "Session saved successfully",
          session: endResult.data.data || endResult.data,
        };
      } else {
        console.error("❌ Failed to end session:", endResult.error);
        throw new Error(endResult.error || "Failed to save session");
      }
    } catch (error) {
      console.error("❌ Save session error:", error);
      return {
        success: false,
        error: error.message || "Failed to save chanting session",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        todayStats,
        userStats,
        register,
        login,
        logout,
        updateUser,
        updateTodayStats,
        saveChantingSession,
        loadTodayStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
