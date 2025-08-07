import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { router } from 'expo-router';

const menuItems = [
  {
    label: 'Trending Posts',
    icon: <Ionicons name="flame" size={20} />,
    id: 'trending',
  },
  {
    label: 'Circle',
    icon: <FontAwesome5 name="users" size={18} />,
    id: 'circle',
  },
  {
    label: 'Guild',
    icon: <MaterialCommunityIcons name="shield-account" size={20} />,
    id: 'guild',
  },
  {
    label: 'Messages',
    icon: <Ionicons name="chatbubble-ellipses" size={20} />,
    id: 'messages',
  },
  {
    label: 'Events',
    icon: <MaterialCommunityIcons name="calendar-star" size={20} />,
    id: 'events',
  },
];

const CustomDrawerContent = (props: any) => {
  const [activeItem, setActiveItem] = useState('trending');

  const handlePress = (id: string) => {
    setActiveItem(id);
    
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.helloText}>👋 Hello, User</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, isActive && styles.activeItem]}
              onPress={() => handlePress(item.id)}
            activeOpacity={0.6}>
              <View style={styles.iconWrapper}>
                {React.cloneElement(item.icon, {
                  color: isActive ? '#007bff' : '#333',
                })}
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.push('/(auth)/signup')}
        activeOpacity={0.6}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
  helloText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  menuContainer: {
    flex: 1,
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: '#e6f0ff',
  },
  iconWrapper: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#007bff',
  },
  logoutContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 70,
  },
  logoutText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
