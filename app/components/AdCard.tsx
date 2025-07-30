import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdCard = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Sponsored</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Ionicons name="close" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507',
        }}
        style={styles.image}
      />
    </View>
  );
};

export default AdCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: '#111827',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
});
