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
import { useAuth } from '../../Context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Success - navigation is handled by AuthContext
        // Alert.alert('Success', result.message);

         Alert.alert(
          'Success', 
          result.message,
          [
            { 
              text: 'Continue to Login', 
              onPress: () => router.replace('/(tabs)/dashboard') 
            }
          ]
        );
      } else {
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.appTitle}>Japamala</Text>
          <Text style={styles.appSubtitle}>Digital Spiritual Practice</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.instructionText}>Sign in to continue your spiritual journey</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username or Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username or email"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!isLoading}
              autoComplete="username"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              autoComplete="password"
            />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerButtonText}>Create New Account</Text>
          </TouchableOpacity>

          <View style={styles.demoNote}>
            <Text style={styles.demoNoteText}>
              For testing: Use any valid credentials after registration
            </Text>
          </View>
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
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  appSubtitle: {
    fontSize: 18,
    color: '#E2E8F0',
    marginTop: 10
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30
  },
  inputContainer: {
    marginBottom: 20
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
  forgotPasswordText: {
    color: '#4A1E8C',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: 30
  },
  loginButton: {
    backgroundColor: '#4A1E8C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB'
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#6B7280',
    fontSize: 14
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#4A1E8C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  registerButtonText: {
    color: '#4A1E8C',
    fontSize: 18,
    fontWeight: 'bold'
  },
  demoNote: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B'
  },
  demoNoteText: {
    color: '#92400E',
    fontSize: 14,
    textAlign: 'center'
  }
});