import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  FlatList,
  Dimensions,
  Modal,
  Platform,
  ActivityIndicator,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import {
  fetchUserProfile,
  fetchCanvasImage,
  uploadCanvasImage,
  fetchPinnedPost,
  deletePost,
  pinPost,
  fetchAllPosts,
} from '../service';

const BASE_URL = 'https://backend.artdomainx.com';
const { width } = Dimensions.get('window');
const numColumns = 3;
const gridItemMargin = 4;
const gridItemSize = (width - (numColumns + 1) * gridItemMargin) / numColumns;

const ProfileScreen = () => {
  const { userId: paramUserId } = useLocalSearchParams(); 
  const [activeTab, setActiveTab] = useState('All Posts');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [canvasImage, setCanvasImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loggedInProfileId = useSelector((state) => state.auth.profile_id); 
  const profileIdToFetch = paramUserId || loggedInProfileId;
  const tabs = ['All Posts', 'Pinned'];
  const isOwnProfile = loggedInProfileId === profileIdToFetch;

  const fetchData = async () => {
    if (!profileIdToFetch) {
      setLoading(false);
      setError('No profile ID available to fetch data.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userProfileResponse = await fetchUserProfile(profileIdToFetch);
      setUserProfile(userProfileResponse?.data?.data || null);

      const canvasResponse = await fetchCanvasImage(profileIdToFetch);
      if (canvasResponse?.data?.data?.[0]?.image) {
        setCanvasImage(`${BASE_URL}${canvasResponse.data.data[0].image}`);
      } else {
        setCanvasImage('https://picsum.photos/seed/cover/300');
      }

      const allPostsResponse = await fetchAllPosts();
      const userPosts = (allPostsResponse?.data?.data || []).filter(
        post => post.created_by === profileIdToFetch
      );
      setPosts(userPosts);

      const pinnedPostsResponse = await fetchPinnedPost(profileIdToFetch);
      setPinnedPosts(pinnedPostsResponse?.data?.data || []);
    } catch (e) {
      console.error('Error fetching profile data:', e);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (profileIdToFetch) fetchData();
  }, [profileIdToFetch]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePinPost = async (postId, isPinned) => {
    try {
      await pinPost(postId, !isPinned);
      Alert.alert('Success', `Post has been ${isPinned ? 'unpinned' : 'pinned'}.`);
      fetchData();
    } catch (e) {
      console.error('Error pinning post:', e);
      Alert.alert('Error', 'Failed to pin post. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await deletePost(postId);
              Alert.alert('Success', 'Post has been deleted.');
              fetchData();
            } catch (e) {
              console.error('Error deleting post:', e);
              Alert.alert('Error', 'Failed to delete post.');
            }
        }},
      ]
    );
  };

  const showPostActions = (post) => {
    const isPinned = post.is_pinned;
    const actionOptions = [
      isPinned ? 'Unpin Post' : 'Pin Post',
      'Delete Post',
      'Cancel',
    ];
    const isOwner = userProfile?.id === post.created_by; 
    if (!isOwner) {
      Alert.alert('Access Denied', 'You do not have permission to perform this action.');
      return;
    }
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: actionOptions,
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) handlePinPost(post.id, isPinned);
          else if (buttonIndex === 1) handleDeletePost(post.id);
        }
      );
    } else {
      Alert.alert(
        'Post Options', '',
        [
          { text: actionOptions[0], onPress: () => handlePinPost(post.id, isPinned) },
          { text: actionOptions[1], onPress: () => handleDeletePost(post.id), style: 'destructive' },
          { text: actionOptions[2], style: 'cancel' },
        ]
      );
    }
  };

  const renderGridItem = ({ item }) => {
    const mediaUrl = (Array.isArray(item.media) && item.media[0]?.file)
      ? item.media[0].file
      : 'https://placehold.co/300x300?text=No+Image';
    return (
      <TouchableOpacity
        style={styles.gridItemContainer}
        onPress={() => { setSelectedImage(mediaUrl); setModalVisible(true); }}
        onLongPress={() => showPostActions(item)}
      >
        <Image source={{ uri: mediaUrl }} style={styles.gridItem} />
        {item.is_pinned && (
          <View style={styles.pinnedIcon}>
            <MaterialCommunityIcons name="pin" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleUploadCanvasImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to the media library.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const selectedAsset = result.assets[0];
      const formData = new FormData();
      formData.append('canvas_picture', {
        uri: selectedAsset.uri,
        name: selectedAsset.fileName || 'canvas_image.jpg',
        type: selectedAsset.mimeType || 'image/jpeg',
      });
      try {
        await uploadCanvasImage(formData);
        Alert.alert('Success', 'Cover image uploaded successfully!');
        fetchData();
      } catch (e) {
        console.error('Error uploading canvas image:', e);
        Alert.alert('Error', 'Failed to upload canvas image.');
      }
    }
  };

  const getMediaByTab = () => activeTab === 'Pinned' ? pinnedPosts : posts;

  if (loading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator size="large" color="#4f46e5" /></View>;
  }
  if (error) {
    return <View style={[styles.container, styles.center]}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const ListHeader = () => (
    <>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: canvasImage }} style={styles.coverImage} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: userProfile?.profile_picture || 'https://i.pravatar.cc/100' }} style={styles.avatar}/>
          {isOwnProfile && (
            <TouchableOpacity style={styles.editPhotoBtn} onPress={handleUploadCanvasImage}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Conditional Buttons */}
        <View style={styles.buttonRow}>
          {isOwnProfile ? (
            <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/components/EditProfile')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
              <Entypo name="edit" size={16} color="black" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFriendBtn}>
                <Text style={styles.addFriendText}>Add Friend</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        <Text style={styles.name}>{userProfile?.username}</Text>
        <Text style={styles.username}>@{userProfile?.username}</Text>
        <Text style={styles.bio}>{userProfile?.bio || 'No bio available.'}</Text>
        <View style={styles.stats}>
          <Text><Text style={styles.bold}>{userProfile?.total_posts_count || 0}</Text> Posts</Text>
          <Text><Text style={styles.bold}>{userProfile?.followers_count || 0}</Text> Followers</Text>
          <Text><Text style={styles.bold}>{userProfile?.following_count || 0}</Text> Following</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={getMediaByTab()}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContent}
        ListHeaderComponent={ListHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      {/* Modal Image */}
      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <Image source={{ uri: selectedImage || 'https://placehold.co/600x400' }} style={styles.fullScreenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
  center: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  coverContainer: { height: 160 },
  coverImage: { width: '100%', height: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  backBtn: { position: 'absolute', top: 40, left: 16, zIndex: 1 },
  menuBtn: { position: 'absolute', top: 40, right: 16, zIndex: 1 },
  profileContainer: { marginTop: -40, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' },
  avatarWrapper: { position: 'relative', marginRight: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff' },
  editPhotoBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 50, padding: 2 },
  buttonRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  followBtn: { backgroundColor: '#4f46e5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  followText: { color: '#fff', fontWeight: '600', marginRight: 4 },
  addFriendBtn: { backgroundColor: '#e5e7eb', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginLeft: 10, flexDirection: 'row', alignItems: 'center' },
  addFriendText: { color: '#374151', fontWeight: '600' },
  editProfileBtn: { backgroundColor: '#e5e7eb', padding: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  editProfileText: { color: '#374151', fontWeight: '600', marginRight: 5 },
  bioContainer: { paddingHorizontal: 16, marginTop: 15 },
  name: { fontSize: 18, fontWeight: '700', color: '#111' },
  username: { color: '#6b7280', marginTop: 2 },
  bio: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingRight: 30 },
  bold: { fontWeight: '700' },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e5e7eb' },
  tabText: { fontSize: 14, color: '#6b7280' },
  activeTab: { color: '#4f46e5', fontWeight: '600', textDecorationLine: 'underline' },
  gridContent: { padding: gridItemMargin },
  gridItemContainer: { width: gridItemSize, height: gridItemSize, margin: gridItemMargin, borderRadius: 10, overflow: 'hidden' },
  gridItem: { width: '100%', height: '100%' },
  pinnedIcon: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 3 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)' },
  fullScreenImage: { width: '95%', height: '95%' },
  closeButton: { position: 'absolute', top: 50, right: 20 }
});
