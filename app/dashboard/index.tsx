import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import PostBox from '../components/PostBox';
import PostCard from '../components/PostCard';
import EventCard from '../components/EventCard';
import AdCard from '../components/AdCard';

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <PostBox />
      <PostCard />
      <EventCard />
      <AdCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
});
