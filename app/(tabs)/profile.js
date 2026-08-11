import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../Context/AuthContext';
import { colors } from '../../constants/Colors';

export default function ProfileScreen() {
  const { user, userStats, logout, updateUser } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { icon: 'person', title: 'Edit Profile', onPress: () => {} },
    { icon: 'settings', title: 'App Settings', onPress: () => {} },
    { icon: 'notifications', title: 'Notifications', onPress: () => {} },
    { icon: 'language', title: 'Language', value: 'English', onPress: () => {} },
    { icon: 'color-palette', title: 'Theme', onPress: () => {} },
    { icon: 'people', title: 'Friends', onPress: () => {} },
    { icon: 'trophy', title: 'Achievements', onPress: () => {} },
    { icon: 'help-circle', title: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle', title: 'About App', onPress: () => {} },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.username}>@{user?.username || 'username'}</Text>
            <Text style={styles.email}>{user?.email || 'user@email.com'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalChants}</Text>
            <Text style={styles.statLabel}>Total Chants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.dailyGoal}</Text>
            <Text style={styles.statLabel}>Daily Goal</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="stats-chart" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="share-social" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="download" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="trophy" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Achievements</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Notification Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color={colors.darkGray} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
          />
        </View>

        {/* Dark Mode Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={22} color={colors.darkGray} />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.lightGray, true: colors.primary }}
          />
        </View>

        {/* Daily Goal Setting */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="flag" size={22} color={colors.darkGray} />
            <View>
              <Text style={styles.settingText}>Daily Goal</Text>
              <Text style={styles.settingSubtext}>{userStats.dailyGoal} chants per day</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
        </TouchableOpacity>

        {/* Japamala Type */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="rose" size={22} color={colors.darkGray} />
            <View>
              <Text style={styles.settingText}>Japamala Type</Text>
              <Text style={styles.settingSubtext}>Rudraksh (Default)</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.slice(4).map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color={colors.darkGray} />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <View style={styles.menuRight}>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={22} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>Japamala v1.0.0</Text>
        <Text style={styles.appTagline}>Your Digital Spiritual Companion</Text>
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
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightestGray,
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 5,
  },
  settingsSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightestGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 15,
  },
  settingSubtext: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 15,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: colors.dark,
    marginLeft: 15,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  appName: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 5,
  },
  appTagline: {
    fontSize: 12,
    color: colors.lightGray,
  },
});