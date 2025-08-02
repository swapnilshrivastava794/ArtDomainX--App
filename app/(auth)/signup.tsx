import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendRegisterOtp } from '../service';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function SignScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const handleAuthPress = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isSignIn) {
        router.replace('/(tabs)/home');
      } else {
        if (!email || !password || !confirmPassword)
          return Alert.alert('Please fill all fields');

        if (password !== confirmPassword)
          return Alert.alert('Passwords do not match');

        const res = await sendRegisterOtp({ email });
        console.log("OTP sent response:", res);
        Alert.alert('Success', 'OTP sent to your email');
        router.replace({ pathname: '/(auth)/otpscreen', params: { email } });
      }
    } catch (err: any) {
      console.log("Signup Error:", err);
      Alert.alert('Error', err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // Yaha 'keyboardVerticalOffset' ki value kam kar di hai
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : -100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Top - Logo */}
            <View style={styles.topSection}>
              <Image
                source={require('../../assets/images/artdomain-logo.png')}
                style={styles.logo}
              />
            </View>

            {/* Bottom Card */}
            <View style={styles.bottomSection}>
              {/* Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, isSignIn && styles.activeTab]}
                  onPress={() => setIsSignIn(true)}
                >
                  <Text style={[styles.tabText, isSignIn && styles.activeTabText]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, !isSignIn && styles.activeTab]}
                  onPress={() => setIsSignIn(false)}
                >
                  <Text style={[styles.tabText, !isSignIn && styles.activeTabText]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Instructions */}
              <Text style={styles.instructionText}>
                {isSignIn ? 'Please sign in to continue' : 'Please sign up to continue'}
              </Text>

              {/* Inputs */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputRow}>
                  <Ionicons name="mail" size={20} color="#333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="E mail"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed" size={20} color="#333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {!isSignIn && (
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed" size={20} color="#333" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      secureTextEntry
                      placeholderTextColor="#888"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAuthPress}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              {isSignIn && (
                <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword')} activeOpacity={0.7}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(10),
  },
  logo: {
    width: scale(230),
    height: scale(230),
    resizeMode: 'contain',
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    paddingHorizontal: moderateScale(24),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(20),
    elevation: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: scale(30),
    overflow: 'hidden',
    marginBottom: verticalScale(16),
    alignSelf: 'center',
  },
  tabButton: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: verticalScale(30),
  },
  tabText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333',
  },
  activeTab: {
    backgroundColor: '#030dff',
  },
  activeTabText: {
    color: '#fff',
  },
  instructionText: {
    fontSize: scale(14),
    color: '#555',
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  inputWrapper: {
    width: '100%',
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  inputRow: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    borderRadius: scale(24),
  },
  inputIcon: {
    marginRight: verticalScale(8),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    paddingVertical: verticalScale(10),
    color: '#111',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: verticalScale(12),
    borderRadius: scale(24),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  primaryButtonText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#111',
  },
  forgotPassword: {
    color: 'crimson',
    alignSelf: 'flex-end',
    marginBottom: verticalScale(10),
    fontSize: scale(13),
  },
});