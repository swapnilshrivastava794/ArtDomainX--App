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
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import EditProfile from './EditProfile';
import { RootState } from '../../store'; // adjust path if needed



const { width, height } = Dimensions.get('window');
const numColumns = 2;
const gridItemMargin = 8;
const gridItemSize = (width - (numColumns + 1) * gridItemMargin * 2) / numColumns;

  const auth = useSelector((state: RootState) => state.auth);
    useEffect(() => {
    console.log('Auth state from Redux:', auth);
  }, [auth]);

  // Debug log when data changes




// Hardcoded profile data (Blue theme)
const mockUser = {
  username: 'artcreatrix',
  name: 'Elena Martinez',
  title: 'Digital Artist & Creator',
  bio: '✨ Creating magic through pixels\n🎨 Abstract & Contemporary Art\n🌟 Inspiring creativity worldwide',
  location: 'San Francisco, CA',
  website: 'elenacreates.com',
  profile_picture: 'https://i.pravatar.cc/200?img=1',
  banner_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=300&fit=crop',
  artworks_count: 247,
  followers_count: 15280,
  following_count: 892,
  likes_count: 52400,
  is_verified: true,
  is_pro: true,
};

// Hardcoded artwork posts (Creative grid)
const mockArtworks = [
  {
    id: 1,
    title: 'Sunset Dreams',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
    likes: 1245,
    views: 8900,
    price: '$250',
    category: 'Abstract',
  },
  {
    id: 2,
    title: 'Ocean Waves',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    likes: 890,
    views: 5600,
    price: '$180',
    category: 'Nature',
  },
  {
    id: 3,
    title: 'Urban Jungle',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop',
    likes: 2100,
    views: 12300,
    price: '$320',
    category: 'Digital',
  },
  {
    id: 4,
    title: 'Mystic Forest',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    likes: 756,
    views: 4200,
    price: '$200',
    category: 'Nature',
  },
  {
    id: 5,
    title: 'Neon Nights',
    image: 'https://images.unsplash.com/photo-1506094735847-af3b4ba04ad0?w=400&h=500&fit=crop',
    likes: 1523,
    views: 9800,
    price: '$280',
    category: 'Digital',
  },
  {
    id: 6,
    title: 'Golden Hour',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    likes: 987,
    views: 6700,
    price: '$220',
    category: 'Abstract',
  },
];

const SelfProfile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Artworks');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [showBannerOptions, setShowBannerOptions] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(mockUser);

  const tabs = [
    { name: 'Artworks', icon: 'grid', count: currentUserData.artworks_count },
    { name: 'Collections', icon: 'folder', count: 12 },
    { name: 'Liked', icon: 'heart', count: 156 },
  ];

  const handleSaveProfile = (updatedData: any) => {
    setCurrentUserData(prev => ({ ...prev, ...updatedData }));
    // Here you would typically make an API call to save the data
    console.log('Profile updated:', updatedData);
  };

  // Render artwork grid item (Unique artistic style)
  const renderArtworkItem = ({ item, index }: { item: any; index: number }) => {
    const isLarge = index % 3 === 0; // Every 3rd item is larger
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: currentUserData.banner_image }}
            style={styles.bannerImage}
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
            
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#666" />
              <Text style={styles.location}>{currentUserData.location}</Text>
            </View>
            
            <TouchableOpacity style={styles.websiteRow}>
              <Feather name="link" size={14} color="#030dff" />
              <Text style={styles.website}>{currentUserData.website}</Text>
            </TouchableOpacity>
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
            <FlatList
              data={mockArtworks}
              renderItem={renderArtworkItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              scrollEnabled={false}
              contentContainerStyle={styles.artworksGrid}
              columnWrapperStyle={styles.artworkRow}
            />
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
});

export default SelfProfile;
