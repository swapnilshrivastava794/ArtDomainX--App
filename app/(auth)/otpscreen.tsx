import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function OtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // only allow digits
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input if filled
    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Move focus to previous if deleted
    if (!text && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join('');
    if (finalOtp.length < 4) {
      alert('Please enter complete 4-digit OTP');
      return;
    }

    // TODO: Call OTP verification API here
    alert(`OTP Verified: ${finalOtp}`);
    router.replace('/(auth)/signin'); // Redirect to SignIn screen
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../../assets/images/artdomain-logo.png')}
        style={styles.logo}
      />

      <Text style={styles.heading}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>
        <View style={styles.verify}>
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} activeOpacity={0.8}>
        <Text style={styles.verifyText}>Verify OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resend} activeOpacity={0.3}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(60),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  logo: {
    width: scale(230),
    height: scale(230),
    resizeMode: 'contain',
    marginBottom: verticalScale(20),
  },
  heading: {
    fontSize: scale(17),
    fontWeight: '600',
    marginBottom: verticalScale(20),
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: verticalScale(25),
  },
  otpBox: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#888',
    textAlign: 'center',
    fontSize: scale(18),
    color: '#000',
    backgroundColor: '#f0f0f0',
  },
  verifyButton: {
    backgroundColor: '#030dff',
    paddingVertical: verticalScale(14),
    paddingHorizontal:  verticalScale(70),
    borderRadius: scale(25),
  },
  verifyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scale(13),
  },
  verify: {
    // marginTop: 10,
  },
  resend:{
    alignItems:'center',
    marginTop: verticalScale(13),
  },
  resendText: {
    color: 'red',
    fontSize: scale(12),
  },
});
