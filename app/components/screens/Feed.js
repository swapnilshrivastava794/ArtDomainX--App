import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import { fetchPosts, addComment } from '../../store/slices/postsSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const { items: posts, page, hasMore, loading, loadedOnce } = useSelector(state => state.posts);

  useEffect(() => {
    if (!loadedOnce) {
      dispatch(fetchPosts(1));
    }
  }, []);

  const handleAddComment = (postId, commentText) => {
    dispatch(addComment({ postId, commentText }));
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPosts(page));
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={post => post.id.toString()}
      contentContainerStyle={styles.feed}
      renderItem={({ item }) => (
        <PostCard post={item} onAddComment={handleAddComment} />
      )}
      onEndReached={handleLoadMore}
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
