// app/(tabs)/_layout.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import BottomTabs from '../components/BottomTabs';
import CustomDrawerContent from '../components/customdrawer'; // <- Make sure this file exists

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerPosition: 'left',
           drawerStyle: {
          width: '70%', 
        },
        }}
      >
        {/* This screen holds your BottomTabs UI (always visible) */}
        <Drawer.Screen name="index" options={{ title: 'Home' }} />
      </Drawer>

      {/* Bottom Tabs stay fixed at bottom */}
      <BottomTabs />
    </View>
  );
}
