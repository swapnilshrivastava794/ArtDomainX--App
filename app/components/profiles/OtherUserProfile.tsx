import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { 
  getUserProfile, 
  getUserPosts, 
  followUser, 
  unfollowUser 
} from '../../service';
import constant from '../../constant';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const numColumns = 3;
const gridItemMargin = 2;
const gridItemSize = (width - (numColumns + 1) * gridItemMargin) / numColumns;

interface ProfileData {
  id: number;
  username: string;
  name: string;
  bio: string;
  profile_picture: string;
  cover_image: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
  website: string;
  location: string;
  is_following: boolean;
  is_private: boolean;
  mutual_followers_count: number;
}

interface Post {
  id: number;
  title: string;
  media: Array<{ file: string }>;
  created_at: string;
  reaction_count: number;
  comment_count: number;
}

const OtherUserProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const currentUser = useSelector((state: any) => state.auth);
  
  // Get userId from params
  const userId = params.userId as string;
  
  // State
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('Posts');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const tabs = ['Posts', 'Tagged'];

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      const response = await getUserProfile(userId);
      const profile = response; // service already returns response.data
      setProfileData(profile);
      setIsFollowing(profile.is_following);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  }, [userId]);

  // Fetch user posts
  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await getUserPosts(userId);
      const fetchedPosts = response || [];
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [userId]);

  // Initial data load
  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchProfileData(), fetchUserPosts()]);
        setLoading(false);
      };
      loadData();
    }
  }, [userId, fetchProfileData, fetchUserPosts]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchProfileData(), fetchUserPosts()]);
    setRefreshing(false);
  }, [fetchProfileData, fetchUserPosts]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!profileData) return;
    
    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        setProfileData(prev => prev ? {
          ...prev,
          followers_count: prev.followers_count - 1,
          is_following: false
        } : null);
      } else {
        await followUser(userId);
        setIsFollowing(true);
        setProfileData(prev => prev ? {
          ...prev,
          followers_count: prev.followers_count + 1,
          is_following: true
        } : null);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle share profile
  const handleShareProfile = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${profileData?.name}'s profile on ArtDomainX!`,
        url: `https://artdomainx.com/profile/${userId}`,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  // Handle message user
  const handleMessage = () => {
    // Navigate to chat screen
    router.push(`/(chat)/${userId}`);
  };

  // Render grid item
  const renderGridItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.gridItemContainer}
      onPress={() => {
        const imageUrl = item.media?.[0]?.file;
        if (imageUrl) {
          setSelectedImage(imageUrl);
          setModalVisible(true);
        }
      }}
    >
      <Image 
        source={{ 
          uri: item.media?.[0]?.file || 'https://via.placeholder.com/300' 
        }} 
        style={styles.gridItem} 
      />
      <View style={styles.gridOverlay}>
        <View style={styles.gridStats}>
          <Ionicons name="heart" size={14} color="white" />
          <Text style={styles.gridStatText}>{item.reaction_count}</Text>
          <Ionicons name="chatbubble" size={14} color="white" />
          <Text style={styles.gridStatText}>{item.comment_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Handle report user
  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Are you sure you want to report this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            // Handle report logic
            Alert.alert('Reported', 'User has been reported successfully');
          }
        }
      ]
    );
  };

  // Handle block user
  const handleBlock = () => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive',
          onPress: () => {
            // Handle block logic
            Alert.alert('Blocked', 'User has been blocked successfully');
            router.back();
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>Profile not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{profileData.username}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShareProfile}>
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => {
                Alert.alert(
                  'More Options',
                  'Choose an action',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Report', onPress: handleReport },
                    { text: 'Block', onPress: handleBlock, style: 'destructive' }
                  ]
                );
              }}
            >
              <Feather name="more-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri: profileData.cover_image
                ? `${constant.DemoImageURl}${profileData.cover_image}`
                : 'https://via.placeholder.com/400x200'
            }}
            style={styles.coverImage}
          />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profileData.profile_picture
                  ? `${constant.DemoImageURl}${profileData.profile_picture}`
                  : 'https://via.placeholder.com/100'
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{profileData.name}</Text>
              {profileData.is_verified && (
                <MaterialCommunityIcons name="check-decagram" size={20} color="#4f46e5" />
              )}
              {profileData.is_private && (
                <Ionicons name="lock-closed" size={16} color="#666" style={{ marginLeft: 8 }} />
              )}
            </View>
            <Text style={styles.username}>@{profileData.username}</Text>
            
            {profileData.bio && (
              <Text style={styles.bio}>{profileData.bio}</Text>
            )}

            {profileData.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{profileData.location}</Text>
              </View>
            )}

            {profileData.website && (
              <TouchableOpacity style={styles.websiteContainer}>
                <Ionicons name="link-outline" size={16} color="#4f46e5" />
                <Text style={styles.websiteText}>{profileData.website}</Text>
              </TouchableOpacity>
            )}

            {/* Mutual followers */}
            {profileData.mutual_followers_count > 0 && (
              <Text style={styles.mutualText}>
                Followed by {profileData.mutual_followers_count} people you follow
              </Text>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.posts_count}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.followers_count}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.following_count}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.followBtn,
              isFollowing ? styles.followingBtn : styles.notFollowingBtn
            ]}
            onPress={handleFollowToggle}
            disabled={followLoading}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color={isFollowing ? "#666" : "#fff"} />
            ) : (
              <Text style={[
                styles.followText,
                isFollowing ? styles.followingText : styles.notFollowingText
              ]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.messageBtn}
            onPress={handleMessage}
          >
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts Grid */}
        {activeTab === 'Posts' && (
          profileData.is_private && !isFollowing ? (
            <View style={styles.privateContainer}>
              <Ionicons name="lock-closed" size={48} color="#ccc" />
              <Text style={styles.privateText}>This account is private</Text>
              <Text style={styles.privateSubtext}>Follow to see their posts</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderGridItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Ionicons name="images-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>No posts yet</Text>
                </View>
              )}
            />
          )
        )}

        {activeTab === 'Tagged' && (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="pricetag-outline" size={48} color="#ccc" />
            <Text style={styles.comingSoonText}>No tagged posts</Text>
          </View>
        )}
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <Image 
            source={{ uri: selectedImage || '' }} 
            style={styles.fullScreenImage} 
            resizeMode="contain" 
          />
          <TouchableOpacity
            style={styles.closeImageBtn}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginLeft: 16,
  },
  coverContainer: {
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -50,
  },
  avatarContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileInfo: {
    marginTop: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  websiteText: {
    fontSize: 14,
    color: '#4f46e5',
    marginLeft: 4,
  },
  mutualText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  followBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFollowingBtn: {
    backgroundColor: '#4f46e5',
  },
  followingBtn: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  followText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notFollowingText: {
    color: '#fff',
  },
  followingText: {
    color: '#666',
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  gridContent: {
    padding: gridItemMargin,
  },
  gridItemContainer: {
    width: gridItemSize,
    height: gridItemSize,
    marginRight: gridItemMargin,
    marginBottom: gridItemMargin,
    position: 'relative',
  },
  gridItem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  gridStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  privateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  privateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  privateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  imageModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  fullScreenImage: {
    width: '95%',
    height: '95%',
  },
  closeImageBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default OtherUserProfile;
