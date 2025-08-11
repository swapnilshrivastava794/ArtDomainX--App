import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  currentUser: any;
  onSave: (updatedData: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  visible,
  onClose,
  currentUser,
  onSave
}) => {
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
    awards: currentUser?.awards || '',
    tools: currentUser?.tools || '',
    visibility: currentUser?.visibility || 'Public',
    emailNotifications: currentUser?.emailNotifications || true,
    profile_picture: currentUser?.profile_picture || '',
    banner_image: currentUser?.banner_image || '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1000);
  };

  const pickImage = async (type: 'avatar' | 'banner') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const field = type === 'avatar' ? 'profile_picture' : 'banner_image';
      handleInputChange(field, result.assets[0].uri);
    }
  };

  const takePhoto = async (type: 'avatar' | 'banner') => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const field = type === 'avatar' ? 'profile_picture' : 'banner_image';
      handleInputChange(field, result.assets[0].uri);
    }
  };

  const showImagePicker = (type: 'avatar' | 'banner') => {
    Alert.alert(
      'Select Image',
      'Choose how you want to select an image',
      [
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Gallery', onPress: () => pickImage(type) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.headerButton, loading && styles.disabledButton]}
            disabled={loading}
          >
            <Text style={[styles.saveText, loading && styles.disabledText]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => showImagePicker('avatar')}
            >
              <Image
                source={{ 
                  uri: formData.profile_picture || 'https://i.pravatar.cc/200?img=1' 
                }}
                style={styles.avatar}
              />
              <View style={styles.editImageOverlay}>
                <Feather name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>

            {/* Banner Image */}
            <TouchableOpacity 
              style={styles.bannerContainer}
              onPress={() => showImagePicker('banner')}
            >
              <Image
                source={{ 
                  uri: formData.banner_image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop' 
                }}
                style={styles.bannerImage}
              />
              <View style={styles.editBannerOverlay}>
                <Feather name="camera" size={16} color="white" />
                <Text style={styles.editBannerText}>Edit Banner</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
                placeholder="Enter your username"
                maxLength={30}
              />
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={formData.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                placeholder="Tell us about yourself..."
                multiline
                textAlignVertical="top"
                maxLength={150}
              />
              <Text style={styles.characterCount}>
                {formData.bio.length}/150
              </Text>
            </View>

            {/* Awards */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Awards</Text>
              <TextInput
                style={styles.textInput}
                value={formData.awards}
                onChangeText={(text) => handleInputChange('awards', text)}
                placeholder="e.g. Award 1, Award 2, Award 3"
                maxLength={100}
              />
            </View>

            {/* Tools */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tools</Text>
              <TextInput
                style={styles.textInput}
                value={formData.tools}
                onChangeText={(text) => handleInputChange('tools', text)}
                placeholder="e.g. Tool 1, Tool 2, Tool 3"
                maxLength={100}
              />
            </View>

            {/* Visibility */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Visibility</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={() => {
                    Alert.alert(
                      'Select Visibility',
                      'Choose who can see your profile',
                      [
                        { text: 'Public', onPress: () => handleInputChange('visibility', 'Public') },
                        { text: 'Friends Only', onPress: () => handleInputChange('visibility', 'Friends Only') },
                        { text: 'Private', onPress: () => handleInputChange('visibility', 'Private') },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Text style={styles.pickerText}>{formData.visibility}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Email Notifications */}
            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.inputLabel}>Email Notifications</Text>
                  <Text style={styles.switchDescription}>
                    Receive notifications about your account activity
                  </Text>
                </View>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {formData.emailNotifications ? 'Yes' : 'No'}
                  </Text>
                  <Switch
                    value={formData.emailNotifications}
                    onValueChange={(value) => handleInputChange('emailNotifications', value)}
                    trackColor={{ false: '#e0e0e0', true: '#4A90E2' }}
                    thumbColor={formData.emailNotifications ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Image Section
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  bannerContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  editBannerOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editBannerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  // Form Section
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
    minWidth: 30,
  },
});

export default EditProfile;
