import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import constant from '../constant';
import { sendRegisterOtp  } from '../service'


const { height } = Dimensions.get('window');

export default function SignScreen() {
  const router = useRouter();
  const [email , setEmail] = useState<string>()
  const [password , setPassword] = useState<string>()
  const [confirmPassword ,  setConfirmPassword] = useState<string>()
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');


  const [isSignIn, setIsSignIn] = useState(true);



const handleAuthPress = async () => {
  if (loading) return;

  setLoading(true);

  try {
    if (isSignIn) {
      // Sign In flow
      router.replace("/(tabs)/home");
    } else {
      // Sign Up flow
      if (!email) return alert("Please enter your email");

      if (!otpSent) {
        const res = await sendRegisterOtp({ email });
        alert("OTP sent to your email");
        setOtpSent(true); // Show OTP input
      } else {
        if (!otp) return alert("Enter the OTP");

        // const res = await verifyOtpAPI({ email, otp });
        alert("OTP Verified! Account created.");
        router.replace("/(tabs)/home");
      }
    }
  } catch (err) {
    console.error(err);
    alert(otpSent ? "OTP verification failed" : "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

  // const handlesignUp () 

  return (
    <View style={styles.container}>
      {/* Top Section - Logo */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/artdomain-logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Bottom Section - Card UI */}
      <View style={styles.bottomSection}>
        {/* Tab Switch */}
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

        {/* Instruction */}
        <Text style={styles.instructionText}>
          {isSignIn ? 'Please sign in to continue' : 'Please sign up to continue'}
        </Text>

        {/* Input Fields */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            <Ionicons name="mail" size={20} color="#333" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="E mail / username"
              placeholderTextColor="#888"
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
                placeholder="Confirm password"
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
          // onPress={() => {
          //   // In real apps, check credentials here
          // router.replace('/(tabs)/home');
          // }}
          onPress={handleAuthPress}
        >
        
          <Text style={styles.primaryButtonText}>
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        {isSignIn && (
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password ?</Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <Text style={styles.socialDivider}>Or {isSignIn ? 'sign in' : 'sign up'} using</Text>

        {/* Social Login */}
       
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  tabText: {
    fontSize: 16,
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
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  inputRow: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#111',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  forgotPassword: {
    color: 'crimson',
    alignSelf: 'flex-end',
    marginBottom: 10,
    fontSize: 13,
  },
  socialDivider: {
    marginVertical: 16,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialIcon: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
