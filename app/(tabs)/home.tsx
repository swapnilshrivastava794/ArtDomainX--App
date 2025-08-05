import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import PostBox from '../components/PostBox';
import Feed from '../components/screens/Feed';
import EventCard from '../components/EventCard';
import AdCard from '../components/AdCard';

export default function HomeScreen() {
  return (
    <FlatList
      data={[]} // empty data — since your main content is in header
      keyExtractor={(_, index) => index.toString()}
      renderItem={null}
      ListHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <Header />
          <PostBox />
          <EventCard />
          <AdCard />
          <Feed />
        </View>
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 1,
  },
});
