import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import PostBox from '../components/PostBox';
import Feed from '../components/screens/Feed';
import EventCard from '../components/EventCard';
import AdCard from '../components/AdCard';

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <PostBox />
      <EventCard />
      <AdCard />
      <Feed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 100, // to avoid tab overlap
    backgroundColor: '#fff',
  },
});
