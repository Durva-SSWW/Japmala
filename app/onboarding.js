import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Japamala',
      description: 'Your personal digital rosary for spiritual growth and mindfulness',
      emoji: '📿',
      color: '#4A1E8C'
    },
    {
      title: 'Track Your Journey',
      description: 'Keep count of your chants, track streaks, and see your spiritual progress',
      emoji: '📈',
      color: '#2E7D32'
    },
    {
      title: 'Start Your Practice',
      description: 'Join thousands in daily spiritual practice and find inner peace',
      emoji: '🕉️',
      color: '#D97706'
    }
  ];

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slide);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <LinearGradient
              colors={[slide.color, '#6B46C1']}
              style={styles.emojiContainer}
            >
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </LinearGradient>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlide === index && styles.activeIndicator
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8'
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  emojiContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  emoji: {
    fontSize: 80
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 5
  },
  activeIndicator: {
    backgroundColor: '#4A1E8C',
    width: 30
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280'
  },
  nextButton: {
    backgroundColor: '#4A1E8C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center'
  },
  nextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600'
  }
});