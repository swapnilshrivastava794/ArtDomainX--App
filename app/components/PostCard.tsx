import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CommentsModal from './screens/CommentScreen';
import * as Animatable from 'react-native-animatable';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import {likePost , getPostById} from '../service'
import { useDispatch } from 'react-redux';
import { updatePostReaction } from '../store/slices/postsSlice'; // path adjust karo

interface PostType {
  id: number;
  imageUrl: string;
  user: { name: string; avatar: string };
  caption: string;
  comments: { user: string; text: string }[];
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  isLiked?: boolean;       // ✅ Add this
  reactionId?: number | null; // ✅ Add this
  
}

interface PostCardProps {
  post: PostType;
  onAddComment: (postId: number, commentText: string) => void;
}




const PostCard: React.FC<PostCardProps> = ({ post, onAddComment ,  }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(!!post.reactionId);
  const heartRef = useRef<Animatable.View | null>(null);
  const dispatch = useDispatch();


// const handleLike = async () => {
//   try {
//     setLiked(prev => !prev);
//     heartRef.current?.bounceIn();

//     console.log("▶ Liking post:", post.id);

//     const res = await likePost(post.id, 'like');
//     console.log('✅ Like API Success:', res?.data);

//     const updated = await getPostById(post.id);
//     const updatedPost = updated?.data?.data; // ✅ FIXED ACCESS

//     console.log("✅ Updated post fetched:", updatedPost);
//     console.log('✅ reaction_count:', updatedPost?.reaction_count);

//     if (!updatedPost) {
//       console.warn('⚠️ Updated post not returned properly');
//       return;
//     }

//     const updatedReactionCount = typeof updatedPost.reaction_count === 'number'
//       ? updatedPost.reaction_count
//       : post.reactionCount; // fallback to original

//     const userReactionType = updatedPost?.user_reaction_type;
//     setLiked(userReactionType === 'like');

//     dispatch(updatePostReaction({
//       postId: post.id,
//       newCount: updatedReactionCount,
//       userReactionType,
//     }));

//   } catch (error) {
//     console.error('❌ Error during like:', error?.response?.data || error.message || error);
//   }
// };

const handleLike = async () => {
  try {
    // Optimistic count update
    dispatch(updatePostReaction({
      postId: post.id,
      newCount: liked ? post.reactionCount - 1 : post.reactionCount + 1,
      userReactionType: liked ? null : 'like',
    }));

    setLiked(prev => !prev); // Toggle heart UI
    heartRef.current?.bounceIn();

    console.log("▶ Liking post:", post.id);

    const res = await likePost(post.id, 'like');
    console.log('✅ Like API Success:', res?.data);

    const updated = await getPostById(post.id);
    const updatedPost = updated?.data?.data;

    console.log("✅ Updated post fetched:", updatedPost);
    console.log('✅ reaction_count:', updatedPost?.reaction_count);

    if (!updatedPost) {
      console.warn('⚠️ Updated post not returned properly');
      return;
    }

    const updatedReactionCount = typeof updatedPost.reaction_count === 'number'
      ? updatedPost.reaction_count
      : post.reactionCount;

    const userReactionType = updatedPost?.user_reaction_type;
    setLiked(userReactionType === 'like');

    dispatch(updatePostReaction({
      postId: post.id,
      newCount: updatedReactionCount,
      userReactionType,
    }));

  } catch (error) {
    console.error('❌ Error during like:', error?.response?.data || error.message || error);
  }
};







  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(handleLike)();
    });

  const handleAddComment = (text: string) => {
    onAddComment(post.id, text);
  };

  return (
    <GestureDetector gesture={doubleTap}>
      <View style={styles.card}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: post.imageUrl }} style={styles.image} />

          {/* User Info */}
          <View style={styles.profileBadge}>
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>
                {post.user.name} <Text style={styles.verified}>✔️</Text>
              </Text>
              <Text style={styles.subText}>Yesterday at 3am</Text>
            </View>
            <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
          </View>

          {/* Reaction Buttons */}
          <View style={styles.reactionColumn}>
            <TouchableOpacity style={styles.reactionBtn} onPress={handleLike}>
              <Animatable.View ref={heartRef}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={liked ? '#fa0202ff' : '#fff'}
                />
              </Animatable.View>
              <Text style={styles.reactionText}>{post.reactionCount}</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.reactionBtn} onPress={() => setShowComments(true)}>
              <Ionicons name="chatbubble" size={20} color="#fff" />
              <Text style={styles.reactionText}>{post.commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.reactionText}>{post.shareCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn} disabled>
              <Ionicons name="eye" size={20} color="#fff" />
              <Text style={styles.reactionText}>{post.viewCount}</Text>
          </TouchableOpacity>
          </View>
        </View>

        {/* Caption and Comments */}
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{post.caption}</Text>

          {post.comments.slice(0, 2).map((comment, index) => (
            <Text key={index} style={styles.commentText}>
              <Text style={styles.commentUser}>{comment.user}: </Text>
              {comment.text}
            </Text>
          ))}

          {post.comments.length > 2 && (
            <TouchableOpacity onPress={() => setShowComments(true)}>
              <Text style={styles.viewAllText}>View all {post.comments.length} comments</Text>
            </TouchableOpacity>
          )}

          {/* Footer */}
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
            <Text style={styles.footerText}>{post.comments.length} Comments</Text>
          </View>
        </View>

        <CommentsModal
          visible={showComments}
          onClose={() => setShowComments(false)}
          onAddComment={handleAddComment}
          comments={post.comments}
          postId={post.id} // ✅ Added post ID
        />
      </View>
    </GestureDetector>
  );
};

export default PostCard;

// styles remain unchanged


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
  commentText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 13,
    color: '#888',
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
