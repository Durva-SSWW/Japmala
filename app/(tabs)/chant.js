// import { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
//   Dimensions,
//   Alert,
//   Vibration,
//   Modal,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useAuth } from '../../Context/AuthContext';
// import { mantraAPI } from '../../services/api';
// import { colors } from '../../constants/Colors';

// const { width, height } = Dimensions.get('window');

// export default function ChantScreen() {
//   const params = useLocalSearchParams();
//   const { user, saveChantingSession, todayStats } = useAuth();
  
//   const [count, setCount] = useState(0);
//   const [time, setTime] = useState(0);
//   const [isActive, setIsActive] = useState(false);
//   const [isPaused, setIsPaused] = useState(true);
//   const [selectedMala, setSelectedMala] = useState('rudraksh');
//   const [currentMantra, setCurrentMantra] = useState(null);
//   const [mood, setMood] = useState('neutral');
//   const [sessionId, setSessionId] = useState(null);
//   const [showCompletionModal, setShowCompletionModal] = useState(false);
//   const [completionMessage, setCompletionMessage] = useState('');
//   const [beads, setBeads] = useState(Array(108).fill(false)); // Track which beads are completed
  
//   // Animation values
//   const scaleValue = useRef(new Animated.Value(1)).current;
//   const timerRef = useRef(null);
//   const startTimeRef = useRef(null);

//   useEffect(() => {
//     if (params.mantraId) {
//       loadMantra(params.mantraId);
//     }
//   }, [params.mantraId]);

//   useEffect(() => {
//     if (isActive && !isPaused) {
//       startTimeRef.current = new Date();
//       timerRef.current = setInterval(() => {
//         setTime((prevTime) => prevTime + 1);
//       }, 1000);
//     } else {
//       clearInterval(timerRef.current);
//     }
//     return () => clearInterval(timerRef.current);
//   }, [isActive, isPaused]);

//   useEffect(() => {
//     // Update beads based on count
//     const newBeads = beads.map((_, index) => index < count % 108);
//     setBeads(newBeads);
//   }, [count]);

//   const loadMantra = async (mantraId) => {
//     try {
//       console.log('📖 Loading mantra:', mantraId);
//       const result = await mantraAPI.getMantraById(mantraId);
//       if (result.success) {
//         setCurrentMantra(result.data.data);
//         console.log('✅ Mantra loaded:', result.data.data.name);
//       } else {
//         console.error('❌ Failed to load mantra:', result.error);
//         Alert.alert('Error', 'Failed to load mantra');
//       }
//     } catch (error) {
//       console.error('❌ Load mantra error:', error);
//       Alert.alert('Error', 'Network error loading mantra');
//     }
//   };

//   const addCount = () => {
//     if (!isActive || isPaused) return;
    
//     const newCount = count + 1;
//     setCount(newCount);
    
//     // Vibration feedback
//     if (newCount % 108 === 0) {
//       Vibration.vibrate([0, 100, 100, 100]); // Mala completion
//     } else {
//       Vibration.vibrate(50); // Regular count
//     }

//     // Pulse animation
//     Animated.sequence([
//       Animated.timing(scaleValue, {
//         toValue: 1.2,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleValue, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const addMultipleCounts = (number) => {
//     if (!isActive || isPaused) return;
    
//     for (let i = 0; i < number; i++) {
//       setTimeout(() => {
//         setCount(prev => prev + 1);
//       }, i * 50);
//     }
//   };

//   const startChanting = async () => {
//     if (!user) {
//       Alert.alert('Login Required', 'Please login to start chanting', [
//         { text: 'Login', onPress: () => router.push('/(auth)/login') },
//         { text: 'Cancel', style: 'cancel' }
//       ]);
//       return;
//     }
    
//     if (!currentMantra) {
//       Alert.alert('Error', 'Please select a mantra first');
//       return;
//     }
    
//     setIsActive(true);
//     setIsPaused(false);
//     setCount(0);
//     setTime(0);
//     setBeads(Array(108).fill(false));
    
//     console.log('▶️ Chanting started for mantra:', currentMantra.name);
//   };

//   const pauseChanting = () => {
//     setIsPaused(!isPaused);
//     console.log(isPaused ? '▶️ Chanting resumed' : '⏸️ Chanting paused');
//   };

//   const resetChanting = () => {
//     Alert.alert(
//       'Reset Session',
//       'Are you sure you want to reset? All progress will be lost.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Reset', 
//           style: 'destructive',
//           onPress: () => {
//             setIsActive(false);
//             setIsPaused(true);
//             setCount(0);
//             setTime(0);
//             setBeads(Array(108).fill(false));
//             setSessionId(null);
//             console.log('🔄 Session reset');
//           }
//         }
//       ]
//     );
//   };

//   const endChanting = async () => {
//     if (count === 0) {
//       Alert.alert('Info', 'No chanting recorded. Please chant at least once.');
//       return;
//     }
    
//     // Calculate actual duration
//     const endTime = new Date();
//     const actualDuration = startTimeRef.current 
//       ? Math.floor((endTime - startTimeRef.current) / 1000)
//       : time;
    
//     try {
//       if (!user) {
//         // Save locally if not logged in
//         Alert.alert(
//           'Session Completed',
//           `You chanted ${count} times for ${formatTime(actualDuration)}\n\nLogin to save your progress and track streaks.`,
//           [
//             { text: 'OK', onPress: resetChanting }
//           ]
//         );
//         return;
//       }
      
//       // Save to backend
//       const result = await saveChantingSession(
//         currentMantra._id || currentMantra.id,
//         count,
//         actualDuration,
//         selectedMala,
//         mood
//       );
      
