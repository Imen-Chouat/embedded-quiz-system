import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './ProfileScreen.styles';

const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'grade', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState(null);  // State for dynamic user data


 
  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) throw new Error('Authentication token not found');

      const response = await fetch('http://172.20.10.12:7000/api/students/GetStudentInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);  // Set the fetched data to state
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const deleteStudentAccount = async () => {
    setIsDeleting(true);
    try {
      const userToken = await AsyncStorage.getItem('accessToken');
      if (!userToken) {
        Alert.alert('Error', 'Authentication token not found');
        return { success: false, message: 'Authentication token not found' };
      }

      const response = await fetch('http://172.20.10.12:7000/api/students/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await response.json();

      return response.ok
        ? { success: true, message: data.message }
        : { success: false, message: data.message };
    } catch (err) {
      console.error('Error deleting account:', err);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'home') navigation.navigate('Home');
    else if (tabKey === 'grade') navigation.navigate('Modules');
    else if (tabKey === 'account') navigation.navigate('ProfileScreen');
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const handleContactInfoPress = useCallback(() => {
    navigation.navigate('Contact');
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? All your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteStudentAccount();
            if (result.success) {
              Alert.alert('Account Deleted', result.message, [
                { text: 'OK', onPress: () => handleLogout() },
              ]);
            } else {
              Alert.alert('Error', result.message || 'Failed to delete account');
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, []);

  const TabItem = ({ tab, isActive }) => (
    <TouchableOpacity
      onPress={() => handleTabPress(tab.key)}
      style={styles.tab}
      activeOpacity={0.7}
    >
      {isActive ? (
        <View style={styles.activeTab}>
          <View style={styles.whiteOuterCircle}>
            <View style={styles.yellowCircle}>
              <Image source={tab.icon} style={styles.activeIcon} />
            </View>
          </View>
          <Text style={styles.activeLabel}>{tab.label}</Text>
        </View>
      ) : (
        <>
          <Image source={tab.icon} style={styles.inactiveIcon} />
          <Text style={styles.tabLabel}>{tab.label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image source={require('../assets/arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image source={require('../assets/profiley.png')} style={styles.profileImage} />
          <Text style={styles.name}>
            {userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handleSettingsPress}>
            <Image source={require('../assets/settings.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleContactInfoPress}>
            <Text style={styles.buttonText}>Contact Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {TAB_CONFIG.map((tab) => (
          <TabItem key={tab.key} tab={tab} isActive={activeTab === tab.key} />
        ))}
      </View>
    </View>
  );
};

export default ProfileScreen;
