// frontend/components/customdrawer.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.helloText}>👋 Hello, User</Text>
      </View>

      <View style={styles.menuContainer}>
        <DrawerItem
          label="Trending Posts"
          icon={<Ionicons name="flame" size={22} color="#FF5733" />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Circle"
          icon={<FontAwesome5 name="users" size={20} color="#4A90E2" />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Guild"
          icon={<MaterialCommunityIcons name="shield-account" size={22} color="#9C27B0" />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Messages"
          icon={<Ionicons name="chatbubble-ellipses" size={22} color="#03A9F4" />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Events"
          icon={<MaterialCommunityIcons name="calendar-star" size={22} color="#FF9800" />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => props.navigation.navigate('login')}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerItem = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    {icon}
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    bottom: 30,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
