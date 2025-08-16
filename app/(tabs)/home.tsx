import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View ,RefreshControl } from 'react-native';
import Header from '@components/Header';
import PostBox from '@components/PostBox';
import Feed from '@components/screens/Feed';
import EventCard from '@components/EventCard';
import AdCard from '@components/AdCard';

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
      const [refreshSignal, setRefreshSignal] = useState(false); // 👈 trigger refresh in children

      const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // 👇 Call your refresh logic here
      console.log('🔁 Refreshing feed...');
          setRefreshSignal(prev => !prev); // toggling will re-trigger useEffect in children


      // Optional: manually refresh Feed/PostBox/EventCard etc if they depend on props/state

    } catch (err) {
      console.error('❌ Error during refresh:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);
  return (
    <FlatList
      data={[]} // empty data — since your main content is in header
      keyExtractor={(_, index) => index.toString()}
      renderItem={null}
      ListHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <Header />
          <PostBox shouldRefresh={refreshSignal}/>
          <EventCard />
          <AdCard />
          <Feed shouldRefresh={refreshSignal}/>
        </View>
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
