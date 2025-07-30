import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
       <View >
              <Image
                source={require('../../assets/images/artdomain-logo.png')}
                style={styles.logoImage}
              />
            </View>
      <Text style={styles.tagline}>Just Artist from Around{'\n'}the World</Text>
      <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  star: {
    fontSize: 24,
    marginLeft: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 26,
  },
  loader: {
    marginTop: 20,
  },
    logoImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});