import { Stack, Tabs } from 'expo-router';
import { View } from 'react-native';
import BottomTabs from '../components/BottomTabs';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'none', // instant switch like Instagram
          lazy: true,        // only load screens when first opened 
        }}
      >
      </Tabs>
      <BottomTabs />
    </View>
  );
}