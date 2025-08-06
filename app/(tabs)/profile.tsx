import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  FlatList,
  Dimensions,
  Modal,
  Platform, // Import Platform for iOS specific safe area handling
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
// Assuming EditProfile is a component in a local file, so we'll keep the import.
// import EditProfile from '../components/EditProfile';
// import { router } from 'expo-router'; // Commented out as router is not defined in this environment
import AntDesign from '@expo/vector-icons/AntDesign'; // Import AntDesign for the adduser icon
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get('window');
const numColumns = 3;
const gridItemMargin = 4;
const gridItemSize = (width - (numColumns + 1) * gridItemMargin) / numColumns;

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Top');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = ['Top', 'Recent', 'Short'];
  // const profileImage = 'https://i.pravatar.cc/100?img=1'; // This variable is not used directly

  // Using public image URLs as local assets are not supported in this environment
  const mediaTop = [
    { id: 1, uri: 'https://picsum.photos/seed/top1/300' },
    { id: 2, uri: 'https://picsum.photos/seed/top2/300' },
    { id: 3, uri: 'https://picsum.photos/seed/top3/300' },
    { id: 4, uri: 'https://picsum.photos/seed/top4/300' },
    { id: 5, uri: 'https://picsum.photos/seed/top5/300' },
    { id: 6, uri: 'https://picsum.photos/seed/top6/300' },
    { id: 7, uri: 'https://picsum.photos/seed/top7/300' },
    { id: 8, uri: 'https://picsum.photos/seed/top8/300' },
    { id: 9, uri: 'https://picsum.photos/seed/top9/300' },
    { id: 10, uri: 'https://picsum.photos/seed/recent1/300' },
  ];
  const mediaRecent = [
    { id: 10, uri: 'https://picsum.photos/seed/recent1/300' },
    { id: 11, uri: 'https://picsum.photos/seed/recent2/300' },
    { id: 12, uri: 'https://picsum.photos/seed/recent3/300' },
  ];
  const mediaShort = [
    { id: 13, uri: 'https://picsum.photos/seed/short1/300' },
    { id: 14, uri: 'https://picsum.photos/seed/short2/300' },
    { id: 15, uri: 'https://picsum.photos/seed/short3/300' },
  ];

  /**
   * Returns media data based on the currently active tab.
   */
  const getMediaByTab = () => {
    switch (activeTab) {
      case 'Recent':
        return mediaRecent;
      case 'Short':
        return mediaShort;
      default:
        return mediaTop;
    }
  };

  /**
   * Handles pull-to-refresh functionality.
   * Simulates data fetching with a timeout.
   */
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  /**
   * Renders a single grid item (image) for the FlatList.
   * @param {object} param0 - Object containing the item to render.
   */
  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItemContainer}
      onPress={() => {
        setSelectedImage(item.uri);
        setModalVisible(true);
      }}
      activeOpacity={0.6}
    >
      <Image source={{ uri: item.uri }} style={styles.gridItem} />
    </TouchableOpacity>
  );

  return (
    // SafeAreaView ensures content is not obscured by device notches/status bars
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cover Image Section */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: 'https://backend.artdomainx.com/media/profiles/canvas_picture/Screenshot_2025-04-19_164918.png' }}
            style={styles.coverImage}
          />
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          {/* Menu Button */}
          <TouchableOpacity style={styles.menuBtn} activeOpacity={0.6}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Info and Buttons */}
        <View style={styles.profileContainer}>
          {/* Avatar and Edit Photo Button */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editPhotoBtn}  activeOpacity={0.6}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>

          {/* Follow and Add Friend Buttons */}
          <View style={styles.buttonRow}>
            {/* Follow Button (Blue) */}
            <TouchableOpacity
              style={styles.followBtn} 
              activeOpacity={0.6}
            >
              <Text style={styles.followText}>Follow</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Add Friends Button (Grey) */}
            <TouchableOpacity
              style={styles.addFriendBtn}
              activeOpacity={0.6}
            >
              <Text style={styles.addFriendText}>Add Friend</Text>
              <AntDesign name="adduser" size={16} color="#374151" /> 
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio and Stats */}
        <View style={styles.bioContainer}>
          <Text style={styles.name}>Selena Gomez</Text>
          <Text style={styles.username}>@salesgomerz</Text>
          <Text style={styles.bio}>
            #fetish out Now {'\n'}
            <Text style={{ color: '#3b82f6' }}>Smartual.it/fetishSG</Text>
          </Text>

          {/* Edit Profile Button (Corrected Position) */}
          <View style={styles.editProfileButtonContainer}>
            <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.6} onPress={() => router.push('/components/EditProfile')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
               <Entypo name="edit" size={16} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <Text><Text style={styles.bold}>1,222</Text> Posts</Text>
            <Text><Text style={styles.bold}>125M</Text> Followers</Text>
            <Text><Text style={styles.bold}>273</Text> Following</Text>
          </View>
        </View>

        {/* Recommendations ScrollView */}
        <ScrollView horizontal style={styles.recommendRow} showsHorizontalScrollIndicator={false}>
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=4' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=5' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=6' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=7' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=8' }} />
        </ScrollView>

        {/* Tabs for media content */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem} activeOpacity={0.6}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Media Grid */}
        <FlatList
          data={getMediaByTab()}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContent}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Home button pressed!')}><Ionicons name="home" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Search button pressed!')}><Ionicons name="search" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('Notifications button pressed!')}><Ionicons name="notifications" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} activeOpacity={0.6} onPress={() => console.log('User Profile button pressed!')}>
          <Text style={styles.userBtnText}>User Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal for full-screen view */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
            activeOpacity={0.6}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1, // Use flexGrow to allow content to expand within ScrollView
  },
  coverContainer: {
    height: 160,
    backgroundColor: '#ccc',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 16, // Adjust top for iOS status bar/notch
    left: 16,
    zIndex: 1, // Ensure button is tappable
  },
  menuBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 16, // Adjust top for iOS status bar/notch
    right: 16,
    zIndex: 1, // Ensure button is tappable
  },
  profileContainer: {
    marginTop: -40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2, // Ensure profile content is above cover
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    // Removed flex: 1 to prevent it from taking full width
  },
  followBtn: {
    backgroundColor: '#4f46e5', // Blue color for Follow button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row', // Arrange text and icon in a row
    alignItems: 'center',
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4, // Space between text and icon
  },
  addFriendBtn: { // Style for Add Friends button
    backgroundColor: '#e5e7eb', // Grey color for Add Friends button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10, // Gap between Follow and Add Friends buttons
    flexDirection: 'row', // Arrange text and icon in a row
    alignItems: 'center',
  },
  addFriendText: {
    color: '#374151',
    fontWeight: '600',
    marginRight: 4, // Space between text and icon
  },
  // New style for the container of the moved Edit Profile button
  editProfileButtonContainer: {
    alignItems: 'flex-end', // Align to start (left)
    paddingHorizontal: 16, // Match padding of bioContainer
    marginTop: -30, // Space below the follow/add friend buttons
  },
  editProfileBtn: { // Reused existing style for the button itself // Blue color for Follow button
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 13,
    borderRadius: 20,
    flexDirection: 'row', // Arrange text and icon in a row
    alignItems: 'center',
    left: 8,
    bottom: 20,
  },
  editProfileText: { // Reused existing style for the button text
    color: '#374151',
    fontWeight: '600',
  },
  bioContainer: {
    paddingHorizontal: 16,
    marginTop: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  username: {
    color: '#6b7280',
    marginTop: 2,
  },
  bio: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingRight: 30, // Keep original padding
  },
  bold: {
    fontWeight: '700',
  },
  recommendRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 14,
  },
  recommendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#f472b6',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabItem: {},
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTab: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  gridContainer: {
    padding: gridItemMargin,
  },
  gridContent: {
    justifyContent: 'space-between',
  },
  gridItemContainer: {
    width: gridItemSize,
    height: gridItemSize,
    marginBottom: gridItemMargin,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: gridItemMargin,
  },
  gridItem: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  userBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  fullScreenImage: {
    width: '95%',
    height: '95%',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // Adjust top for iOS status bar/notch
    right: 20,
  },
});
