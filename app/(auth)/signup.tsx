// SignScreen.tsx (fixed version)

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
import { sendRegisterOtp, RegisterUser, loginUser } from '../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/slices/authSlice';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator } from 'react-native';




export default function SignScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    otp: '',
    user_type: 'user',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthPress = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isSignIn) {
        router.replace('/(tabs)/home');
      } else {
        const { email, password, confirmPassword } = formData;

        if (!email || !password || !confirmPassword) {
          Alert.alert('Error', 'Please fill all fields');
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }

        const res = await sendRegisterOtp({ email });
        console.log('OTP sent response:', res);
        Alert.alert('Success', 'OTP sent to your email');
        setOtpSent(true);
      }
    } catch (err: any) {
      const message = Array.isArray(err?.message) ? err.message.join(',') : err?.message || 'Failed to send OTP';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return Alert.alert('Please enter the OTP');
    

    const { email, password, confirmPassword, timezone, name } = formData;

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !timezone.trim() || !name.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    const updatedFormData = {
      email,
      password,
      name,          // comes from the user input
      otp,
      user_type: 'user',
      timezone,
    };
    console.log("📦 Payload to be sent:", JSON.stringify(updatedFormData, null, 2));


    try {
      const res = await RegisterUser(updatedFormData);
      console.log('✅ Registered Response:', res?.data);

      const {
        access,
        refresh,
        profile_id,
        profile_type
      } = res.data.data || {};

      if (!access || !refresh) {
        console.error("❌ Missing tokens in response", res.data);
        Alert.alert('Error', 'Something went wrong, tokens missing.');
        return;
      }

      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      dispatch(setAuth({ access, refresh, profile_id, profile_type }));

      Alert.alert('Success', 'Registration complete!');
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.log('❌ Registration Error:', error);
      const message = error?.data?.detail || 'Registration Failed';
      Alert.alert('Error', message);
    }
  };

  const handleResendOtp = async () => {
    if (!formData.email) {
      Alert.alert('Missing Email', 'Enter email before resending OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendRegisterOtp({ email: formData.email });
      console.log('🔁 Resent OTP response:', res);
      Alert.alert('Success', 'OTP resent to your email');
    } catch (err: any) {
      const message = Array.isArray(err?.message) ? err.message.join(', ') : err?.message || 'Failed to resend OTP';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }

    const loginData = new FormData();
    loginData.append('email', email);
    loginData.append('password', password);
      setLoading(true); // ✅ Start loader
    try {
      const res = await loginUser(loginData);
      console.log("✅ Login Success:", res.data);

      const { access, refresh, profile_id, profile_type } = res.data.data;

      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);

     
      dispatch({ type: 'RESET_ALL' }); // 🧹 Clear previous Redux state
      dispatch(setAuth({ access, refresh, profile_id, profile_type }));
      setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)/home');
    }, 300); // 300–500ms is enough for smoother UX
    } catch (err: any) {
      console.log("❌ Login Error:", err?.response?.data || err);
      Alert.alert("Login Failed", err?.response?.data?.detail || "Invalid credentials");
    }
  };



  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container} >
            <View style={styles.topSection}>
              <Image source={require('../../assets/images/artdomain-logo.png')} style={styles.logo} />
            </View>

            <View style={styles.bottomSection}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, isSignIn && styles.activeTab]}
                  onPress={() => {
                    setIsSignIn(true);
                    setOtpSent(false);
                  }}
                >
                  <Text style={[styles.tabText, isSignIn && styles.activeTabText]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, !isSignIn && styles.activeTab]}
                  onPress={() => {
                    setIsSignIn(false);
                    setOtpSent(false);
                  }}
                >
                  <Text style={[styles.tabText, !isSignIn && styles.activeTabText]}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.instructionText}>
                {isSignIn ? 'Please sign in to continue' : 'Please sign up to continue'}
              </Text>

              <View style={styles.inputWrapper}>
                {!isSignIn && (
                  <View style={styles.inputRow}>
                    <Ionicons name="person" size={20} color="#333" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#888"
                      value={formData.name}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                    />
                  </View>
                )}

                <View style={styles.inputRow}>
                  <Ionicons name="mail" size={20} color="#333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>

                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed" size={20} color="#333" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#888"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
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
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    />
                  </View>
                )}

                {!isSignIn && otpSent && (
                  <View style={{ marginBottom: 16 }}>
                    <View style={styles.inputRow}>
                      <Ionicons name="keypad" size={20} color="#333" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={setOtp}
                      />
                    </View>
                  </View>
                )}

                {otpSent && (
                  <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={loading}>
                    <Text style={[styles.resendText, loading && { opacity: 0.6 }]}>
                      {loading ? 'Sending...' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={
                  loading
                    ? () => { } // Disable interaction while loading
                    : otpSent
                      ? handleVerifyOtp
                      : isSignIn
                        ? handleLogin       // 👉 Call login on Sign In
                        : handleAuthPress   // 👉 Call signup (send OTP) on Sign Up
                }
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? (
                <ActivityIndicator color="#111" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {otpSent ? 'Verify OTP' : isSignIn ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
                </Text>
              </TouchableOpacity>

              {isSignIn && (
                <TouchableOpacity onPress={() => router.push('/(auth)/forgotpassword')} activeOpacity={0.7}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // paddingBottom: verticalScale(20),

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
    paddingBottom: verticalScale(55),
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
    backgroundColor: '#0033ff',
    paddingVertical: verticalScale(12),
    borderRadius: scale(10),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  primaryButtonText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#fff',
  },
  forgotPassword: {
    color: 'crimson',
    alignSelf: 'flex-end',
    marginBottom: verticalScale(10),
    fontSize: scale(13),
  },

  resendButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#007BFF',
    fontWeight: '600',
  },

});