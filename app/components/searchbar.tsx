import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchUser, searchHashtag } from '../service';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchSearchResults();
      } else {
        setUsers([]);
        setHashtags([]);
      }
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);

      const [userRes, hashtagRes] = await Promise.all([
        searchUser(search),
        searchHashtag(search),
      ]);

      console.log("📦 User API Response:", userRes.data);
      setUsers(userRes.data?.data || []);
      setHashtags(hashtagRes.data?.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
  <View style={styles.card}>
    <Image
      source={
        item.profile_picture
          ? { uri: item.profile_picture } 
          : require('../../assets/images/profileicon.png')
      }
      style={styles.avatar}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{item.username || 'User'}</Text>  
      <Text style={styles.username}>@{item.username}</Text>
    </View>
  </View>
);

  const renderHashtagItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="pricetag" size={24} color="#6b7280" style={styles.hashtagIcon} />
      <View>
        <Text style={styles.name}>#{item.name}</Text>
        <Text style={styles.username}>{item.post_count} posts</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search users or hashtags"
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
          placeholderTextColor="#666"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#2563eb" />
      ) : (
        <>
          {users.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Users</Text>
              <FlatList
                data={users}
                keyExtractor={(item, index) => `user-${index}`}
                renderItem={renderUserItem}
                contentContainerStyle={styles.list}
              />
            </>
          )}

          {hashtags.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Hashtags</Text>
              <FlatList
                data={hashtags}
                keyExtractor={(item, index) => `hashtag-${index}`}
                renderItem={renderHashtagItem}
                contentContainerStyle={styles.list}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#F2F2F2',
    color: '#000',
    fontSize: 16,
  },
  clearIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  hashtagIcon: {
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  username: {
    fontSize: 13,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#1f2937',
  },
});

export default SearchBar;
