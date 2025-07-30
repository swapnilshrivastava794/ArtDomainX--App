// app/(tabs)/_layout.tsx
import { Slot } from 'expo-router';
import { View } from 'react-native';
import BottomTabs from '../components/BottomTabs';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <BottomTabs />
    </View>
  );
}
