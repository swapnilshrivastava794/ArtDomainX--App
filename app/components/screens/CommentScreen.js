import React, { useEffect, useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { getPostComments , addPostComment , replyToComment   } from '../../service';
import constant from '../../constant';

const CommentsModal = ({ visible, onClose, postId }) => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1); // from API
const [loadingMore, setLoadingMore] = useState(false);

  const [inputText, setInputText] = useState('');
  const [replyToUser, setReplyToUser] = useState(null);
  

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       if (visible && postId) {
  //         const res = await getPostComments(postId);
  //         const fetched = res?.data?.data || [];

  //         const mapped = fetched.map((c) => ({
  //           id: c.id.toString(),
  //           user: c.profile_username || 'User',
  //           avatar:
  //             c.profile_picture?.trim() !== ''
  //               ? `${constant.DemoImageURl}/media/${c.profile_picture}`
  //               : 'https://artdomainx.com/images/profile-pic.png',
  //           text: c.content,
  //           time: new Date(c.created_at).toLocaleString(),
  //           likes: c.like_count || 0,
  //           replies: (c.replies || []).map((r) => ({
  //             id: r.id.toString(),
  //             user: r.profile_username || 'User',
  //             avatar:
  //               r.profile_picture?.trim() !== ''
  //                 ? `${constant.DemoImageURl}/media/${r.profile_picture}`
  //                 : 'https://artdomainx.com/images/profile-pic.png',
  //             text: r.content,
  //             time: new Date(r.created_at).toLocaleString(),
  //           })),
  //         }));

  //         setComments(mapped);
  //       }
  //     } catch (err) {
  //       console.error('❌ Error fetching comments:', err);
  //     }
  //   };

  //   fetchComments();
  // }, [visible, postId]);


  const fetchComments = async (page = 1) => {
  if (!postId || loadingMore || page > totalPages) return;

  try {
    setLoadingMore(true);
    const res = await getPostComments(postId, page);
    const fetched = res?.data?.data || [];

    const mapped = fetched.map((c) => ({
      id: c.id.toString(),
      user: c.profile_username || 'User',
      avatar:
        c.profile_picture?.trim() !== ''
          ? `${constant.DemoImageURl}/media/${c.profile_picture}`
          : 'https://artdomainx.com/images/profile-pic.png',
      text: c.content,
      time: new Date(c.created_at).toLocaleString(),
      likes: c.like_count || 0,
      replies: (c.replies || []).map((r) => ({
        id: r.id.toString(),
        user: r.profile_username || 'User',
        avatar:
          r.profile_picture?.trim() !== ''
            ? `${constant.DemoImageURl}/media/${r.profile_picture}`
            : 'https://artdomainx.com/images/profile-pic.png',
        text: r.content,
        time: new Date(r.created_at).toLocaleString(),
      })),
    }));

    setComments((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    setCurrentPage(res?.data?.current_page || page);
    setTotalPages(res?.data?.total_pages || 1);
  } catch (err) {
    console.error('❌ Error fetching comments:', err);
  } finally {
    setLoadingMore(false);
  }
};

// Initial load when visible/postId changes
useEffect(() => {
  if (visible && postId) {
    setComments([]); // clear existing comments on new modal open
    setCurrentPage(1);
    fetchComments(1);
  }
}, [visible, postId]);

// Function for FlatList infinite scroll
const handleLoadMore = () => {
  if (currentPage < totalPages && !loadingMore) {
    fetchComments(currentPage + 1);
  }
};
  const handleSendComment = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
      // ✅ Clear input immediately on submit
  setInputText('');

    if (replyToUser) {
      // ✅ Call real replyToComment API
      const res = await replyToComment(replyToUser.id, trimmed);
      const newReply = res?.data?.data;

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === replyToUser.id
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: newReply?.id?.toString() ?? Date.now().toString(),
                    user: newReply?.profile_username ?? 'you',
                    avatar:
                      newReply?.profile_picture?.trim()
                        ? `${constant.DemoImageURl}/media/${newReply.profile_picture}`
                        : 'https://artdomainx.com/images/profile-pic.png',
                    text: newReply?.content ?? trimmed,
                    time: new Date(newReply?.created_at || Date.now()).toLocaleString(),
                  },
                ],
              }
            : comment
        )
      );
    } else {
      // ✅ Parent comment post to API
      const res = await addPostComment(postId, trimmed);
      const newComment = res?.data?.data;

      setComments((prev) => [
        ...prev,
        {
          id: newComment?.id?.toString() ?? Date.now().toString(),
          user: newComment?.profile_username ?? 'you',
          avatar:
            newComment?.profile_picture?.trim()
              ? `${constant.DemoImageURl}/media/${newComment.profile_picture}`
              : 'https://artdomainx.com/images/profile-pic.png',
          text: newComment?.content ?? trimmed,
          time: new Date(newComment?.created_at || Date.now()).toLocaleString(),
          replies: [],
        },
      ]);
      await getPostComments();  // ⬅️ YAHI PE ADD KARNA HAI
    }
    setInputText('');
    setReplyToUser(null);
  };


  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>



        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleLoadMore}
  onEndReachedThreshold={0.2}
  ListFooterComponent={
    loadingMore ? <ActivityIndicator size="small" color="blue" /> : null
  }
          renderItem={({ item }) => (
            <View style={styles.commentBlock}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.user}>{item.user}</Text>
                <Text>{item.text}</Text>
                <Text style={styles.time}>{item.time}</Text>

                {item.replies?.map((reply) => (
                  <View key={reply.id} style={styles.replyBlock}>
                    <Image source={{ uri: reply.avatar }} style={styles.avatarSmall} />
                    <View>
                      <Text style={styles.user}>{reply.user}</Text>
                      <Text>{reply.text}</Text>
                      <Text style={styles.time}>{reply.time}</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => {
                    setReplyToUser(item);
                    setInputText(`@${item.user} `); // ✅ Set @username in input
                  }}
                >
                  <Text style={styles.replyBtn}>Reply</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}
        />
        {replyToUser && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f0f0f0',
              marginHorizontal: 10,
              marginBottom: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#555', fontSize: 14 }}>
              Replying to <Text style={{ fontWeight: 'bold' }}>@{replyToUser.user}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setReplyToUser(null);
                setInputText('');
              }}
            >
              <Text style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Add a comment..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSendComment}>
              <Text style={styles.send}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  close: { color: 'blue' },
  commentBlock: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarSmall: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  user: { fontWeight: 'bold' },
  time: { fontSize: 12, color: 'gray' },
  replyBlock: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 20,
  },
  replyBtn: {
    color: 'blue',
    marginTop: 4,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  send: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default CommentsModal;
