import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  // SafeAreaView ko import kiya gaya hai
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email.trim()) {
      return Alert.alert('Error', 'Please enter your email address');
    }

    // TODO: Call reset password API
    Alert.alert('Success', `Reset link sent to ${email}`);
  };

  return (
    // KeyboardAvoidingView ko SafeAreaView ke andar wrap kiya gaya hai
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            <View>
              {/* Logo */}
              <Image
                source={require('../../assets/images/artdomain-logo.png')} 
                style={styles.logo}
              />

              {/* Welcome Message */}
              <Text style={styles.heading}>Welcome to our <Text style={styles.bold}>community</Text></Text>
              <Text style={styles.subtext}>
                Personalized, updated daily, and beautifully presented.{"\n"}
                Sign in to find your dream ways of earning and gain full access to platform functions.
              </Text>

              {/* Forgot Section */}
              <View style={{ marginTop: 20 }}>
                <Text style={styles.forgotTitle}>Forgot Password</Text>
                <Text style={styles.forgotSubtext}>
                  Enter your email and we'll send you a link to reset your password.
                </Text>
              </View>

              {/* Email Input */}
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="mail@website.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleReset} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(24),
  },
  logo: {
    width: scale(230),
    height: scale(230),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  heading: {
    textAlign: 'center',
    fontSize: scale(18),
    color: '#111',
    marginBottom: verticalScale(4),
    fontWeight: "bold",
  },
  bold: {
    fontWeight: '700',
  },
  subtext: {
    fontSize: scale(12),
    color: '#555',
    textAlign: 'center',
    lineHeight: scale(18),
    marginBottom: verticalScale(14),
  },
  forgotTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#000',
    marginBottom: verticalScale(4),
  },
  forgotSubtext: {
    fontSize: scale(12),
    color: '#444',
    marginBottom: verticalScale(16),
  },
  inputLabel: {
    fontSize: scale(12),
    color: '#111',
    marginBottom: verticalScale(6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scale(6),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    fontSize: scale(13),
    color: '#111',
    marginBottom: verticalScale(10),
  },
  button: {
    backgroundColor: '#0033ff',
    paddingVertical: verticalScale(12),
    borderRadius: scale(6),
    alignItems: 'center',
    marginBottom: verticalScale(13),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scale(13),
  },
  backText: {
    color: '#0033ff',
    textAlign: 'center',
    fontSize: scale(12),
  },
});