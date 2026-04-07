import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { COLORS } from '../constants/colors';
import { signUp, signIn } from '../lib/firebase/auth';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      router.back();
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Try signing in.'
        : err.code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : err.code === 'auth/weak-password'
            ? 'Password should be at least 6 characters.'
            : err.code === 'auth/invalid-credential'
              ? 'Invalid email or password.'
              : err.message ?? 'Authentication failed.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title={isLogin ? 'Sign In' : 'Sign Up'}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor={COLORS.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor={COLORS.secondary}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.skipBtn}>
            <Text style={styles.skipText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  content: { alignItems: 'center', width: '100%', paddingHorizontal: 20 },
  logoContainer: { marginBottom: 40, alignItems: 'center' },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 2,
    borderColor: COLORS.lightBorder,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.cardBackground,
    color: COLORS.darkText,
  },
  button: {
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: COLORS.blackShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLORS.whiteText, fontSize: 18, fontWeight: 'bold' },
  switchBtn: { marginTop: 20 },
  switchText: { color: '#ffffffcc', fontSize: 14 },
  skipBtn: { marginTop: 16 },
  skipText: { color: '#ffffff88', fontSize: 13, textDecorationLine: 'underline' },
});
