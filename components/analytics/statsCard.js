import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/Colors";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = colors.primary,
}) {

  const styles = StyleSheet.create({
    container: {
      borderRadius: 15,
      overflow: "hidden",
      marginBottom: 15,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    gradient: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      color: colors.white,
      opacity: 0.9,
      marginBottom: 5,
    },
    value: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.white,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 12,
      color: colors.white,
      opacity: 0.8,
    },
    iconContainer: {
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, `${color}80`]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </LinearGradient>
    </View>
  );
}
