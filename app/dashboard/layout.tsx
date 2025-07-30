import React from 'react';
import { View, StyleSheet } from 'react-native';

// This wraps all routes inside /dashboard/
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* You can add a header, sidebar, etc., here if needed */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
