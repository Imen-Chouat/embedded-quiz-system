import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Setting.styles';

// Constants
const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'modules', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const Setting = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState(null);

  // Fetch actual user data
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch('http://10.42.0.1:7000/api/students/GetStudentInfo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);

    if (tabKey === 'home') {
      navigation.navigate('Home');
    } else if (tabKey === 'modules') {
      navigation.navigate('Modules');
    } else if (tabKey === 'account') {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('studentData'); // optional, but clean
  
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignInScreen' }],
      });
  
      Alert.alert('Logged out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout failed', error.message);
    }
  }, [navigation]);
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={require('../assets/arrow.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Text style={styles.name}>
            {userData ? `${userData.first_name} ${userData.last_name}` : 'Loading...'}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Contact')}
          >
            <Image 
              source={require('../assets/settings.png')} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Edit Information</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogout}
          >
            <Image 
              source={require('../assets/logout.png')} 
              style={styles.icon} 
            />
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map((tab) => (
          <TabItem
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={handleTabPress}
          />
        ))}
      </View>
    </View>
  );
};

const TabItem = ({ tab, isActive, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(tab.key)}
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

export default Setting;
