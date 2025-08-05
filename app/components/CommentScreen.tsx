import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView 
} from 'react-native';
import Modal from 'react-native-modal';

const CommentScreen = ({
  visible,
  onClose,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSend = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe={true}
      scrollHorizontal={false}
      scrollTo={null}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.modalContent}>
          <View style={styles.swipeBar} />
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const isSelf = item.user === 'You';

              return (
                <View
                  style={[
                    styles.commentBubble,
                    isSelf ? styles.selfComment : styles.otherComment,
                  ]}
                >
                  {!isSelf && <Text style={styles.user}>{item.user}</Text>}
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              );
            }}
            style={styles.commentsList}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEnabled={true}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleSend}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    flexDirection: 'column',
  },
  swipeBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  close: {
    color: '#007bff',
  },
  commentsList: {
    flex: 1,
    paddingVertical: 8,
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  send: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  commentBubble: {
    maxWidth: '75%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  selfComment: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherComment: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  commentText: {
    fontSize: 15,
  },
});