import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../Context/AuthContext";
import { chantingAPI, mantraAPI } from "../../services/api";
import { colors } from "../../constants/Colors";
import StreakDisplay from "../../components/streak/StreakDisplay";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { user, todayStats, userStats, loadTodayStats } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [recentMantras, setRecentMantras] = useState([]);
  const [popularMantras, setPopularMantras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Load popular mantras
      const mantraResult = await mantraAPI.getPopularMantras();
      if (mantraResult.success) {
        setPopularMantras(mantraResult.data.data || []);
      }

      // Load recent chanting history - FIXED: Remove userId parameter
      const historyResult = await chantingAPI.getHistory(1, 5);
      if (historyResult.success) {
        setRecentMantras(historyResult.data.data.sessions || []);
      }
      
      console.log('✅ Dashboard data loaded');
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      if (user) {
        await loadTodayStats(); // FIXED: Remove userId parameter
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Refresh error:", error);
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
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Fix for the Ionicons warning - use valid icon names
  const getValidIcon = (iconName) => {
    const iconMap = {
      'quote': 'chatbubble',
      'stats-chart': 'stats-chart-outline',
      'trophy': 'trophy-outline',
      'play-circle': 'play-circle-outline',
      'book': 'book-outline',
      'time-outline': 'time-outline',
      'trending-up': 'trending-up-outline',
      'repeat': 'repeat-outline'
    };
    return iconMap[iconName] || iconName;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <LinearGradient
        colors={[colors.primary, "#6B46C1"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(" ")[0] || "Devotee"}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </LinearGradient>

      <StreakDisplay streak={userStats.streak} todayChants={todayStats.count} />

      {/* Today's Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Goal</Text>
            <Text style={styles.progressCount}>
              {todayStats.count}/{userStats.dailyGoal}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    100,
                    (todayStats.count / userStats.dailyGoal) * 100
                  )}%`,
                },
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
            icon={getValidIcon("play-circle")}
            title="Start Chanting"
            color={colors.primary}
            onPress={() => router.push("/(tabs)/chant")}
          />
          <QuickAction
            icon={getValidIcon("book")}
            title="Browse Mantras"
            color={colors.success}
            onPress={() => router.push("/(tabs)/mantras")}
          />
          <QuickAction
            icon={getValidIcon("stats-chart")}
            title="Analytics"
            color={colors.warning}
            onPress={() => router.push("/(tabs)/analytics")}
          />
          <QuickAction
            icon={getValidIcon("trophy")}
            title="Achievements"
            color={colors.info}
            onPress={() => router.push("/(tabs)/profile")}
          />
        </View>
      </View>

      {/* Popular Mantras */}
      {popularMantras.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Mantras</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/mantras")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMantras.slice(0, 5).map((mantra) => (
              <TouchableOpacity
                key={mantra._id || mantra.id}
                style={styles.mantraCard}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/chant",
                    params: { mantraId: mantra._id || mantra.id },
                  })
                }
              >
                <View style={styles.mantraCardContent}>
                  <Text style={styles.mantraName}>{mantra.name}</Text>
                  <Text style={styles.mantraSanskrit}>
                    {mantra.sanskritText}
                  </Text>
                  <Text style={styles.mantraDescription} numberOfLines={2}>
                    {mantra.description}
                  </Text>
                  <View style={styles.mantraStats}>
                    <View style={styles.mantraStat}>
                      <Ionicons
                        name={getValidIcon("time-outline")}
                        size={14}
                        color={colors.gray}
                      />
                      <Text style={styles.mantraStatText}>
                        {mantra.duration}s
                      </Text>
                    </View>
                    <View style={styles.mantraStat}>
                      <Ionicons
                        name={getValidIcon("trending-up")}
                        size={14}
                        color={colors.gray}
                      />
                      <Text style={styles.mantraStatText}>
                        {mantra.popularityScore || 0}%
                      </Text>
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
                    {session.mantraId?.name || "Unknown Mantra"}
                  </Text>
                  <Text style={styles.activityDetails}>
                    {session.count} chants • {Math.floor(session.duration / 60)}
                    m {session.duration % 60}s
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.repeatButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/chant",
                      params: {
                        mantraId: session.mantraId?._id || session.mantraId,
                      },
                    })
                  }
                >
                  <Ionicons name={getValidIcon("repeat")} size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Daily Quote */}
      <View style={styles.section}>
        <View style={styles.quoteCard}>
          <Ionicons name={getValidIcon("quote")} size={24} color={colors.primary} />
          <Text style={styles.quoteText}>
            "The repetition of the divine name is the best medicine for the
            disease of the mind."
          </Text>
          <Text style={styles.quoteAuthor}>- Ramana Maharshi</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles remain the same...
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
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: "600",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.darkGray,
  },
  progressCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.darkGray,
    textAlign: "center",
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
    fontWeight: "bold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  mantraStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  mantraStatText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightestGray,
  },
  activityInfo: {
    flex: 1,
  },
  activityMantra: {
    fontSize: 16,
    fontWeight: "600",
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
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: colors.darkGray,
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: "600",
  },
});