import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/Colors';

export default function StreakDisplay({ streak = 0, todayChants = 0 }) {
  const hasCompletedToday = todayChants >= 108;
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      day: daysOfWeek[date.getDay()],
      completed: i === 0 ? hasCompletedToday : Math.random() > 0.3, // Mock data
    };
  }).reverse();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Streak</Text>
        <Ionicons name="flame" size={20} color={colors.warning} />
        <Text style={styles.streakCount}>{streak} days</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {hasCompletedToday 
          ? `🎉 You've completed your daily goal of 108 chants!`
          : `🔔 ${108 - todayChants} more chants to maintain your streak`
        }
      </Text>
      
      <View style={styles.weekContainer}>
        {last7Days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View 
              style={[
                styles.dayCircle,
                day.completed && styles.dayCircleActive
              ]}
            />
            <Text style={styles.dayText}>{day.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginRight: 'auto',
  },
  streakCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warning,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    marginBottom: 5,
  },
  dayCircleActive: {
    backgroundColor: colors.success,
  },
  dayText: {
    fontSize: 12,
    color: colors.gray,
  },
});