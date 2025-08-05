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
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
// Assuming EditProfile is a component in a local file, so we'll keep the import.
// import EditProfile from '../components/EditProfile';
import { router } from 'expo-router';

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
  const profileImage = 'https://i.pravatar.cc/100?img=1';

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

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItemContainer}
      onPress={() => {
        setSelectedImage(item.uri);
        setModalVisible(true);
      }}
    activeOpacity={0.6}>
      <Image source={{ uri: item.uri }} style={styles.gridItem} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: 'https://backend.artdomainx.com/media/profiles/canvas_picture/Screenshot_2025-04-19_164918.png' }}
            style={styles.coverImage}
          />
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={24} color="white"/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} activeOpacity={0.6}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Info and Buttons */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editPhotoBtn} onPress={() => console.log('Edit photo')} activeOpacity={0.6}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
          {/* Moved the Follow and Edit Profile buttons here for better visual grouping */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.followBtn} activeOpacity={0.6}>
              <Text style={styles.followText}>Follow</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/components/EditProfile')} activeOpacity={0.6}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.name}>Selena Gomez</Text>
          <Text style={styles.username}>@salesgomerz</Text>
          <Text style={styles.bio}>
            #fetish out Now {'\n'}
            <Text style={{ color: '#3b82f6' }}>Smartual.it/fetishSG</Text>
          </Text>

          <View style={styles.stats}>
            <Text><Text style={styles.bold}>1,222</Text> Posts</Text>
            <Text><Text style={styles.bold}>125M</Text> Followers</Text>
            <Text><Text style={styles.bold}>273</Text> Following</Text>
          </View>
        </View>

        {/* Recommendations */}
        <ScrollView horizontal style={styles.recommendRow} showsHorizontalScrollIndicator={false}>
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=4' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=5' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=6' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=7' }} />
          <Image style={styles.recommendAvatar} source={{ uri: 'https://i.pravatar.cc/100?img=8' }} />
        </ScrollView>
        {/* The old location of the button is now removed */}

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem} activeOpacity={0.6}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <FlatList
          data={getMediaByTab()}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContent}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.6}><Ionicons name="home" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}><Ionicons name="search" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}><Ionicons name="notifications" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} activeOpacity={0.6}>
          <Text style={styles.userBtnText}>User Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
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
          activeOpacity={0.6}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },

  coverContainer: { height: 160, backgroundColor: '#ccc' },
  coverImage: { width: '100%', height: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backBtn: { position: 'absolute', top: 16, left: 16 },
  menuBtn: { position: 'absolute', top: 16, right: 16 },

  profileContainer: {
    marginTop: -40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff' },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, // Add some top margin to separate it from the avatar
  },
  followBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followText: { color: '#fff', fontWeight: '600', marginRight: 4 },
  editProfileBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10, // Add some space between the two buttons
  },
  editProfileText: {
    color: '#374151',
    fontWeight: '600',
  },

  bioContainer: { paddingHorizontal: 16, marginTop: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#111' },
  username: { color: '#6b7280', marginTop: 2 },
  bio: { marginTop: 6, fontSize: 13, lineHeight: 18 },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingRight: 30,
  },
  bold: { fontWeight: '700' },

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
  tabText: { fontSize: 14, color: '#6b7280' },
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

  // Modal styles
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
    top: 50,
    right: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
  },
});
