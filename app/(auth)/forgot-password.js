import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement API call for password reset
      Alert.alert(
        'Reset Link Sent',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient
          colors={['#4A1E8C', '#6B46C1']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.appTitle}>Reset Password</Text>
          <Text style={styles.appSubtitle}>Enter your email to receive reset instructions</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.instruction}>
            Enter the email address associated with your account and we'll send you instructions to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
              autoComplete="email"
            />
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backToLoginButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8'
  },
  scrollContainer: {
    flexGrow: 1
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 10
  },
  backText: {
    fontSize: 24,
    color: '#FFFFFF'
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20
  },
  appSubtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30
  },
  instruction: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22
  },
  inputContainer: {
    marginBottom: 25
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937'
  },
  resetButton: {
    backgroundColor: '#4A1E8C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  resetButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  backToLoginButton: {
    borderWidth: 2,
    borderColor: '#4A1E8C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  backToLoginText: {
    color: '#4A1E8C',
    fontSize: 16,
    fontWeight: '600'
  }
});