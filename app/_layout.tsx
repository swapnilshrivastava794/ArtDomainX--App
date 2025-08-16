import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import { store } from '@store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TokenSync() {
  const auth = useSelector((state: any) => state.auth);
  useEffect(() => {
    const sync = async () => {
      try {
        if (auth?.access) {
          await AsyncStorage.setItem('accessToken', auth.access);
        } else {
          await AsyncStorage.removeItem('accessToken');
        }
      } catch (e) {
        // best effort; avoid crashing
      }
    };
    sync();
  }, [auth?.access]);
  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <TokenSync />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
