import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CommentScreen from './CommentScreen';
import * as Animatable from 'react-native-animatable';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated'; // ✅ add this

const PostCard = () => {
  return (
    <View style={styles.card}>
      {/* Image with overlays */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: 'https://lipsum.app/random/640x480/' }}
          style={styles.image}
        />

        {/* Profile Info Badge */}
        <View style={styles.profileBadge}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>
              Dee Williams <Text style={styles.verified}>✔️</Text>
            </Text>
            <Text style={styles.subText}>Yesterday at 3am</Text>
          </View>
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
        </View>

        {/* Reaction Icons on Right */}
        <View style={styles.reactionColumn}>
          <TouchableOpacity style={styles.reactionBtn}>
            <Ionicons name="heart" size={22} color="#ff2dc2" />
            <Text style={styles.reactionText}>1.3k</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBtn}>
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.reactionText}>200</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBtn}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.reactionText}>50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Caption and Footer */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          💙 Poise, grace, and a little sparkle – the essentials
        </Text>
        <View style={styles.footer}>
          <View style={styles.reactionAvatars}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/50?img=5' }}
              style={styles.miniAvatar}
            />
            <Image
              source={{ uri: 'https://i.pravatar.cc/50?img=7' }}
              style={styles.miniAvatar}
            />
            <Text style={styles.footerText}>+67 Other</Text>
          </View>
          <Text style={styles.footerText}>200 Comments</Text>
        </View>
      </View>

      {/* Modal for full comments */}
      <CommentScreen
        visible={showComments}
        onClose={() => setShowComments(false)}
        onAddComment={handleAddComment}
        comments={comments}
      />
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 380,
  },
  profileBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  nameText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 11,
    color: '#ddd',
  },
  verified: {
    color: '#f0c',
    fontSize: 14,
  },
  reactionColumn: {
    position: 'absolute',
    right: 8,
    top: 100,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 18,
  },
  reactionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  captionContainer: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
    color: '#222',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});