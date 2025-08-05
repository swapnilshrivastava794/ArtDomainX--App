// components/BottomTabs.tsx
import { View, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (path) => pathname === path;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 20, // extra space for gesture nav
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 7,
        width: '100%',
        zIndex: 10,

      }}
    >
      <TouchableOpacity onPress={() => router.push('/home')}>
        <Ionicons name="home" size={24} color={isActive('/home') ? 'blue' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/notifications')}>
        <Ionicons name="notifications" size={24} color={isActive('/notifications') ? 'blue' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/explore')}>
        <MaterialIcons name="message" size={24} color={isActive('/explore') ? 'blue' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Ionicons name="person" size={24} color={isActive('/profile') ? 'blue' : 'gray'} />
      </TouchableOpacity>
    </View>
  );
}
