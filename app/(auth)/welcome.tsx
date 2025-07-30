import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Section: Logo */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/artdomain-logo.png')}
          style={styles.logoImage}
        />
      </View>

      {/* Bottom Section: Shadowed Card with Buttons */}
      <View style={styles.bottomSection}>
        <Text style={styles.tagline}>Just Artist from Around{'\n'}the World</Text>

        <View style={styles.buttonContainer}>
          {/* Sign Up */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push('/(auth)/signup')}>
            <View style={styles.btnContent}>
              <Text style={styles.signUpButtonText}>Sign up free</Text>
            </View>
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.btnContent}>
              <Image
                source={require('../../assets/images/google.jpg')}
                style={styles.icon}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.btnContent}>
              <Image
                source={require('../../assets/images/facebook.jpg')}
                style={styles.icon}
              />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </View>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.btnContent}>
              <Image
                source={require('../../assets/images/apple.jpg')}
                style={styles.icon}
              />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>

          {/* Log In */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/signin')}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
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
  logoImage: {
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
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 12,
  },
  signUpButton: {
    backgroundColor: '#030dff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButton: {
    backgroundColor: '#fff',
    minHeight: 52,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    bottom:19
  },
  loginButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});
