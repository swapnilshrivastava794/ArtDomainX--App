import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';


const FILTERS = ['All', 'Like', 'Comment', 'Follow','Friend Request', 'Friend Accept', 'Tag', 'Mention','Share', 'Post Created', 'Event Media', 'Event Reminder', 'Status Change', 'Event Create', ' Event RSVP'];

const NOTIFICATIONS = [
  {
    id: 1,
    username: 'John',
    message: "Only 2 RSVPs for your event 'Bhaijan' — boost it now to attract more guests!",
    time: '8/2/2025, 12:00:00 PM',
    type: 'RSVP',
    userImage: require('../../assets/top1.jpg'),
  },
  {
    id: 2,
    username: 'sherlen',
    message: "Only 1 RSVPs for your event 'bhaijan 2' — boost it now to attract more guests!",
    time: '8/2/2025, 12:00:00 PM',
    type: 'RSVP',
    userImage: require('../../assets/top1.jpg'),
  },
  {
    id: 3,
    username: 'raj',
    message: 'liked your post.',
    time: '8/2/2025, 11:00:00 AM',
    type: 'Like',
    userImage: require('../../assets/top1.jpg'),
  },
  {
    id: 4,
    username: 'Sam',
    message: 'started following you.',
    time: '8/1/2025, 6:00:00 PM',
    type: 'Follow',
    userImage: require('../../assets/top1.jpg'),
  },
  {
    id: 5,
    username: 'Louisa',
    message: 'commented on your photo.',
    time: '8/1/2025, 3:00:00 PM',
    type: 'Comment',
    userImage: require('../../assets/top1.jpg'),
  },
];

const NotificationItem = ({ item }) => (

  <View style={styles.notificationCard}>
    <Image source={item.userImage} style={styles.avatar} />
    <View style={{ flex: 1 }}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  </View>
);

const Notifications = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredNotifications =
    selectedFilter === 'All'
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) => n.type === selectedFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
        <Feather name="arrow-left-circle" size={24} color="black" style={styles.icon} />
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
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: "10%",
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
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "30%",
    marginTop: verticalScale(20),
   fontStyle: 'italic',
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
    fontStyle: 'italic',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1, 
    paddingHorizontal: scale(12),
    height: scale(600),
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
  },
  username: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#000',
    fontStyle: "italic",
  },
  message: {
    fontSize: scale(12),
    color: '#333',
    marginTop: verticalScale(2),
     fontStyle: 'italic',
  },
  time: {
    fontSize: scale(10),
    color: '#888',
    marginTop: verticalScale(4),
    fontStyle: "italic",
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