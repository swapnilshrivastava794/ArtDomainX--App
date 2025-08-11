import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Text,
  Pressable,
} from 'react-native';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'; // Only if you handle navigation
import { logout } from "../store/slices/authSlice"; // your logout action
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';


const Header = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const navigation = useNavigation(); // if needed for logout redirection
  const dispatch = useDispatch();

  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      Alert.alert('Media Selected', asset.uri);
      console.log('Media selected from Header:', asset);
    }
  };

const handleLogout = async () => {
    try {
      // 1️⃣ Clear Redux auth state
      dispatch(logout());

      // 2️⃣ Clear ALL AsyncStorage data
      await AsyncStorage.clear();

      // 3️⃣ Navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

      Alert.alert("✅ Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("❌ Logout failed", "Please try again");
    } finally {
      setSettingsVisible(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left section */}
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setSettingsVisible(true)}>
            <Entypo name="menu" size={22} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="search" size={22} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleMediaPick}>
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
function dispatch(arg0: { payload: undefined; type: "auth/logout"; }) {
  throw new Error('Function not implemented.');
}

