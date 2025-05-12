import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Contact.styles';

// Constants
const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'grade', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const DEFAULT_CONTACT_FIELDS = [
  { id: 'firstName', label: 'First Name', value: '' },
  { id: 'lastName', label: 'Last Name', value: '' },
  { id: 'email', label: 'Email', value: '' },
];

const Contact = ({ navigation }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJiZW5hbGlfc2FyYUBlc2kuZHoiLCJpYXQiOjE3NDU2NzcxODEsImV4cCI6MTc0NjAwMTE4MX0.hyReqTFfd2jOCOwAil8DiGyalSR_FpYTazrV_9wZN4A"
  // State
  const [activeTab, setActiveTab] = useState('account');
  const [contactData, setContactData] = useState(DEFAULT_CONTACT_FIELDS);
  const [additionalFields, setAdditionalFields] = useState([]);

  // Fetch student info
  const fetchStudentInfo = async () => {
    try {

    
        // Retrieve token from AsyncStorage
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (!storedToken) {
          console.error('No token found');
          return null;
        }
      const response = await fetch('http://10.42.0.1:7000/api/students/GetStudentInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student info');
      }

      const data = await response.json();
      console.log('Fetched student info:', data);
      return data;
    } catch (error) {
      console.error('Error fetching student info:', error.message);
      return null;
    }
  };

  // Load student data
  useEffect(() => {
    const loadData = async () => {
      const studentInfo = await fetchStudentInfo();
      if (studentInfo) {
        // Always show these fields
        setContactData([
          { id: 'firstName', label: 'First Name', value: studentInfo.first_name || '' },
          { id: 'lastName', label: 'Last Name', value: studentInfo.last_name || '' },
          { id: 'email', label: 'Email', value: studentInfo.email || '' },
        ]);

        // Only include these fields if they exist
        const newAdditionalFields = [];
        if (studentInfo.level_name) {
          newAdditionalFields.push({
            id: 'year',
            label: 'Year',
            value: studentInfo.level_name,
            prefix: 'Year : '
          });
        }
        if (studentInfo.section_name) {
          newAdditionalFields.push({
            id: 'section',
            label: 'Section',
            value: studentInfo.section_name,
            prefix: 'Section : '
          });
        }
        if (studentInfo.group_name) {
          newAdditionalFields.push({
            id: 'group',
            label: 'Group',
            value: studentInfo.group_name,
            prefix: 'grp : '
          });
        }
        setAdditionalFields(newAdditionalFields);
      }
    };
    loadData();
  }, []);

  // Handlers
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);
    navigation.navigate(tabKey);
  }, [navigation]);

  const handleEditPress = useCallback(() => {
    navigation.navigate('Edit', { 
      contactData: [...contactData, ...additionalFields] 
    });
  }, [contactData, additionalFields, navigation]);

  // Components
  const ContactField = ({ field }) => (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => handleEditPress()}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>
        {field.label}: {field.prefix || ''}{field.value}
      </Text>
    </TouchableOpacity>
  );

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
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Header with back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Image 
            source={require('../assets/arrow.png')} 
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <Image 
            source={require('../assets/profiley.png')} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>Contact Information</Text>
        </View>

        {/* Contact Fields */}
        <View style={styles.buttonGroup}>
          {/* Always show these fields */}
          {contactData.map(field => (
            <ContactField key={field.id} field={field} />
          ))}
          
          {/* Only show these if they exist */}
          {additionalFields.map(field => (
            <ContactField key={field.id} field={field} />
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map(tab => (
          <TabItem 
            key={tab.key} 
            tab={tab} 
            isActive={activeTab === tab.key} 
          />
        ))}
      </View>
    </View>
  );
};

export default Contact;