//       if (result.success) {
//         // Show streak information
//         let streakMessage = '';
//         if (count >= 108) {
//           streakMessage = '\n🎉 You completed a full mala! Your streak is maintained.';
//         } else {
//           streakMessage = '\n⚠️ Complete 108 chants to maintain your daily streak.';
//         }
        
//         // Show completion modal
//         setCompletionMessage(
//           `✅ Session Saved!\n\n` +
//           `Chants: ${count}\n` +
//           `Duration: ${formatTime(actualDuration)}\n` +
//           `Mantra: ${currentMantra.name}\n` +
//           `Today's Total: ${todayStats.count + count} chants` +
//           streakMessage
//         );
//         setShowCompletionModal(true);
        
//         console.log('✅ Session saved successfully');
//       } else {
//         Alert.alert('Error', result.error || 'Failed to save session');
//       }
//     } catch (error) {
//       console.error('❌ End chanting error:', error);
//       Alert.alert('Error', 'Failed to save session');
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Get mala color based on selection
//   const getMalaColor = (malaType) => {
//     const colors = {
//       'rudraksh': '#92400E',
//       'tulsi': '#065F46',
//       'chandan': '#F59E0B',
//       'crystal': '#60A5FA',
//     };
//     return colors[malaType] || '#92400E';
//   };

//   // Get mood color
//   const getMoodColor = (moodType) => {
//     const colors = {
//       'peaceful': '#4A1E8C',
//       'energetic': '#F59E0B',
//       'focused': '#3B82F6',
//       'neutral': '#6B7280',
//       'happy': '#10B981',
//       'anxious': '#EF4444',
//     };
//     return colors[moodType] || '#6B7280';
//   };

//   const malaTypes = [
//     { id: 'rudraksh', name: 'Rudraksh', color: '#92400E', icon: 'leaf' },
//     { id: 'tulsi', name: 'Tulsi', color: '#065F46', icon: 'flower' },
//     { id: 'chandan', name: 'Chandan', color: '#F59E0B', icon: 'water' },
//     { id: 'crystal', name: 'Crystal', color: '#60A5FA', icon: 'diamond' },
//   ];

//   const moods = [
//     { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
//     { id: 'energetic', emoji: '⚡', label: 'Energetic' },
//     { id: 'focused', emoji: '🎯', label: 'Focused' },
//     { id: 'neutral', emoji: '😐', label: 'Neutral' },
//     { id: 'happy', emoji: '😊', label: 'Happy' },
//     { id: 'anxious', emoji: '😰', label: 'Anxious' },
//   ];

//   const malas = Math.floor(count / 108);
//   const remaining = count % 108;
//   const nextMalaCount = 108 - remaining;

//   // Function to render japamala beads
//   const renderBeads = () => {
//     const malaColor = getMalaColor(selectedMala);
    
//     return (
//       <View style={styles.beadsContainer}>
//         <View style={styles.beadsGrid}>
//           {beads.map((isCompleted, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.bead,
//                 {
//                   backgroundColor: isCompleted ? malaColor : '#E5E7EB',
//                   borderColor: malaColor,
//                   borderWidth: isCompleted ? 2 : 1,
//                 }
//               ]}
//             >
//               {/* Every 27th bead is larger (meru bead) */}
//               {index % 27 === 0 && (
//                 <View style={styles.meruDot} />
//               )}
              
//               {/* Current bead indicator */}
//               {index === count % 108 && isActive && !isPaused && (
//                 <View style={styles.currentIndicator} />
//               )}
//             </View>
//           ))}
//         </View>
        
//         {/* Meru bead indicator */}
//         <View style={styles.meruIndicator}>
//           <Ionicons name="star" size={16} color={getMalaColor(selectedMala)} />
//           <Text style={styles.meruText}>Meru Bead (27th, 54th, 81st, 108th)</Text>
//         </View>
//       </View>
//     );
//   };

//   if (!currentMantra) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading mantra...</Text>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <Ionicons name="arrow-back" size={24} color={colors.white} />
//           <Text style={styles.backButtonText}>Back to Mantras</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <LinearGradient
//       colors={[colors.background, '#E8E4D9']}
//       style={styles.container}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header with Mantra Info */}
//         <View style={styles.header}>
//           <TouchableOpacity 
//             style={styles.backButtonHeader}
//             onPress={() => router.back()}
//           >
//             <Ionicons name="arrow-back" size={24} color={colors.dark} />
//           </TouchableOpacity>
          
//           <View style={styles.mantraInfo}>
//             <Text style={styles.mantraTitle}>{currentMantra.name}</Text>
//             <Text style={styles.mantraSanskrit}>{currentMantra.sanskritText}</Text>
//           </View>
          
//           <View style={styles.streakInfo}>
//             <Text style={styles.streakLabel}>Today</Text>
//             <Text style={styles.streakValue}>{todayStats.count}</Text>
//             <Text style={styles.streakLabel}>chants</Text>
//           </View>
//         </View>

//         {/* Japamala Beads Visualization */}
//         <View style={styles.visualizationContainer}>
//           <Text style={styles.visualizationTitle}>
//             {selectedMala.charAt(0).toUpperCase() + selectedMala.slice(1)} Japamala
//           </Text>
          
//           {renderBeads()}
          
//           <View style={styles.progressInfo}>
//             <View style={styles.progressBar}>
//               <View 
//                 style={[
//                   styles.progressFill,
//                   { 
//                     width: `${(count % 108) * (100/108)}%`,
//                     backgroundColor: getMalaColor(selectedMala)
//                   }
//                 ]} 
//               />
//             </View>
//             <Text style={styles.progressText}>
//               {remaining}/108 beads in current mala
//             </Text>
//           </View>
//         </View>

