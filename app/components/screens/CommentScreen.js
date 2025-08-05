import React, { useState } from 'react';
import {
  Modal,
  View,
  FlatList,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

const mockComments = Array.from({ length: 50 }, (_, i) => ({
  id: i.toString(),
  user: `user_${i}`,
  avatar: 'https://i.pravatar.cc/150?img=' + (i + 10),
  text: `This is comment ${i + 1}`,
  time: `${i + 1}h`,
  likes: Math.floor(Math.random() * 10),
}));

const CommentsModal = ({ visible, onClose }) => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        user: 'you',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: newComment,
        time: 'Just now',
        likes: 0,
      };
      setComments([...comments, newEntry]);
      setNewComment('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.commentRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <Text>
          <Text style={styles.username}>{item.user} </Text>
          <Text>{item.text}</Text>
        </Text>
        <View style={styles.commentMeta}>
          <Text style={styles.metaText}>{item.time} • Reply</Text>
          {item.likes > 0 && (
            <Text style={[styles.metaText, { marginLeft: 10 }]}>
              ❤️ {item.likes}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.5}>
        <Text style={styles.heartIcon}>♡</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Close Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.commentList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=2' }}
              style={styles.avatarSmall}
            />
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleAddComment} activeOpacity={0.6}>
              <Text style={styles.postButton}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 22,
    color: '#000',
  },
  commentList: {
    padding: 12,
    paddingBottom: 90,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    color: '#222',
  },
  commentMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
heartIcon: {
  fontSize: 22, // ⬅️ increased from 16 to 22 (or go even higher if needed)
  color: '#444',
  paddingLeft: 8,
  paddingTop: 4,
},

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    padding: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  postButton: {
    color: '#007AFF',
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default CommentsModal;
