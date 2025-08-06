import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const Header = () => {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left: Menu, Search, Add */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.6}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Entypo name="menu" size={22} color="#444" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.6}
            onPress={() => router.push('/components/searchbar')}
          >
            <Feather name="search" size={22} color="#444" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/components/postImage')}
            activeOpacity={0.6}
          >
            <Ionicons name="add-circle-outline" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        {/* Right: Logo */}
        <Image
          source={{ uri: 'https://artdomainx.com/images/artdomain-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: 18,
  },
  logo: {
    width: 100,
    height: 40,
  },
});
