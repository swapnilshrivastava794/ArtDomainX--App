import React, { useState } from 'react';
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

  const handleLogout = () => {
    // Clear auth tokens from Redux, AsyncStorage, etc.
    // Redirect to login screen
    Alert.alert("Logged out");
    setSettingsVisible(false);
    // Example: navigation.replace("Login");
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left section */}
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

        {/* Logo */}
        <Image
          source={{ uri: 'https://artdomainx.com/images/artdomain-logo.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Modal for Settings / Logout */}
      <Modal
        animationType="slide"
        transparent
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSettingsVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Logout</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    height: 36,
    width: 120,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});
