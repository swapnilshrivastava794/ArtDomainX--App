import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,FlatList 
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('Top');
  const [refreshing, setRefreshing] = useState(false);


  const tabs = ['Top', 'Recent', 'Short'];
const mediaTop = [
  { id: 1, uri: require('../../assets/top1.jpg') },
  { id: 2, uri: require('../../assets/top2.jpg') },
  { id: 3, uri: require('../../assets/top3.jpg') },
  { id: 4, uri: require('../../assets/top1.jpg') },
  { id: 5, uri: require('../../assets/top2.jpg') },
  { id: 6, uri: require('../../assets/top3.jpg') },
  { id: 7, uri: require('../../assets/top1.jpg') },
  { id: 8, uri: require('../../assets/top2.jpg') },
  { id: 9, uri: require('../../assets/top3.jpg') },
];
const mediaRecent = [
  { id: 4, uri: 'https://picsum.photos/seed/recent1/300' },
  { id: 5, uri: 'https://picsum.photos/seed/recent2/300' },
  { id: 6, uri: 'https://picsum.photos/seed/recent3/300' },
];
const mediaShort = [
  { id: 7, uri: 'https://picsum.photos/seed/short1/300' },
  { id: 8, uri: 'https://picsum.photos/seed/short2/300' },
  { id: 9, uri: 'https://picsum.photos/seed/short3/300' },
];


const getMediaByTab = () => {
  console.log('🔁 Active Tab:', activeTab);

  switch (activeTab) {
    case 'Recent':
      console.log('🟡 Returning Recent Media');
      return mediaRecent;
    case 'Short':
      console.log('🟣 Returning Short Media');
      return mediaShort;
    default:
      console.log('🔵 Returning Top Media');
      return mediaTop;
  }
};

const mediaList = getMediaByTab();
console.log('🖼️ Media List for Tab:', activeTab, mediaList);



const onRefresh = () => {
  setRefreshing(true);
  // Simulate fetching new data
  setTimeout(() => {
    setRefreshing(false);
  }, 1500);
};


  return (
    <SafeAreaView style={styles.container} >
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
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
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
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid} key={activeTab}>
        {getMediaByTab().map((item) => (
            <Image
            key={item.id}
            source={item.id ? item.uri : { uri: item.uri }}
            style={styles.gridItem}
            />
        ))}
        </View>



      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <TouchableOpacity><Ionicons name="home" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="search" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="notifications" size={24} color="#4b5563" /></TouchableOpacity>
        <TouchableOpacity style={styles.userBtn}>
          <Text style={styles.userBtnText}>User Profile</Text>
        </TouchableOpacity>
      </View>
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
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff' },
  followBtn: {
    marginLeft: 'auto',
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followText: { color: '#fff', fontWeight: '600', marginRight: 4 },

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

grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 6,
  borderWidth: 1,
  borderColor: 'red',
},

gridItem: {
  width: '90%',
  aspectRatio: 1,
  margin: 4,         // instead of '1%' which may be too small
  borderRadius: 10,
  backgroundColor: '#eee', // helps to see if image doesn't load
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
});
