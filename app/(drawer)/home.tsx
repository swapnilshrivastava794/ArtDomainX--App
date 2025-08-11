// app/(drawer)/home.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Welcome to Home</Text>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
    </View>
  );
}
