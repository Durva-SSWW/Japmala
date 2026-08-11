// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { colors } from "../../constants/Colors";

// export default function MantraCard({ mantra, onPress }) {
//   // Format duration for display
//   const formatDuration = (seconds) => {
//     if (seconds < 60) return `${seconds}s`;
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}m ${remainingSeconds}s`;
//   };

//   // Get category display name
//   const getCategoryDisplay = (category) => {
//     const categoryMap = {
//       peace: "Peace",
//       health: "Health",
//       prosperity: "Prosperity",
//       protection: "Protection",
//       knowledge: "Knowledge",
//       love: "Love",
//       general: "General",
//     };
//     return categoryMap[category] || category;
//   };

//   // Get category color
//   const getCategoryColor = (category) => {
//     switch (category) {
//       case "peace":
//         return colors.primary;
//       case "health":
//         return colors.success;
//       case "prosperity":
//         return colors.warning;
//       case "knowledge":
//         return colors.info;
//       case "love":
//         return colors.danger;
//       case "protection":
//         return colors.purple;
//       case "general":
//         return colors.gray;
//       default:
//         return colors.gray;
//     }
//   };

//   // Get first few benefits for display
//   const getBenefitsPreview = (benefits = []) => {
//     if (!benefits.length) return "";
//     const firstBenefit = benefits[0];
//     return firstBenefit.length > 50
//       ? firstBenefit.substring(0, 50) + "..."
//       : firstBenefit;
//   };

//   return (
//     <TouchableOpacity style={styles.container} onPress={onPress}>
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <View style={styles.titleContainer}>
//             <Text style={styles.name} numberOfLines={1}>
//               {mantra.name}
//             </Text>

//             <View
//               style={[
//                 styles.category,
//                 { backgroundColor: getCategoryColor(mantra.category) },
//               ]}
//             >
//               <Text style={styles.categoryText}>
//                 {getCategoryDisplay(mantra.category)}
//               </Text>
//             </View>
//           </View>

//           {mantra.forBeginners && (
//             <View style={styles.beginnerBadge}>
//               <Text style={styles.beginnerText}>Beginner</Text>
//             </View>
//           )}
//         </View>

//         <Text style={styles.sanskrit} numberOfLines={1}>
//           {mantra.sanskritText}
//         </Text>

//         {mantra.description && (
//           <Text style={styles.description} numberOfLines={2}>
//             {mantra.description}
//           </Text>
//         )}

//         {mantra.benefits && mantra.benefits.length > 0 && (
//           <Text style={styles.benefits} numberOfLines={1}>
//             <Text style={styles.benefitsLabel}>Benefit: </Text>
//             {getBenefitsPreview(mantra.benefits)}
//           </Text>
//         )}

//     <View style={styles.footer}>
//       <View style={{ flexDirection: "row", flex: 1 }}>
//         <View style={styles.duration}>
//           <Ionicons name="time-outline" size={16} color={colors.gray} />
//           <Text style={styles.durationText}>
//             {formatDuration(mantra.duration || 5)}
//           </Text>
//         </View>

//         <View style={styles.deityContainer}>
//           {mantra.associatedDeity && (
//             <>
//               <Ionicons name="person" size={14} color={colors.gray} />
//               <Text style={styles.deityText}>{mantra.associatedDeity}</Text>
//             </>
//           )}
//         </View>
//       </View>

//       <View style={styles.popularity}>
//         <Ionicons name="trending-up" size={16} color={colors.gray} />
//         <Text style={styles.popularityText}>
//           {mantra.popularityScore || 0}%
//         </Text>
//       </View>
//     </View>
//   </View>

//   <View style={styles.arrow}>
//     <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
//   </View>
// </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 3,
//     backgroundColor: colors.white,
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   content: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 10,
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: colors.dark,
//     flex: 1,
//     marginRight: 10,
//   },
//   category: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   categoryText: {
//     color: colors.white,
//     fontSize: 10,
//     fontWeight: "600",
//   },
//   beginnerBadge: {
//     backgroundColor: colors.infoLight,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: colors.info,
//     marginLeft: 10,
//   },
//   beginnerText: {
//     fontSize: 10,
//     color: colors.info,
//     fontWeight: "600",
//   },
//   sanskrit: {
//     fontSize: 22,
//     color: colors.primary,
//     marginBottom: 8,
//     fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
//   },
//   description: {
//     fontSize: 14,
//     color: colors.darkGray,
//     marginBottom: 8,
//     lineHeight: 20,
//   },
//   benefits: {
//     fontSize: 13,
//     color: colors.gray,
//     marginBottom: 12,
//     fontStyle: "italic",
//   },
//   benefitsLabel: {
//     fontWeight: "600",
//     color: colors.darkGray,
//   },
//   footer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   duration: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   durationText: {
//     fontSize: 12,
//     color: colors.gray,
//     marginLeft: 4,
//   },
//   deityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: 5,
//   },
//   deityText: {
//     fontSize: 12,
//     color: colors.gray,
//     marginLeft: 4,
//     fontStyle: "italic",
//   },
//   popularity: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   popularityText: {
//     fontSize: 12,
//     color: colors.gray,
//     marginLeft: 4,
//   },
//   arrow: {
//     marginLeft: 10,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/Colors";

export default function MantraCard({ mantra, onPress }) {
  // Format duration for display
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get category display name
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      peace: "Peace",
      health: "Health",
      prosperity: "Prosperity",
      protection: "Protection",
      knowledge: "Knowledge",
      love: "Love",
      general: "General",
    };
    return categoryMap[category] || category;
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "peace":
        return colors.peace || colors.primary;
      case "health":
        return colors.health || colors.success;
      case "prosperity":
        return colors.prosperity || colors.warning;
      case "knowledge":
        return colors.knowledge || colors.info;
      case "love":
        return colors.love || colors.danger;
      case "protection":
        return colors.protection || colors.purple;
      case "general":
        return colors.gray;
      default:
        return colors.gray;
    }
  };

  // Get first few benefits for display
  const getBenefitsPreview = (benefits = []) => {
    if (!benefits.length) return "";
    const firstBenefit = benefits[0];
    return firstBenefit.length > 50
      ? firstBenefit.substring(0, 50) + "..."
      : firstBenefit;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Left: Mantra Name */}
          <View style={styles.leftContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {mantra.name}
            </Text>
          </View>

          {/* Right: Category + Beginner Badge */}
          <View style={styles.rightContainer}>
            <View style={styles.rightBadges}>
              <View
                style={[
                  styles.category,
                  { backgroundColor: getCategoryColor(mantra.category) },
                ]}
              >
                <Text style={styles.categoryText}>
                  {getCategoryDisplay(mantra.category)}
                </Text>
              </View>

              {mantra.forBeginners && (
                <View style={styles.beginnerBadge}>
                  <Text style={styles.beginnerText}>Beginner</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.sanskrit} numberOfLines={1}>
          {mantra.sanskritText}
        </Text>

        {mantra.description && (
          <Text style={styles.description} numberOfLines={2}>
            {mantra.description}
          </Text>
        )}

        {mantra.benefits && mantra.benefits.length > 0 && (
          <Text style={styles.benefits} numberOfLines={1}>
            <Text style={styles.benefitsLabel}>Benefit: </Text>
            {getBenefitsPreview(mantra.benefits)}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={styles.duration}>
              <Ionicons name="time-outline" size={16} color={colors.gray} />
              <Text style={styles.durationText}>
                {formatDuration(mantra.duration || 5)}
              </Text>
            </View>

            <View style={styles.deityContainer}>
              {mantra.associatedDeity && (
                <>
                  <Ionicons name="person" size={14} color={colors.gray} />
                  <Text style={styles.deityText}>{mantra.associatedDeity}</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.popularity}>
            <Ionicons name="trending-up" size={16} color={colors.gray} />
            <Text style={styles.popularityText}>
              {mantra.popularityScore || 0}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal:2,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  rightBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  category: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },
  beginnerBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.info,
  },
  beginnerText: {
    fontSize: 10,
    color: colors.info,
    fontWeight: "600",
  },
  sanskrit: {
    fontSize: 22,
    color: colors.primary,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif",
  },
  description: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
    lineHeight: 20,
  },
  benefits: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 12,
    fontStyle: "italic",
  },
  benefitsLabel: {
    fontWeight: "600",
    color: colors.darkGray,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  duration: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  deityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:5,
  },
  deityText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  popularity: {
    flexDirection: "row",
    alignItems: "center",
  },
  popularityText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 4,
  },
  arrow: {
    marginLeft: 10,
  },
});
