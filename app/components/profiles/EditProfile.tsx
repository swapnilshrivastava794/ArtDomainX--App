import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

import { editUserProfile, getCurrentUserProfile } from '../../service'; 

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  visible,
  onClose,
  onSave
}) => {
  const profileId = useSelector((state: any) => state.auth.profile_id);

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    awards: '',
    tools: '',
    visibility: 'public', 
    emailNotifications: true,
    profile_picture: '',
    banner_image: '',
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchProfileData();
    }
  }, [visible]);

  const fetchProfileData = async () => {
    setInitialLoading(true);
    try {
      const profileData = await getCurrentUserProfile();
      setFormData({
        username: profileData.user?.username || '',
        bio: profileData.bio || '',
        awards: profileData.awards || '',
        tools: profileData.tools || '',
        visibility: profileData.visibility_status || 'public',
        emailNotifications: profileData.notify_email || false,
        profile_picture: profileData.profile_picture || '',
        banner_image: profileData.banner_image || '',
      });
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
  if (!formData.username.trim()) {
    Alert.alert('Error', 'Username is required');
    return;
  }
  if (!profileId) {
    Alert.alert('Error', 'Profile ID not found. Please log in again.');
    return;
  }

  setLoading(true);

  const cleanedUsername = formData.username
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');

  const profileData = new FormData();
  profileData.append('username', cleanedUsername);
  
  // Ensure the bio is always a string, even if it's empty
  profileData.append('bio', formData.bio || '');

  profileData.append('awards', formData.awards);
  profileData.append('tools', formData.tools);
  profileData.append('visibility_status', formData.visibility);
  profileData.append('notify_email', formData.emailNotifications.toString());

  if (formData.profile_picture && formData.profile_picture.startsWith('file://')) {
    const filename = formData.profile_picture.split('/').pop();
    profileData.append('profile_picture', {
      uri: formData.profile_picture,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  if (formData.banner_image && formData.banner_image.startsWith('file://')) {
    const filename = formData.banner_image.split('/').pop();
    profileData.append('banner_image', {
      uri: formData.banner_image,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  try {
    const updatedProfile = await editUserProfile(profileId, profileData);
    onSave(updatedProfile);
    Alert.alert('Success', 'Profile updated successfully!');
    onClose();
  } catch (error) {
    console.error("Failed to update profile:", error);
    Alert.alert('Error', 'Failed to update profile. Please try again.');
  } finally {
    setLoading(false);
  }
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

  // Helper function to display the correct capitalized text for the UI
  const getVisibilityText = (value: string) => {
    switch (value) {
      case 'public':
        return 'Public';
      case 'friends_only':
        return 'Friends Only';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.headerButton, (loading || initialLoading) && styles.disabledButton]}
            disabled={loading || initialLoading}
          >
            <Text style={[styles.saveText, (loading || initialLoading) && styles.disabledText]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {initialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading profile data...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

            <View style={styles.formSection}>
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
                          // Corrected values to send lowercase strings to the state
                          { text: 'Public', onPress: () => handleInputChange('visibility', 'public') },
                          { text: 'Friends Only', onPress: () => handleInputChange('visibility', 'friends_only') },
                          { text: 'Private', onPress: () => handleInputChange('visibility', 'private') },
                          { text: 'Cancel', style: 'cancel' }
                        ]
                      );
                    }}
                  >
                    {/* Display capitalized text in the UI based on the lowercase state value */}
                    <Text style={styles.pickerText}>{getVisibilityText(formData.visibility)}</Text>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

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
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
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