import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const PostComposer = () => {
  const [visibility, setVisibility] = useState('Public');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Updated visibilityOptions to be an array of objects for better control over rendering
  const visibilityOptions = [
    { icon: '🌍', text: 'Public' },
    { icon: '🔒', text: 'Private' },
    { icon: '👥', text: 'Friends' },
  ];

  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState(null);

  const visibilityButtonRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  /**
   * Handles picking an image or video from the device's media library.
   */
  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setMedia(asset);
      console.log('Selected Media:', asset);
    }
  };

  /**
   * Measures the position and dimensions of the visibility button
   * relative to the window. This is crucial for positioning the dropdown.
   */
  const measureVisibilityButton = () => {
    if (visibilityButtonRef.current) {
      visibilityButtonRef.current.measureInWindow((x, y, width, height) => {
        setButtonPosition({ x, y, width, height });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drop To Canvas</Text>

      <TouchableOpacity onPress={() => console.log('Load Draft pressed!')}>
        <Text style={styles.draftLink}>📄 Load Draft</Text>
      </TouchableOpacity>

      {/* Profile Info & Visibility */}
      <View style={styles.profileRow}>
        <Ionicons name="person-circle" size={40} color="#ccc" />
        <View style={styles.userInfo}>
          <Text style={styles.username}>rm_2004</Text>

          <TouchableOpacity
            ref={visibilityButtonRef}
            style={styles.visibility}
            onPress={() => {
              setIsDropdownVisible(true);
              measureVisibilityButton();
            }}
          >
            <View style={styles.visibilityDot} />
            <Text style={styles.visibilityText}>{visibility}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Input */}
      <TextInput
        placeholder="What's on your mind?"
        value={postText}
        onChangeText={setPostText}
        multiline
        style={styles.inputBox}
        placeholderTextColor="#666"
      />

      {/* Media Preview */}
      {media && (
        <Image source={{ uri: media.uri }} style={styles.previewImage} />
      )}

      {/* Add Photo/Video Button */}
      <TouchableOpacity style={styles.addMediaRow} onPress={handleMediaPick}>
        <Ionicons name="image" size={20} color="green" />
        <Text style={styles.addMediaText}>Add Photo/Video</Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.postBtn} onPress={() => console.log('Post button pressed!')}>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.draftBtn} onPress={() => console.log('Save Draft button pressed!')}>
          <Text style={styles.draftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsDropdownVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                top: buttonPosition.y + buttonPosition.height + 5,
                left: buttonPosition.x,
                width: buttonPosition.width,
              },
            ]}
          >
            {visibilityOptions.map((option) => (
              <TouchableOpacity
                key={option.text} // Use option.text as key
                style={styles.dropdownItem}
                onPress={() => {
                  setVisibility(option.text); // Set visibility based on text
                  setIsDropdownVisible(false);
                }}
              >
                {/* Render icon and text separately */}
                <Text style={styles.dropdownIcon}>{option.icon}</Text>
                <Text style={styles.dropdownText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PostComposer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginHorizontal: 16,
    padding: 20,
    top: 70,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    alignSelf: 'center',
  },
  draftLink: {
    color: '#3b82f6',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontWeight: '700',
    fontSize: 14,
  },
  visibility: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  visibilityDot: {
    width: 8,
    height: 8,
    backgroundColor: 'green',
    borderRadius: 4,
    marginRight: 6,
  },
  visibilityText: {
    marginRight: 4,
    fontSize: 12,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    minHeight: 100,
    padding: 10,
    marginTop: 10,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  addMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addMediaText: {
    marginLeft: 8,
    color: 'green',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  postBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  postText: {
    color: '#fff',
    fontWeight: '700',
  },
  draftBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  draftText: {
    color: '#111827',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    elevation: 5,
    position: 'absolute',
  },
  dropdownItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10,
  },
  dropdownIcon: {
    fontSize: 16, 
    marginRight: 8, 
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
});