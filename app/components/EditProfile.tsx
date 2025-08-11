import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [awards, setAwards] = useState('');
  const [tools, setTools] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(require('../../assets/images/profileicon.png'));

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need permission to access your gallery to set a profile picture.');
      }
    })();
  }, []);

  const handleSaveProfile = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated!');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setProfileImage({ uri: selectedAsset.uri });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* ScrollView for content that might exceed screen height */}
          <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View style={styles.headerBackground}>
                <View style={styles.topBar}>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.7} style={styles.backArrowContainer}>
                    <Feather
                      name="arrow-left-circle"
                      size={scale(24)}
                      color="black"
                    />
                  </TouchableOpacity>
                  {/* Centered heading */}
                  <View style={styles.headingWrapper}>
                    <Text style={styles.heading}>Edit Profile</Text>
                  </View>
                  <View style={styles.backArrowContainer} />
                </View>

                {/* Profile image section */}
                <TouchableOpacity style={styles.imgContainer} onPress={pickImage} activeOpacity={0.6}>
                  <View style={styles.profileWrapper}>
                    <Image source={profileImage} style={styles.img} />
                    <Image source={require('../../assets/images/camera.png')} style={styles.cameraIcon} />
                  </View>
                  <Text style={styles.change}>Change profile picture</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form container for profile details */}
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.rowLabel}>
                <Image source={require('../../assets/images/menwomen.png')} style={styles.usernameIcon} />
                <Text style={styles.label}>Username</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
              />

              {/* Bio Input */}
              <View style={styles.rowLabel}>
                <Image source={require('../../assets/images/bio.png')} style={styles.usernameIcon} />
                <Text style={styles.label}>Bio</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tell us about yourself..."
              />

              {/* Awards Input */}
              <View style={styles.rowLabel}>
                <Image source={require('../../assets/images/awards.png')} style={styles.usernameIcon} />
                <Text style={styles.label}>Awards</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={awards}
                onChangeText={setAwards}
                placeholder="e.g. Award 1, Award 2, Award 3"
              />

              {/* Tools Input */}
              <View style={styles.rowLabel}>
                <Image source={require('../../assets/images/tools.png')} style={styles.usernameIcon} />
                <Text style={styles.label}>Tools</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={tools}
                onChangeText={setTools}
                placeholder="e.g. Tool 1, Tool 2, Tool 3"
              />

              {/* Visibility Dropdown */}
              <View style={styles.rowLabel}>
                 <Image source={require('../../assets/images/eye.png')} style={styles.usernameIcon} />
                <Text style={styles.label}>Visibility</Text>
              </View>
              <View style={{ zIndex: 10 }}> 
                <TouchableOpacity
                  style={[styles.textInput, styles.dropdownButton]}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                  activeOpacity={0.8}
                >
                  <Text>{visibility}</Text>
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdownOptionsContainer}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setVisibility('Public');
                        setIsDropdownOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text>Public</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setVisibility('Private');
                        setIsDropdownOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text>Private</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Email Notifications Toggle */}
              <View style={[styles.row, { marginTop: verticalScale(25) }]}>
                <Text style={styles.label}>Email Notifications</Text>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: '#ccc', true: '#007AFF' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            {/* Save Profile Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
    width: '100%',
  },
  headerBackground: {
    // height: verticalScale(220),
    // width: '120%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#D3D3D3',
    // borderBottomLeftRadius: moderateScale(50),
    // borderBottomRightRadius: moderateScale(50),
    // overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    top: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(40),
  },
  backArrowContainer: {
    padding: moderateScale(5),
    alignItems: "flex-start",
    right: scale(30),
  },
  headingWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#000',
  },
  imgContainer: {
    alignItems: 'center',
    marginTop: verticalScale(80),
  },
  img: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(50),
    borderWidth: scale(2),
    borderColor: '#CCCCCC',
  },
  profileWrapper: {
    position: 'relative',
    width: scale(100),
    height: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: moderateScale(15),
    padding: moderateScale(6),
    height: scale(28),
    width: scale(28),
    resizeMode: 'contain',
  },
  change: {
    color: 'black',
    marginTop: moderateScale(4),
    fontSize: scale(12),
  },
  formContainer: {
    width: '100%',
    marginTop: verticalScale(10),
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  label: {
    fontSize: scale(13),
    color: '#000000',
    marginLeft: moderateScale(8),
  },
  textInput: {
    borderWidth: scale(1),
    borderColor: '#CCCCCC',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(13),
    paddingVertical: verticalScale(9),
    fontSize: scale(12),
    backgroundColor: '#F8F8F8',
    marginTop: verticalScale(5),
  },
  bioInput: {
    height: verticalScale(70),
    textAlignVertical: 'top',
  },
  dropdownButton: {
    justifyContent: 'center',
  },
  dropdownOptionsContainer: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: moderateScale(20),
    marginTop: verticalScale(5),
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    marginTop: verticalScale(30),
    marginHorizontal: moderateScale(10),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  
  usernameIcon: {
    width: scale(20), 
    height: scale(20), 
    resizeMode: 'contain', 
  },
});

export default EditProfile;
