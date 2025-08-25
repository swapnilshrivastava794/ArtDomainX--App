import React, { useState , useEffect  } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import EditProfile from './EditProfile';
import { getUserProfile, getUserPosts } from '@app/service';
import constant from '@app/constant';
import { RootState } from '@/app/store';

const { width, height } = Dimensions.get('window');
const numColumns = 2;
const gridItemMargin = 8;
const gridItemSize = (width - (numColumns + 1) * gridItemMargin * 2) / numColumns;

// Default fallback data
const defaultUser = {
  username: 'user',
  name: 'User Name',
  title: 'Artist & Creator',
  bio: 'Welcome to my profile!',
  location: 'Location',
  website: 'website.com',
  profile_picture: 'https://i.pravatar.cc/200?img=1',
  banner_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
  artworks_count: 0,
  followers_count: 0,
  following_count: 0,
  likes_count: 0,
  is_verified: false,
  is_pro: false,
};

const SelfProfile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Artworks');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [showBannerOptions, setShowBannerOptions] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(defaultUser);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const profileId = useSelector((state: RootState) => state?.auth?.profile_id);

  const tabs = [
    { name: 'Artworks', icon: 'grid', count: currentUserData.artworks_count || 0 },
    { name: 'Collections', icon: 'folder', count: 0 },
    { name: 'Liked', icon: 'heart', count: 0 },
  ];

  const handleSaveProfile = (updatedData: any) => {
    setCurrentUserData(prev => ({ ...prev, ...updatedData }));
    console.log('Profile updated:', updatedData);
  };

  // Helper function to resolve image URLs
  const resolveImageUrl = (url?: string | null) => {
    if (!url) return defaultUser.profile_picture;
    if (/^https?:\/\//.test(url)) return url;
    return `${constant.DemoImageURl}${url}`;
  };

  // Fetch current user profile
  // const fetchUserProfile = async () => {
  //   try {
  //     setError(null);
  //     const data = await getCurrentUserProfile();
  //     console.log('Profile data:', data);

  //     const profileData = {
  //       username: data?.username || defaultUser.username,
  //       name: data?.name || data?.username || defaultUser.name,
  //       title: data?.title || defaultUser.title,
  //       bio: data?.bio || defaultUser.bio,
  //       location: data?.location || defaultUser.location,
  //       website: data?.website_url || defaultUser.website,
  //       profile_picture: resolveImageUrl(data?.profile_picture),
  //       banner_image: resolveImageUrl(data?.cover_picture) || defaultUser.banner_image,
  //       artworks_count: data?.total_posts_count || 0,
  //       followers_count: data?.followers_count || 0,
  //       following_count: data?.following_count || 0,
  //       likes_count: data?.likes_count || 0,
  //       is_verified: Boolean(data?.is_verified),
  //       is_pro: Boolean(data?.is_pro),
  //     };
      
  //     setCurrentUserData(profileData);
  //   } catch (error: any) {
  //     console.error('Failed to load profile:', error);
  //     setError(error?.message || 'Failed to load profile');
  //   }
  // };

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!profileId) return;
    
    try {
      setPostsLoading(true);
      const response = await getUserPosts(profileId);
      console.log('User posts:', response);
      
      const posts = response?.results || [];
      const formattedPosts = posts.map((post: any, index: number) => ({
        id: post.id || index,
        title: post.title || 'Untitled',
        image: resolveImageUrl(post.image || post.media_files?.[0]?.file),
        likes: post.likes_count || 0,
        views: post.views_count || 0,
        price: post.price ? `$${post.price}` : 'N/A',
        category: post.category || 'Art',
        description: post.description || '',
      }));
      
      setUserPosts(formattedPosts);
    } catch (error: any) {
      console.error('Failed to load posts:', error);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        // fetchUserProfile(),
        fetchUserPosts()
      ]);
      setLoading(false);
    };
    
    if (profileId) {
      loadData();
    }
  }, [profileId]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      // fetchUserProfile(),
      fetchUserPosts()
    ]);
    setRefreshing(false);
  };

  // Render artwork grid item
  const renderArtworkItem = ({ item, index }: { item: any; index: number }) => {
    const isLarge = index % 3 === 0;
    return (
      <TouchableOpacity
        style={[
          styles.artworkContainer,
          isLarge ? styles.artworkLarge : styles.artworkSmall
        ]}
        onPress={() => {
          setSelectedArtwork(item);
          setModalVisible(true);
        }}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.artworkImage}
          defaultSource={{ uri: defaultUser.profile_picture }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.artworkGradient}
        >
          <View style={styles.artworkInfo}>
            <Text style={styles.artworkTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.artworkStats}>
              <View style={styles.statGroup}>
                <AntDesign name="heart" size={12} color="#ff4757" />
                <Text style={styles.statText}>{item.likes}</Text>
              </View>
              <View style={styles.statGroup}>
                <Feather name="eye" size={12} color="white" />
                <Text style={styles.statText}>{item.views}</Text>
              </View>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#030dff" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !currentUserData.username) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#ff4757" />
          <Text style={styles.errorTitle}>Failed to Load Profile</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              // fetchUserProfile().finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#030dff']}
          />
        }
      >
        {/* Header with Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: currentUserData.banner_image }}
            style={styles.bannerImage}
            defaultSource={{ uri: defaultUser.banner_image }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.bannerGradient}
          />
          
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Feather name="more-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Banner Edit Button */}
          <TouchableOpacity 
            style={styles.editBannerBtn}
            onPress={() => setShowBannerOptions(true)}
          >
            <Feather name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: currentUserData.profile_picture }}
                style={styles.avatar}
                defaultSource={{ uri: defaultUser.profile_picture }}
              />
              {currentUserData.is_pro && (
                <LinearGradient
                  colors={['#030dff', '#6BA3F5', '#8AB8F7']}
                  style={styles.proRing}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Feather name="edit-2" size={12} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{currentUserData.name}</Text>
              {currentUserData.is_verified && (
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={18} color="#030dff" />
                </View>
              )}
              {currentUserData.is_pro && (
                <View style={styles.proBadge}>
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.username}>@{currentUserData.username}</Text>
            <Text style={styles.title}>{currentUserData.title}</Text>
            <Text style={styles.bio}>{currentUserData.bio}</Text>
            
            {currentUserData.location && (
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color="#666" />
                <Text style={styles.location}>{currentUserData.location}</Text>
              </View>
            )}
            
            {currentUserData.website && (
              <TouchableOpacity style={styles.websiteRow}>
                <Feather name="link" size={14} color="#030dff" />
                <Text style={styles.website}>{currentUserData.website}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentUserData.artworks_count}</Text>
              <Text style={styles.statLabel}>Artworks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentUserData.followers_count.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentUserData.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentUserData.likes_count.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => setShowEditProfile(true)}
            >
              <LinearGradient
                colors={['#030dff', '#6BA3F5']}
                style={styles.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="edit" size={16} color="white" />
                <Text style={styles.primaryBtnText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryBtn}>
              <Feather name="share" size={16} color="#666" />
              <Text style={styles.secondaryBtnText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="bookmark" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabs}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => setActiveTab(tab.name)}
                  style={[
                    styles.tab,
                    activeTab === tab.name && styles.activeTab
                  ]}
                >
                  <Feather 
                    name={tab.icon as any} 
                    size={18} 
                    color={activeTab === tab.name ? '#030dff' : '#999'} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.name && styles.activeTabText
                  ]}>
                    {tab.name}
                  </Text>
                  <View style={[
                    styles.tabBadge,
                    activeTab === tab.name && styles.activeTabBadge
                  ]}>
                    <Text style={[
                      styles.tabBadgeText,
                      activeTab === tab.name && styles.activeTabBadgeText
                    ]}>
                      {tab.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Artworks Grid */}
        {activeTab === 'Artworks' && (
          <View style={styles.artworksContainer}>
            {postsLoading ? (
              <View style={styles.postsLoadingContainer}>
                <ActivityIndicator size="large" color="#030dff" />
                <Text style={styles.loadingText}>Loading artworks...</Text>
              </View>
            ) : userPosts.length > 0 ? (
              <FlatList
                data={userPosts}
                renderItem={renderArtworkItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                scrollEnabled={false}
                contentContainerStyle={styles.artworksGrid}
                columnWrapperStyle={styles.artworkRow}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Feather name="image" size={48} color="#ddd" />
                </View>
                <Text style={styles.emptyTitle}>No Artworks Yet</Text>
                <Text style={styles.emptyText}>Start creating and sharing your art!</Text>
              </View>
            )}
          </View>
        )}

        {activeTab !== 'Artworks' && (
          <View style={styles.comingSoonContainer}>
            <View style={styles.comingSoonIcon}>
              <Feather name="image" size={48} color="#ddd" />
            </View>
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            <Text style={styles.comingSoonText}>This section is under development</Text>
          </View>
        )}
      </ScrollView>

      {/* Enhanced Artwork Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedArtwork?.title}</Text>
            <TouchableOpacity style={styles.moreBtn}>
              <Feather name="more-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Image 
              source={{ uri: selectedArtwork?.image || '' }} 
              style={styles.modalImage} 
              resizeMode="contain" 
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.modalInfo}
            >
              <View style={styles.modalStats}>
                <View style={styles.modalStatGroup}>
                  <AntDesign name="heart" size={16} color="#ff4757" />
                  <Text style={styles.modalStatText}>{selectedArtwork?.likes}</Text>
                </View>
                <View style={styles.modalStatGroup}>
                  <Feather name="eye" size={16} color="white" />
                  <Text style={styles.modalStatText}>{selectedArtwork?.views}</Text>
                </View>
                <View style={styles.modalPriceContainer}>
                  <Text style={styles.modalPrice}>{selectedArtwork?.price}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Banner Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBannerOptions}
        onRequestClose={() => setShowBannerOptions(false)}
      >
        <View style={styles.optionsModal}>
          <View style={styles.optionsContent}>
            <Text style={styles.optionsTitle}>Change Banner</Text>
            <TouchableOpacity style={styles.optionItem}>
              <Feather name="camera" size={20} color="#333" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Feather name="image" size={20} color="#333" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem}>
              <Feather name="trash-2" size={20} color="#ff4757" />
              <Text style={[styles.optionText, { color: '#ff4757' }]}>Remove Banner</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelOption}
              onPress={() => setShowBannerOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <EditProfile
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentUser={currentUserData}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  
  // Banner Section
  bannerContainer: {
    height: 220,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  headerControls: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBannerBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Profile Section
  profileSection: {
    backgroundColor: 'white',
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  proRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 112,
    height: 112,
    borderRadius: 56,
    zIndex: -1,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Profile Info
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginRight: 8,
  },
  verifiedBadge: {
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: '#030dff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  username: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '600',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#5a6c7d',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  website: {
    fontSize: 13,
    color: '#030dff',
    marginLeft: 6,
    fontWeight: '500',
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  iconBtn: {
    width: 46,
    height: 46,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Enhanced Tabs
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#030dff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginLeft: 6,
    marginRight: 8,
  },
  activeTabText: {
    color: 'white',
  },
  tabBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  activeTabBadgeText: {
    color: 'white',
  },
  
  // Artworks Grid
  artworksContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 16,
  },
  artworksGrid: {
    paddingHorizontal: 16,
  },
  artworkRow: {
    justifyContent: 'space-between',
  },
  artworkContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  artworkSmall: {
    width: gridItemSize,
    height: gridItemSize * 1.2,
  },
  artworkLarge: {
    width: gridItemSize,
    height: gridItemSize * 1.5,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  artworkGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  artworkInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  artworkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  artworkStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 11,
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 12,
    color: '#030dff',
    fontWeight: '700',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  
  // Coming Soon
  comingSoonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: '#f8f9fa',
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#999',
  },
  
  // Enhanced Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalStatGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  modalStatText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  modalPriceContainer: {
    backgroundColor: '#030dff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalPrice: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
  },
  
  // Banner Options Modal
  optionsModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionsContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  cancelOption: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#030dff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  
  // Posts Loading
  postsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SelfProfile;
