import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import PostCard from '../PostCard';
import { getAllPosts } from '../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import constant from '../../constant'
import { ActivityIndicator } from 'react-native';



const Feed = () => {
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);

    const accessToken = useSelector(state => state.auth.access);


  useEffect(() => {
    fetchPosts();
  }, []);

  const BASE_URL = "https://backend.artdomainx.com/media/"; 

  

const fetchPosts = async () => {
  if (loading || !hasMore) return;

  setLoading(true);
  console.log("📡 Fetching posts... Page:", page);

  try {
    const res = await getAllPosts(page);
    const fetchedPosts = res?.data?.data || [];
    const nextPageLink = res?.data?.links?.next;
    setHasMore(!!nextPageLink); // if `next` is null, no more pages


    const mappedPosts = fetchedPosts.map(post => {
      const profileUrl = post.profile_picture
        ? `${BASE_URL}${post.profile_picture}`
        : 'https://artdomainx.com/images/profile-pic.png';

      return {
        id: post.id,
        imageUrl: post.media?.[0]?.file || '',
        user: {
          name: post.username || 'Anonymous',
          avatar: profileUrl,
        },
        caption: post.title || '',
        reactionCount: post.reaction_count || 0,
        commentCount: post.comment_count || 0,
        shareCount: post.share_count || 0,
        viewCount: post.view_count || 0,
        comments: [],
      };
    });

    if (page === 1) {
      setPosts(mappedPosts);
    } else {
      setPosts(prev => [...prev, ...mappedPosts]);
    }

    // 🔄 Important
    if (fetchedPosts.length > 0) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error?.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};







  const handleAddComment = (postId, commentText) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { user: 'You', text: commentText }],
            }
          : post
      )
    );
  };

  return (
    <FlatList
  data={posts}
  keyExtractor={post => post.id.toString()}
  contentContainerStyle={styles.feed}
  renderItem={({ item }) => (
    <PostCard post={item} onAddComment={handleAddComment} />
  )}
  onEndReached={() => fetchPosts(page)} 
  onEndReachedThreshold={0.4}
  ListFooterComponent={loading ? <ActivityIndicator size="large" color="blue" /> : null}
/>
  );
};

export default Feed;

const styles = StyleSheet.create({
  feed: {
    paddingBottom: 80,
  },
});