//         {/* Main Counter Display */}
//         <View style={styles.counterContainer}>
//           <Animated.View style={[styles.counterCircle, {
//             transform: [{ scale: scaleValue }]
//           }]}>
//             <Text style={styles.countText}>{count}</Text>
//             <Text style={styles.countLabel}>TOTAL CHANTS</Text>
//             <View style={styles.malaCount}>
//               <Text style={styles.malaCountText}>
//                 {malas} mala{malas !== 1 ? 's' : ''}
//               </Text>
//             </View>
//           </Animated.View>
          
//           <View style={styles.statsRow}>
//             <View style={styles.statItem}>
//               <Ionicons name="time" size={20} color={colors.gray} />
//               <Text style={styles.statValue}>{formatTime(time)}</Text>
//               <Text style={styles.statLabel}>Duration</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="speedometer" size={20} color={colors.gray} />
//               <Text style={styles.statValue}>
//                 {count > 0 ? Math.floor(count / (time > 0 ? time : 1)) : 0}
//               </Text>
//               <Text style={styles.statLabel}>Chants/min</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="flag" size={20} color={colors.gray} />
//               <Text style={styles.statValue}>{nextMalaCount}</Text>
//               <Text style={styles.statLabel}>To next mala</Text>
//             </View>
//           </View>
//         </View>

//         {/* Quick Count Buttons */}
//         <View style={styles.quickCountContainer}>
//           <Text style={styles.sectionTitle}>Quick Count</Text>
//           <View style={styles.quickCountButtons}>
//             <TouchableOpacity
//               style={styles.quickCountButton}
//               onPress={() => addCount()}
//               disabled={!isActive || isPaused}
//             >
//               <Text style={styles.quickCountText}>+1</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.quickCountButton}
//               onPress={() => addMultipleCounts(10)}
//               disabled={!isActive || isPaused}
//             >
//               <Text style={styles.quickCountText}>+10</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.quickCountButton, styles.fullMalaButton]}
//               onPress={() => addMultipleCounts(108)}
//               disabled={!isActive || isPaused}
//             >
//               <Ionicons name="infinite" size={20} color={colors.white} />
//               <Text style={styles.quickCountText}>+1 Mala</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Mala Selection */}
//         <View style={styles.selectionContainer}>
//           <Text style={styles.sectionTitle}>Select Japamala Type</Text>
//           <View style={styles.malaOptions}>
//             {malaTypes.map((mala) => (
//               <TouchableOpacity
//                 key={mala.id}
//                 style={[
//                   styles.malaOption,
//                   selectedMala === mala.id && styles.malaOptionActive,
//                   { 
//                     borderColor: mala.color,
//                     backgroundColor: selectedMala === mala.id ? `${mala.color}15` : colors.white
//                   }
//                 ]}
//                 onPress={() => setSelectedMala(mala.id)}
//               >
//                 <View style={[styles.malaIcon, { backgroundColor: mala.color }]}>
//                   <Ionicons name={mala.icon} size={20} color={colors.white} />
//                 </View>
//                 <Text style={[
//                   styles.malaName,
//                   selectedMala === mala.id && { color: mala.color, fontWeight: '600' },
//                 ]}>
//                   {mala.name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Mood Selection */}
//         <View style={styles.selectionContainer}>
//           <Text style={styles.sectionTitle}>How are you feeling?</Text>
//           <View style={styles.moodOptions}>
//             {moods.map((moodItem) => (
//               <TouchableOpacity
//                 key={moodItem.id}
//                 style={[
//                   styles.moodOption,
//                   mood === moodItem.id && styles.moodOptionActive,
//                   { 
//                     borderColor: getMoodColor(moodItem.id),
//                     backgroundColor: mood === moodItem.id ? `${getMoodColor(moodItem.id)}15` : colors.white
//                   }
//                 ]}
//                 onPress={() => setMood(moodItem.id)}
//               >
//                 <Text style={styles.moodEmoji}>{moodItem.emoji}</Text>
//                 <Text style={[
//                   styles.moodLabel,
//                   mood === moodItem.id && { color: getMoodColor(moodItem.id), fontWeight: '600' },
//                 ]}>
//                   {moodItem.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Main Controls */}
//         <View style={styles.controlsContainer}>
//           {!isActive ? (
//             <TouchableOpacity
//               style={[styles.controlButton, styles.startButton]}
//               onPress={startChanting}
//             >
//               <Ionicons name="play" size={28} color={colors.white} />
//               <Text style={styles.controlButtonText}>Start Chanting</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               <TouchableOpacity
//                 style={[styles.controlButton, styles.pauseButton]}
//                 onPress={pauseChanting}
//               >
//                 <Ionicons
//                   name={isPaused ? 'play' : 'pause'}
//                   size={24}
//                   color={colors.white}
//                 />
//                 <Text style={styles.controlButtonText}>
//                   {isPaused ? 'Resume' : 'Pause'}
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.controlButton, styles.completeButton]}
//                 onPress={endChanting}
//               >
//                 <Ionicons name="checkmark-circle" size={24} color={colors.white} />
//                 <Text style={styles.controlButtonText}>Complete</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.controlButton, styles.resetButton]}
//                 onPress={resetChanting}
//               >
//                 <Ionicons name="refresh" size={20} color={colors.white} />
//                 <Text style={styles.controlButtonText}>Reset</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>

