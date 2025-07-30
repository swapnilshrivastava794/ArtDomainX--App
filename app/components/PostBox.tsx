import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const PostBox = () => {
  const [post, setPost] = useState('');
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);


  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const handlePost = () => {
    if (!post && !media) return;
    // TODO: Send post + media to backend
    console.log('Post:', post);
    console.log('Media:', media?.uri);
    setPost('');
    setMedia(null);
  };

  return (
    <View style={styles.card}>
      <TextInput
        placeholder="What's on your mind?"
        style={styles.input}
        multiline
        numberOfLines={3}
        value={post}
        onChangeText={setPost}
      />

      {media && (
        <Image source={{ uri: media.uri }} style={styles.preview} />
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleMediaPick}>
          <Ionicons name="image" size={20} color="#4f46e5" />
          <Text style={styles.iconText}>Media</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postBtn, !(post || media) && { opacity: 0.4 }]}
          onPress={handlePost}
          disabled={!(post || media)}
        >
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostBox;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  input: {
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconText: {
    color: '#4f46e5',
    fontSize: 14,
  },
  postBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  postText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 6,
  },
});
