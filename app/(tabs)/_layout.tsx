import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomTabs from '../components/BottomTabs';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default', 
        }}
      >
      </Stack>
      <BottomTabs />
    </View>
  );
}