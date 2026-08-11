import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../Context/AuthContext';
import StatsCard from '../../components/analytics/statsCard';
import { colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { userStats, todayStats } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [65, 78, 66, 95, 82, 108, 72]
    }]
  });

  const pieData = [
    { name: 'Peace', population: 45, color: colors.primary, legendFontColor: colors.dark },
    { name: 'Health', population: 25, color: colors.success, legendFontColor: colors.dark },
    { name: 'Knowledge', population: 20, color: colors.info, legendFontColor: colors.dark },
    { name: 'Prosperity', population: 10, color: colors.warning, legendFontColor: colors.dark },
  ];

  const achievements = [
    { id: 1, name: '7-Day Streak', icon: '🔥', earned: true },
    { id: 2, name: '108 Chants', icon: '📿', earned: true },
    { id: 3, name: 'Early Bird', icon: '🌅', earned: false },
    { id: 4, name: 'Consistency', icon: '📅', earned: true },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your spiritual journey</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        {['day', 'week', 'month', 'year'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text style={[
              styles.timeRangeText,
              timeRange === range && styles.timeRangeTextActive
            ]}>
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <StatsCard
          title="Current Streak"
          value={userStats.streak}
          subtitle="days"
          color={colors.primary}
        />
        <StatsCard
          title="Today's Chants"
          value={todayStats.count}
          subtitle="count"
          color={colors.success}
        />
        <StatsCard
          title="Total Time"
          value={`${Math.floor(todayStats.duration / 60)}m`}
          subtitle="today"
          color={colors.warning}
        />
        <StatsCard
          title="Total Chants"
          value={userStats.totalChants}
          subtitle="lifetime"
          color={colors.info}
        />
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: colors.white,
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.darkGray,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.primary
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Mantra Distribution */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Mantra Distribution</Text>
        <PieChart
          data={pieData}
          width={width - 40}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.earned && styles.achievementCardLocked
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <View style={[
                styles.achievementStatus,
                achievement.earned ? styles.achievementEarned : styles.achievementLocked
              ]}>
                <Ionicons
                  name={achievement.earned ? "checkmark-circle" : "lock-closed"}
                  size={16}
                  color={achievement.earned ? colors.success : colors.gray}
                />
                <Text style={[
                  styles.achievementStatusText,
                  { color: achievement.earned ? colors.success : colors.gray }
                ]}>
                  {achievement.earned ? 'Earned' : 'Locked'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <Ionicons name="bulb" size={24} color={colors.warning} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Best Time to Chant</Text>
            <Text style={styles.insightText}>
              You're most consistent at 7:00 AM. Try maintaining this schedule!
            </Text>
          </View>
        </View>
        <View style={styles.insightCard}>
          <Ionicons name="trending-up" size={24} color={colors.success} />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Progress Trend</Text>
            <Text style={styles.insightText}>
              Your daily average increased by 15% this week. Keep it up!
            </Text>
          </View>
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
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.dark,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 5,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.white,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
  },
  timeRangeTextActive: {
    color: colors.white,
  },
  statsGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  chartSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementCardLocked: {
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
    textAlign: 'center',
  },
  achievementStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementEarned: {
    // Styles for earned
  },
  achievementLocked: {
    // Styles for locked
  },
  achievementStatusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightContent: {
    flex: 1,
    marginLeft: 15,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 5,
  },
  insightText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
});