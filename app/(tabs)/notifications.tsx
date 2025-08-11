import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  RefreshControl, 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import { getUserNotifications, markNotificationsAsRead } from '../service';

const FILTERS = [
  'all',
  'like',
  'comment',
  'follow',
  'friend request',
  'friend accept',
  'tag',
  'mention',
  'share',
  'post create',
  'event media',
  'event reminder',
  'status change',
  'event create',
  'event response',
];

const NotificationItem = ({ item }) => (
  <View style={styles.notificationCard}>
    <Image
      source={
        item.sender_profile_picture
          ? { uri: `https://backend.artdomainx.com${item.sender_profile_picture}` }
          : require('../../assets/images/profileicon.png') 
      }
      style={styles.avatar}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.username}>{item.sender_username || 'User'}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
    </View>
  </View>
);

const Notifications = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 


  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getUserNotifications();
      const apiNotifications = response?.data?.notifications || [];
      setNotifications(apiNotifications);

      if (apiNotifications.length > 0) {
        const ids = apiNotifications.map((n) => n.id);
        await markNotificationsAsRead(ids);
      }
    } catch (error) {
      console.error('Error loading notifications', error);
    } finally {
      setLoading(false);
      setRefreshing(false); 
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(); 
  }, [fetchNotifications]);

const filteredNotifications =
  selectedFilter === 'all'
    ? notifications
    : notifications.filter((n) => {
        const type = n.notification_type?.toLowerCase().replace(/_/g, ' ').trim();
        const filter = selectedFilter.toLowerCase().replace(/_/g, ' ').trim();
        return type === filter;
      });


  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea1}>
        <ActivityIndicator
          size="large"
          color="#1877F2"
         // style={{ marginTop: verticalScale(100), alignItems: "center", justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Feather
            name="arrow-left-circle"
            size={24}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter
                .replace(/_/g, ' ')
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.fixedHeightListContainer}>
        <FlatList
          data={filteredNotifications}
          renderItem={({ item }) => <NotificationItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => (
            <View style={styles.noNotificationsContainer}>
              <Text style={styles.noNotificationsText}>
                No notifications found for "{selectedFilter}".
              </Text>
            </View>
          )}
         
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1877F2" 
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea1:{
     flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '10%',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  icon: {
    marginRight: scale(10),
    marginTop: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '30%',
    marginTop: verticalScale(20),
    // fontStyle: 'italic',
  },
  filterRow: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  filterButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(14),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(36),
  },
  activeFilterButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  filterText: {
    fontSize: scale(12),
    color: '#333',
    // fontStyle: 'italic',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fixedHeightListContainer: {
    height: scale(600),
  },
  flatListContent: {
    flexGrow: 1,
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: scale(10),
    padding: scale(12),
    marginBottom: verticalScale(12),
    alignItems: 'flex-start',
    gap: scale(10),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderColor: '#EAEAEA',
    borderWidth: 1,
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#ccc',
  },
  username: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#000',
    // fontStyle: 'italic',
  },
  message: {
    fontSize: scale(12),
    color: '#333',
    marginTop: verticalScale(2),
    // fontStyle: 'italic',
  },
  time: {
    fontSize: scale(10),
    color: '#888',
    marginTop: verticalScale(4),
    // fontStyle: 'italic',
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
  noNotificationsText: {
    fontSize: moderateScale(14),
    color: '#999',
  },
});

export default Notifications;