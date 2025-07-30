import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const Header = () => {
  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      // ⚠️ Right now we're just showing URI in alert — replace with upload logic or global state
      const asset = result.assets[0];
      Alert.alert('Media Selected', asset.uri);
      console.log('Media selected from Header:', asset);
      // You can also pass this to a post composer or upload it directly
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left: Menu, Search, Add */}
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconBtn}>
            <Entypo name="menu" size={22} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="search" size={22} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleMediaPick}>
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
