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
  RefreshControl, // Import RefreshControl
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import { getUserNotifications, markNotificationsAsRead } from '@app/service';

interface UserNotification {
  id: number;
  sender_profile_picture?: string | null;
  sender_username?: string | null;
  message: string;
  created_at: string | number | Date;
  notification_type?: string | null;
}

const FILTERS = [
  'all',
  'like',
  'comment',
  'follow',
  'friend_request',
  'friend_accept',
  'tag',
  'mention',
  'share',
  'post_create',
  'event_media',
  'event_reminder',
  'status change',
  'event create',
  'event rsvp',
  'mentor eligibility',
];

const NotificationItem = ({ item }: { item: UserNotification }) => (
  <View style={styles.notificationCard}>
    <Image
      source={
        item.sender_profile_picture
          ? { uri: `https://backend.artdomainx.com${item.sender_profile_picture}` }
          : require('../../assets/images/profile.png') 
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
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 


  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getUserNotifications();
      const apiNotifications = (response?.data?.notifications || []) as UserNotification[];
      setNotifications(apiNotifications);

      if (apiNotifications.length > 0) {
        const ids = apiNotifications.map((n: UserNotification) => n.id);
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

  const filteredNotifications: UserNotification[] =
    selectedFilter === 'all'
      ? notifications
      : notifications.filter((n: UserNotification) => (n.notification_type || '').toLowerCase() === selectedFilter.toLowerCase());

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea1}>
        <ActivityIndicator
          size="large"
          color="#030dff"
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
            color="#030dff"
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
          // Add these props for pull-to-refresh
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#030dff" // Optional: customize the spinner color
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(14),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(36),
  },
  activeFilterButton: {
    backgroundColor: '#030dff',
    borderColor: '#030dff',
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
    borderColor: '#E5E7EB',
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