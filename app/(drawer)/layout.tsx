// app/(drawer)/layout.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Slot } from 'expo-router';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="home" component={Slot} />
    </Drawer.Navigator>
  );
}