//         {/* Instructions */}
//         <View style={styles.instructions}>
//           <Text style={styles.instructionTitle}>📿 How to Chant:</Text>
//           <View style={styles.instructionItem}>
//             <Ionicons name="hand-left" size={16} color={colors.primary} />
//             <Text style={styles.instructionText}>Tap +1 button for each chant</Text>
//           </View>
//           <View style={styles.instructionItem}>
//             <Ionicons name="add-circle" size={16} color={colors.primary} />
//             <Text style={styles.instructionText}>Use +10 or +1 Mala for quick counting</Text>
//           </View>
//           <View style={styles.instructionItem}>
//             <Ionicons name="flame" size={16} color={colors.warning} />
//             <Text style={styles.instructionText}>Complete 108 chants daily to maintain streak</Text>
//           </View>
//           <View style={styles.instructionItem}>
//             <Ionicons name="star" size={16} color={getMalaColor(selectedMala)} />
//             <Text style={styles.instructionText}>Colored beads show completed chants in current mala</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Completion Modal */}
//       <Modal
//         visible={showCompletionModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowCompletionModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Ionicons name="checkmark-circle" size={60} color={colors.success} />
//               <Text style={styles.modalTitle}>Session Completed!</Text>
//             </View>
            
//             <Text style={styles.modalMessage}>{completionMessage}</Text>
            
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonPrimary]}
//                 onPress={() => {
//                   setShowCompletionModal(false);
//                   resetChanting();
//                   router.back();
//                 }}
//               >
//                 <Text style={styles.modalButtonText}>Back to Mantras</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonSecondary]}
//                 onPress={() => {
//                   setShowCompletionModal(false);
//                   resetChanting();
//                 }}
//               >
//                 <Text style={[styles.modalButtonText, { color: colors.primary }]}>
//                   Start New Session
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background,
//   },
//   loadingText: {
//     fontSize: 18,
//     color: colors.gray,
//     marginBottom: 20,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 25,
//   },
//   backButtonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   scrollContainer: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   backButtonHeader: {
//     padding: 8,
//   },
//   mantraInfo: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   mantraTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.dark,
//     textAlign: 'center',
//   },
//   mantraSanskrit: {
//     fontSize: 24,
//     color: colors.primary,
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   streakInfo: {
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     padding: 10,
//     borderRadius: 15,
//     minWidth: 80,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   streakLabel: {
//     fontSize: 12,
//     color: colors.gray,
//   },
//   streakValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.primary,
//   },
//   visualizationContainer: {
//     backgroundColor: colors.white,
//     marginHorizontal: 20,
//     marginVertical: 15,
//     padding: 20,
//     borderRadius: 20,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   visualizationTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.dark,
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   beadsContainer: {
//     alignItems: 'center',
//   },
//   beadsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 4,
//     marginBottom: 15,
//   },
//   bead: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     position: 'relative',
//   },
//   meruDot: {
//     position: 'absolute',
//     top: 1,
//     left: 1,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: colors.white,
//   },
//   currentIndicator: {
//     position: 'absolute',
//     top: -2,
//     left: -2,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: colors.white,
//   },
//   meruIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   meruText: {
//     fontSize: 12,
//     color: colors.gray,
//     marginLeft: 5,
//   },
//   progressInfo: {
//     marginTop: 15,
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: colors.lightGray,
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//   },
//   progressText: {
//     fontSize: 12,
//     color: colors.gray,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   counterContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   counterCircle: {
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: colors.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom: 15,
//   },
//   countText: {
//     fontSize: 56,
//     fontWeight: 'bold',
//     color: colors.dark,
//   },
//   countLabel: {
//     fontSize: 12,
//     color: colors.gray,
//     marginTop: -10,
//   },
//   malaCount: {
//     position: 'absolute',
//     bottom: 20,
//     backgroundColor: colors.primaryLight,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   malaCountText: {
//     fontSize: 12,
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.dark,
//     marginTop: 5,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: colors.gray,
//     marginTop: 2,
//   },
//   quickCountContainer: {
//     paddingHorizontal: 20,
//     marginVertical: 10,
//   },
//   quickCountButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   quickCountButton: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   fullMalaButton: {
//     backgroundColor: colors.success,
//     flexDirection: 'row',
//     gap: 5,
//   },
//   quickCountText: {
//     color: colors.white,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   selectionContainer: {
//     paddingHorizontal: 20,
//     marginVertical: 10,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.dark,
//     marginBottom: 15,
//   },
//   malaOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   malaOption: {
//     width: '48%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 2,
//   },
//   malaOptionActive: {
//     borderWidth: 2,
//   },
//   malaIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },
//   malaName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: colors.dark,
//   },
//   moodOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     gap: 8,
//   },
//   moodOption: {
//     width: '31%',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 12,
//     borderWidth: 2,
//   },
//   moodOptionActive: {
//     borderWidth: 2,
//   },
//   moodEmoji: {
//     fontSize: 24,
//     marginBottom: 5,
//   },
//   moodLabel: {
//     fontSize: 12,
//     color: colors.dark,
//     textAlign: 'center',
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     marginVertical: 20,
//     gap: 10,
//   },
//   controlButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderRadius: 12,
//     gap: 8,
//   },
//   startButton: {
//     backgroundColor: colors.primary,
//   },
//   pauseButton: {
//     backgroundColor: colors.warning,
//   },
//   completeButton: {
//     backgroundColor: colors.success,
//   },
//   resetButton: {
//     backgroundColor: colors.danger,
//   },
//   controlButtonText: {
//     color: colors.white,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   instructions: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//     marginBottom: 30,
//     backgroundColor: colors.white,
//     padding: 15,
//     borderRadius: 15,
//     marginHorizontal: 20,
//   },
//   instructionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.dark,
//     marginBottom: 10,
//   },
//   instructionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   instructionText: {
//     fontSize: 14,
//     color: colors.darkGray,
//     marginLeft: 10,
//     flex: 1,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     borderRadius: 20,
//     padding: 25,
//     width: '90%',
//     maxWidth: 400,
//     alignItems: 'center',
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.dark,
//     marginTop: 10,
//   },
//   modalMessage: {
//     fontSize: 16,
//     color: colors.darkGray,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 25,
//   },
//   modalButtons: {
//     width: '100%',
//   },
//   modalButton: {
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   modalButtonPrimary: {
//     backgroundColor: colors.primary,
//   },
//   modalButtonSecondary: {
//     backgroundColor: colors.white,
//     borderWidth: 2,
//     borderColor: colors.primary,
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.white,
//   },
// });

  // const renderCenterBead = () => {
  //   const malaColor = getMalaColor(selectedMala);
  //   const iconName = getMalaIcon(selectedMala);
    
  //   return (
  //     <Animated.View style={[
  //       styles.centerBeadContainer,
  //       { transform: [{ scale: beadScale }] }
  //     ]}>
  //       <Svg width="140" height="140" viewBox="0 0 140 140">
  //         {/* Outer ring */}
  //         <Circle
  //           cx="70"
  //           cy="70"
  //           r="65"
  //           fill="none"
  //           stroke={malaColor}
  //           strokeWidth="4"
  //           strokeOpacity="0.3"
  //         />
          
  //         {/* Main bead */}
  //         <Circle
  //           cx="70"
  //           cy="70"
  //           r="50"
  //           fill={malaColor}
  //         />
          
  //         {/* Inner highlight */}
  //         <Circle
  //           cx="55"
  //           cy="55"
  //           r="15"
  //           fill="#FFFFFF"
  //           fillOpacity="0.3"
  //         />
          
  //         {/* Bead texture based on type */}
  //         {selectedMala === 'rudraksh' && (
  //           <>
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="35"
  //               fill="none"
  //               stroke="#7C2D12"
  //               strokeWidth="2"
  //               strokeDasharray="5,5"
  //             />
  //             {[...Array(8)].map((_, i) => {
  //               const angle = (i * 45) * Math.PI / 180;
  //               const x1 = 70 + 40 * Math.cos(angle);
  //               const y1 = 70 + 40 * Math.sin(angle);
  //               const x2 = 70 + 25 * Math.cos(angle);
  //               const y2 = 70 + 25 * Math.sin(angle);
  //               return (
  //                 <Path
  //                   key={i}
  //                   d={`M ${x1} ${y1} L ${x2} ${y2}`}
  //                   stroke="#7C2D12"
  //                   strokeWidth="2"
  //                 />
  //               );
  //             })}
  //           </>
  //         )}
          
  //         {selectedMala === 'tulsi' && (
  //           <>
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="35"
  //               fill="#064E3B"
  //               fillOpacity="0.3"
  //             />
  //             {[...Array(6)].map((_, i) => {
  //               const angle = (i * 60) * Math.PI / 180;
  //               const x = 70 + 35 * Math.cos(angle);
  //               const y = 70 + 35 * Math.sin(angle);
  //               return (
  //                 <Circle
  //                   key={i}
  //                   cx={x}
  //                   cy={y}
  //                   r="6"
  //                   fill="#059669"
  //                   fillOpacity="0.7"
  //                 />
  //               );
  //             })}
  //           </>
  //         )}
          
  //         {selectedMala === 'chandan' && (
  //           <>
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="40"
  //               fill="none"
  //               stroke="#FBBF24"
  //               strokeWidth="3"
  //               strokeDasharray="10,5"
  //             />
  //             {[...Array(12)].map((_, i) => {
  //               const angle = (i * 30) * Math.PI / 180;
  //               const x = 70 + 30 * Math.cos(angle);
  //               const y = 70 + 30 * Math.sin(angle);
  //               return (
  //                 <Circle
  //                   key={i}
  //                   cx={x}
  //                   cy={y}
  //                   r="3"
  //                   fill="#FBBF24"
  //                 />
  //               );
  //             })}
  //           </>
  //         )}
          
  //         {selectedMala === 'crystal' && (
  //           <>
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="45"
  //               fill="none"
  //               stroke="#93C5FD"
  //               strokeWidth="2"
  //             />
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="35"
  //               fill="none"
  //               stroke="#93C5FD"
  //               strokeWidth="2"
  //             />
  //             <Circle
  //               cx="70"
  //               cy="70"
  //               r="25"
  //               fill="none"
  //               stroke="#93C5FD"
  //               strokeWidth="2"
  //             />
  //             {[...Array(16)].map((_, i) => {
  //               const angle1 = (i * 22.5) * Math.PI / 180;
  //               const angle2 = ((i + 8) * 22.5) * Math.PI / 180;
  //               const x1 = 70 + 50 * Math.cos(angle1);
  //               const y1 = 70 + 50 * Math.sin(angle1);
  //               const x2 = 70 + 50 * Math.cos(angle2);
  //               const y2 = 70 + 50 * Math.sin(angle2);
  //               return (
  //                 <Path
  //                   key={i}
  //                   d={`M ${x1} ${y1} L ${x2} ${y2}`}
  //                   stroke="#93C5FD"
  //                   strokeWidth="1"
  //                   strokeOpacity="0.5"
  //                 />
  //               );
  //             })}
  //           </>
  //         )}
  //       </Svg>
        
  //       {/* Icon overlay */}
  //       <View style={styles.beadIcon}>
  //         <Ionicons name={iconName} size={40} color="#FFFFFF" />
  //       </View>
  //     </Animated.View>
  //   );
  // };



  import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  Vibration,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../Context/AuthContext';
import { mantraAPI } from '../../services/api';
import { colors } from '../../constants/Colors';
import Svg, { Circle, G, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const BEADS_COUNT = 108;
const MERU_BEAD_POSITION = 109; // Meru bead is the 109th bead (after 108 counting beads)

export default function ChantScreen() {
  const params = useLocalSearchParams();
  const { user, saveChantingSession, todayStats } = useAuth();
  
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [selectedMala, setSelectedMala] = useState('rudraksh');
  const [currentMantra, setCurrentMantra] = useState(null);
  const [mood, setMood] = useState('neutral');
  const [sessionId, setSessionId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [currentBeadIndex, setCurrentBeadIndex] = useState(0); // 0-107 for beads, 108 for meru
  
  // Animation values
  const beadScale = useRef(new Animated.Value(1)).current;
  const beadPosition = useRef(new Animated.Value(0)).current;
  const beadOpacity = useRef(new Animated.Value(1)).current;
  const meruPulse = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const beadQueue = useRef([]);

  useEffect(() => {
    if (params.mantraId) {
      loadMantra(params.mantraId);
    }
  }, [params.mantraId]);

  useEffect(() => {
    if (isActive && !isPaused) {
      startTimeRef.current = new Date();
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused]);

  useEffect(() => {
    // Update current bead based on count
    const completedBeads = count % BEADS_COUNT;
    setCurrentBeadIndex(completedBeads);
    
    // Special vibration when reaching meru bead (completing 108 chants)
    if (completedBeads === 0 && count > 0) {
      Vibration.vibrate([0, 100, 100, 100]);
      // Pulse animation for meru bead completion
      Animated.sequence([
        Animated.timing(meruPulse, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(meruPulse, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  const loadMantra = async (mantraId) => {
    try {
      console.log('📖 Loading mantra:', mantraId);
      const result = await mantraAPI.getMantraById(mantraId);
      if (result.success) {
        setCurrentMantra(result.data.data);
        console.log('✅ Mantra loaded:', result.data.data.name);
      } else {
        console.error('❌ Failed to load mantra:', result.error);
        Alert.alert('Error', 'Failed to load mantra');
      }
    } catch (error) {
      console.error('❌ Load mantra error:', error);
      Alert.alert('Error', 'Network error loading mantra');
    }
  };

  const animateBeadTap = () => {
    // Reset position for new bead
    beadPosition.setValue(0);
    beadOpacity.setValue(1);
    
    Animated.parallel([
      // Scale animation
      Animated.sequence([
        Animated.timing(beadScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(beadScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      // Fade out and move up animation
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.timing(beadPosition, {
            toValue: -50,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(beadOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      // Reset opacity for next bead
      beadOpacity.setValue(1);
      beadPosition.setValue(0);
    });
  };

  const addCount = () => {
    if (!isActive || isPaused) return;
    
    const newCount = count + 1;
    setCount(newCount);
    
    // Vibration feedback for each count
    Vibration.vibrate(30);
    
    // Animate the bead tap
    animateBeadTap();
  };

  const startChanting = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to start chanting', [
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }
    
    if (!currentMantra) {
      Alert.alert('Error', 'Please select a mantra first');
      return;
    }
    
    setIsActive(true);
    setIsPaused(false);
    setCount(0);
    setTime(0);
    setCurrentBeadIndex(0);
    
    console.log('▶️ Chanting started for mantra:', currentMantra.name);
  };

  const pauseChanting = () => {
    setIsPaused(!isPaused);
    console.log(isPaused ? '▶️ Chanting resumed' : '⏸️ Chanting paused');
  };

  const resetChanting = () => {
    Alert.alert(
      'Reset Session',
      'Are you sure you want to reset? All progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            setIsPaused(true);
            setCount(0);
            setTime(0);
            setCurrentBeadIndex(0);
            setSessionId(null);
            console.log('🔄 Session reset');
          }
        }
      ]
    );
  };

  // In your ChantScreen.js, update the endChanting function:
const endChanting = async () => {
  if (count === 0) {
    Alert.alert('Info', 'No chanting recorded. Please chant at least once.');
    return;
  }
  
  // Calculate actual duration
  const endTime = new Date();
  const actualDuration = startTimeRef.current 
    ? Math.floor((endTime - startTimeRef.current) / 1000)
    : time;
  
  console.log('🎯 Ending chanting session:', {
    count,
    duration: actualDuration,
    mantraId: currentMantra._id || currentMantra.id,
    japamalaType: selectedMala,
    mood
  });
  
  try {
    if (!user) {
      // Save locally if not logged in
      Alert.alert(
        'Session Completed',
        `You chanted ${count} times for ${formatTime(actualDuration)}\n\nLogin to save your progress and track streaks.`,
        [
          { text: 'OK', onPress: resetChanting }
        ]
      );
      return;
    }
    
    // Save to backend using the updated saveChantingSession
    const result = await saveChantingSession(
      currentMantra._id || currentMantra.id,
      count,
      actualDuration,
      selectedMala,
      mood
    );
    
    console.log('Save session result:', result);
    
    if (result.success) {
      // Show streak information
      let streakMessage = '';
      if (count >= 108) {
        streakMessage = '\n🎉 You completed a full mala! Your streak is maintained.';
      } else {
        streakMessage = '\n⚠️ Complete 108 chants to maintain your daily streak.';
      }
      
      // Show completion modal
      setCompletionMessage(
        `✅ Session Saved!\n\n` +
        `Chants: ${count}\n` +
        `Duration: ${formatTime(actualDuration)}\n` +
        `Mantra: ${currentMantra.name}\n` +
        `Today's Total: ${todayStats.count + count} chants` +
        streakMessage
      );
      setShowCompletionModal(true);
      
      console.log('✅ Session saved successfully');
    } else {
      Alert.alert('Error', result.error || 'Failed to save session');
    }
  } catch (error) {
    console.error('❌ End chanting error:', error);
    Alert.alert('Error', 'Failed to save session: ' + error.message);
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get mala color based on selection
  const getMalaColor = (malaType) => {
    const colorMap = {
      'rudraksh': '#92400E',
      'tulsi': '#065F46',
      'chandan': '#F59E0B',
      'crystal': '#60A5FA',
      'kamalbij': '#DB2777',
      'karungali': '#000000',
    };
    return colorMap[malaType] || '#92400E';
  };

  // Get mala icon based on selection
  const getMalaIcon = (malaType) => {
    const iconMap = {
      'rudraksh': 'leaf',
      'tulsi': 'flower',
      'chandan': 'water',
      'crystal': 'diamond',
      'kamalbij': 'heart',
      'karungali': 'moon',
    };
    return iconMap[malaType] || 'leaf';
  };

  // Get mood color
  const getMoodColor = (moodType) => {
    const colors = {
      'peaceful': '#4A1E8C',
      'energetic': '#F59E0B',
      'focused': '#3B82F6',
      'neutral': '#6B7280',
      'happy': '#10B981',
      'anxious': '#EF4444',
    };
    return colors[moodType] || '#6B7280';
  };

  const malaTypes = [
    { id: 'rudraksh', name: 'Rudraksh', color: '#92400E', icon: 'leaf' },
    { id: 'tulsi', name: 'Tulsi', color: '#065F46', icon: 'flower' },
    { id: 'chandan', name: 'Chandan', color: '#F59E0B', icon: 'water' },
    { id: 'crystal', name: 'Crystal', color: '#60A5FA', icon: 'diamond' },
  ];

  const moods = [
    { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic' },
    { id: 'focused', emoji: '🎯', label: 'Focused' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
  ];

  const malasCompleted = Math.floor(count / BEADS_COUNT);
  const beadsInCurrentMala = count % BEADS_COUNT;
  const nextMalaCount = BEADS_COUNT - beadsInCurrentMala;

  // Function to render the main interactive bead
  const renderInteractiveBead = () => {
    const malaColor = getMalaColor(selectedMala);
    const iconName = getMalaIcon(selectedMala);
    const completedBeads = beadsInCurrentMala;
    const isMeruBead = completedBeads === 0 && count > 0; // At meru position after completing 108
    
    return (
      <View style={styles.interactiveBeadContainer}>
        <Text style={styles.interactiveBeadTitle}>
          Tap the Bead to Chant
        </Text>
        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={addCount}
          disabled={!isActive || isPaused}
        >
          <Animated.View style={[
            styles.interactiveBeadWrapper,
            {
              opacity: beadOpacity,
              transform: [
                { scale: beadScale },
                { translateY: beadPosition }
              ]
            }
          ]}>
            <View style={styles.interactiveBeadBackground}>
              {/* Bead glow effect */}
              <View style={[styles.beadGlow, { backgroundColor: `${malaColor}40` }]} />
              
              {/* Main bead */}
              <View style={[styles.interactiveBead, { 
                backgroundColor: malaColor,
                borderColor: isMeruBead ? '#FFD700' : malaColor,
                borderWidth: isMeruBead ? 3 : 0,
              }]}>
                {/* Bead icon */}
                <View style={styles.beadIconContainer}>
                  {isMeruBead ? (
                    <Ionicons name="star" size={36} color="#FFD700" />
                  ) : (
                    <Ionicons name={iconName} size={30} color="#FFFFFF" />
                  )}
                </View>
                
                {/* Current bead number */}
                <View style={styles.beadNumberContainer}>
                  <Text style={styles.beadNumber}>
                    {isMeruBead ? 'M' : completedBeads + 1}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
        
        {/* Bead progress info */}
        <View style={styles.beadProgressInfo}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Current Bead</Text>
              <Text style={[styles.progressValue, { color: malaColor }]}>
                {isMeruBead ? 'Meru' : `${completedBeads + 1}/108`}
              </Text>
            </View>
            
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Next Mala</Text>
              <Text style={styles.progressValue}>
                {nextMalaCount} beads
              </Text>
            </View>
          </View>
          
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${(completedBeads / 108) * 100}%`,
                    backgroundColor: malaColor 
                  }
                ]}
              />
            </View>
            <Text style={styles.progressBarText}>
              {completedBeads} of 108 beads completed
            </Text>
          </View>
        </View>
        
        {/* Instructions */}
        {isActive && !isPaused && (
          <View style={styles.tapInstructions}>
            <Ionicons name="hand-right" size={20} color={colors.primary} />
            <Text style={styles.tapInstructionsText}>
              Tap the bead for each chant
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (!currentMantra) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading mantra...</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
          <Text style={styles.backButtonText}>Back to Mantras</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.mantraInfo}>
          <Text style={styles.mantraTitle}>{currentMantra.name}</Text>
          <Text style={styles.mantraSanskrit}>{currentMantra.sanskritText}</Text>
        </View>
        
        <View style={styles.streakInfo}>
          <Text style={styles.streakLabel}>Today</Text>
          <Text style={styles.streakValue}>{todayStats.count}</Text>
          <Text style={styles.streakLabel}>chants</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Counter Display with Interactive Bead */}
        <View style={styles.counterSection}>
          <View style={styles.counterInfo}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.countLabel}>CHANTS</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color={colors.gray} />
                <Text style={styles.statValue}>{formatTime(time)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="repeat" size={20} color={colors.gray} />
                <Text style={styles.statValue}>{malasCompleted}</Text>
                <Text style={styles.statLabel}>Malas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interactive Bead Section */}
        {renderInteractiveBead()}

        {/* Start/Stop Controls */}
        <View style={styles.mainControls}>
          {!isActive ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startChanting}
            >
              <Ionicons name="play-circle" size={30} color={colors.white} />
              <Text style={styles.startButtonText}>Start Chanting</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={pauseChanting}
              >
                <Ionicons
                  name={isPaused ? 'play' : 'pause'}
                  size={22}
                  color={colors.white}
                />
                <Text style={styles.controlButtonText}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.countButton]}
                onPress={addCount}
              >
                <Ionicons name="add-circle" size={26} color={colors.white} />
                <Text style={styles.controlButtonText}>Add Chant</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, styles.completeButton]}
                onPress={endChanting}
              >
                <Ionicons name="checkmark" size={22} color={colors.white} />
                <Text style={styles.controlButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mala Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Choose Your Japamala</Text>
          <View style={styles.malaOptions}>
            {malaTypes.map((mala) => (
              <TouchableOpacity
                key={mala.id}
                style={[
                  styles.malaOption,
                  selectedMala === mala.id && styles.malaOptionActive,
                  { 
                    borderColor: mala.color,
                    backgroundColor: selectedMala === mala.id ? `${mala.color}15` : colors.white
                  }
                ]}
                onPress={() => setSelectedMala(mala.id)}
              >
                <View style={[styles.malaIcon, { backgroundColor: mala.color }]}>
                  <Ionicons name={mala.icon} size={18} color={colors.white} />
                </View>
                <Text style={[
                  styles.malaName,
                  selectedMala === mala.id && { color: mala.color, fontWeight: '600' },
                ]}>
                  {mala.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Selection */}
        <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>Your Current Mood</Text>
          <View style={styles.moodOptions}>
            {moods.map((moodItem) => (
              <TouchableOpacity
                key={moodItem.id}
                style={[
                  styles.moodOption,
                  mood === moodItem.id && styles.moodOptionActive,
                  { 
                    borderColor: getMoodColor(moodItem.id),
                    backgroundColor: mood === moodItem.id ? `${getMoodColor(moodItem.id)}15` : colors.white
                  }
                ]}
                onPress={() => setMood(moodItem.id)}
              >
                <Text style={styles.moodEmoji}>{moodItem.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  mood === moodItem.id && { color: getMoodColor(moodItem.id), fontWeight: '600' },
                ]}>
                  {moodItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Session Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: isActive 
                ? (isPaused ? colors.warning : colors.success) 
                : colors.gray 
              }
            ]}>
              <Text style={styles.statusText}>
                {isActive 
                  ? (isPaused ? 'PAUSED' : 'CHANTING') 
                  : 'READY'
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Daily Goal</Text>
            <Text style={styles.statusTarget}>108</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Today's Total</Text>
            <Text style={styles.statusToday}>
              {todayStats.count + count}
            </Text>
          </View>
        </View>

        {/* Secondary Controls */}
        {isActive && (
          <View style={styles.secondaryControls}>
            <TouchableOpacity
              style={styles.resetSessionButton}
              onPress={resetChanting}
            >
              <Ionicons name="refresh" size={20} color={colors.danger} />
              <Text style={styles.resetSessionText}>Reset Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>📿 How to Use:</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="play-circle" size={16} color={colors.primary} />
            <Text style={styles.instructionText}>Tap "Start Chanting" to begin</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="finger-print" size={16} color={colors.primary} />
            <Text style={styles.instructionText}>Tap the bead for each repetition</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.instructionText}>Gold star appears at Meru bead (every 108 chants)</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark" size={16} color={colors.primary} />
            <Text style={styles.instructionText}>Tap "Complete" when finished to save session</Text>
          </View>
        </View>
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={60} color={colors.success} />
              <Text style={styles.modalTitle}>Session Completed!</Text>
            </View>
            
            <Text style={styles.modalMessage}>{completionMessage}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  setShowCompletionModal(false);
                  resetChanting();
                  router.back();
                }}
              >
                <Text style={styles.modalButtonText}>Back to Mantras</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowCompletionModal(false);
                  resetChanting();
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.primary }]}>
                  Start New Session
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButtonHeader: {
    padding: 8,
  },
  mantraInfo: {
    flex: 1,
    alignItems: 'center',
  },
  mantraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
  },
  mantraSanskrit: {
    fontSize: 20,
    color: colors.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  streakInfo: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 70,
  },
  streakLabel: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  counterSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  counterInfo: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: colors.dark,
  },
  countLabel: {
    fontSize: 14,
    color: colors.gray,
    marginTop: -10,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  interactiveBeadContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  interactiveBeadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  interactiveBeadWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interactiveBeadBackground: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beadGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  interactiveBead: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  beadIconContainer: {
    position: 'absolute',
    top: 35,
  },
  beadNumberContainer: {
    position: 'absolute',
    bottom: 25,
  },
  beadNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  beadProgressInfo: {
    width: '100%',
    marginTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 5,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  tapInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.primaryLight,
    borderRadius: 15,
  },
  tapInstructionsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  mainControls: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
    gap: 10,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  countButton: {
    backgroundColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  controlButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  selectionContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 15,
  },
  malaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  malaOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  malaOptionActive: {
    borderWidth: 2,
  },
  malaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  malaName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodOption: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  moodOptionActive: {
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 13,
    color: colors.dark,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 5,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 80,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTarget: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusToday: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
  },
  secondaryControls: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  resetSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: `${colors.danger}15`,
    gap: 8,
  },
  resetSessionText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});


