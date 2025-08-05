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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [awards, setAwards] = useState('');
  const [tools, setTools] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileImage, setProfileImage] = useState(require('../../assets/images/profile.png'));

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
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.heading}>Edit Profile</Text>
              <TouchableOpacity style={styles.imgContainer} onPress={pickImage} activeOpacity={0.6}>
                <Image source={profileImage} style={styles.img} />
                <Text style={styles.change}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput style={styles.textInput} value={username} onChangeText={setUsername} />

              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                multiline
              />

              <Text style={styles.label}>Awards</Text>
              <TextInput
                style={styles.textInput}
                value={awards}
                onChangeText={setAwards}
                placeholder="e.g. Award 1, Award 2, Award 3"
              />

              <Text style={styles.label}>Tools</Text>
              <TextInput
                style={styles.textInput}
                value={tools}
                onChangeText={setTools}
                placeholder="e.g. Tool 1, Tool 2, Tool 3"
              />

              <Text style={styles.label}>Visibility</Text>
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
                      <Text style={styles.font}>Public</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setVisibility('Private');
                        setIsDropdownOpen(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.font}>Private</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Email Notifications</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity onPress={() => setEmailNotifications(true)} style={styles.radioBtn} activeOpacity={0.8}>
                    <View style={[styles.radioDot, emailNotifications && styles.radioDotActive]}></View>
                  </TouchableOpacity>
                  <Text style={styles.font}>Yes</Text>
                  <TouchableOpacity
                    onPress={() => setEmailNotifications(false)}
                    style={styles.radioBtn}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.radioDot, !emailNotifications && styles.radioDotActive]}></View>
                  </TouchableOpacity>
                  <Text style={styles.font}>No</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(40)
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
    width: '100%'
  },
  heading: {
    fontSize: scale(20),
    fontWeight: 'bold',
    fontStyle: "italic",
    marginTop: verticalScale(17),
    marginBottom: verticalScale(10),
    color: '#000'
  },
  imgContainer: {
    alignItems: 'center'
  },
  img: {
    height: scale(80),
    width: scale(80),
    borderRadius: scale(50),
    marginTop: verticalScale(10),
    borderWidth: scale(2),
    borderColor: '#CCCCCC',
  },
  change:{
    color: '#007AFF', 
    marginTop: 4, 
    fontSize: 12, 
    fontStyle: "italic",
  },
  formContainer: {
    width: '100%',
    marginTop: verticalScale(10),
  },
  label: {
    fontSize: scale(13),
    fontStyle: "italic",
    color: '#000000',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5)
  },
  textInput: {
    borderWidth: scale(1),
    borderColor: '#CCCCCC',
    borderRadius: scale(5),
    paddingHorizontal: moderateScale(13),
    paddingVertical: verticalScale(9),
    fontSize: scale(12),
    fontStyle: "italic",
    backgroundColor: '#F8F8F8',
  },
  bioInput: {
    height: scale(70),
    textAlignVertical: 'top'
  },
  dropdownButton: {
    justifyContent: 'center'
  },
  dropdownOptionsContainer: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: scale(5),
    marginTop: verticalScale(5),
  },
  dropdownOption: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  font: {
    fontStyle: "italic",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioBtn: {
    height: scale(15),
    width: scale(15),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(5),
  },
  radioDot: {
    height: scale(8),
    width: scale(8),
    borderRadius: 10
  },
  radioDotActive: {
    backgroundColor: '#007AFF'
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: verticalScale(12),
    borderRadius: 5,
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: scale(15),
    fontWeight: 'bold',
    fontStyle: "italic",
  },
});

export default EditProfile;
