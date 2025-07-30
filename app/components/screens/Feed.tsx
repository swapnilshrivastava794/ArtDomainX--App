// components/screens/Feed.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostCard from '../PostCard';

const Feed = () => {
  return (
    <View style={styles.feed}>
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  feed: {
    paddingBottom: 80, // for bottom tab space
  },
});
