import React, { useState, useCallback, useEffect } from 'react';

import { View, Text, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Edit.styles';

// Constants
const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'grade', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const FIELD_TYPES = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  GROUP: 'group',
  PASSWORD: 'password'
};

const Edit = ({ navigation }) => {
  // Manually set token (for testing only - remove in production!)
  const [token, setToken] = useState(null);

useEffect(() => {
  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem('accessToken');
    setToken(storedToken);
  };

  fetchToken();
}, []);


  // State
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState({
    firstName: 'Sara',
    lastName: 'Benali',
    group: '03',
    password: '' // Hidden by default
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');

  // Handlers
  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);
    navigation.navigate(tabKey);
  }, [navigation]);

  // API Functions
  const modifyFirstName = async (newName) => {
    try {
      const response = await fetch('http://10.42.0.1:7000/api/students/modify_FirstName', {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newName })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error modifying first name:", error);
      return { success: false, error };
    }
  };

  const modifyLastName = async (newName) => {
    try {
      const response = await fetch('http://172.20.10.3:7000/api/students/modify_LastName', {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newName })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error modifying last name:", error);
      return { success: false, error };
    }
  };

  const modifyPassword = async (newPassword) => {
    try {
      const response = await fetch('http://172.20.10.3:7000/api/students/modify_password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: newPassword })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error modifying password:", error);
      return { success: false, error };
    }
  };

  const updateStudentGroup = async (newGroupName) => {
    try {
      const response = await fetch('http://172.20.10.3:7000/api/students/modify_group', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_group: newGroupName })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error updating group:", error);
      return { success: false, error };
    }
  };

  // Editable Field Logic
  const handleFieldPress = useCallback((fieldType) => {
    setEditingField(fieldType);
    setNewValue(userData[fieldType]);
  }, [userData]);

  const handleSave = useCallback(async () => {
    if (!newValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      
      switch (editingField) {
        case FIELD_TYPES.FIRST_NAME:
          result = await modifyFirstName(newValue);
          break;
        case FIELD_TYPES.LAST_NAME:
          result = await modifyLastName(newValue);
          break;
        case FIELD_TYPES.GROUP:
          result = await updateStudentGroup(newValue);
          break;
        case FIELD_TYPES.PASSWORD:
          result = await modifyPassword(newValue);
          break;
        default:
          break;
      }

      if (result?.success) {
        setUserData(prev => ({ ...prev, [editingField]: newValue }));
        Alert.alert('Success', result.data?.message || 'Changes saved successfully');
      } else {
        Alert.alert('Error', result?.data?.message || 'Failed to save changes');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving changes');
      console.error('Save error:', error);
    } finally {
      setEditingField(null);
      setNewValue('');
      setIsLoading(false);
    }
  }, [editingField, newValue, token]);

  // Field Button Component
  const FieldButton = ({ fieldType, label, value, isPassword = false }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleFieldPress(fieldType)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>
        {isPassword ? '••••••••' : value || label}
      </Text>
    </TouchableOpacity>
  );

  // Input Field Component (for editing)
  const InputField = ({ fieldType }) => (
    <TextInput
      style={styles.input}
      value={newValue}
      onChangeText={setNewValue}
      placeholder={`Enter new ${fieldType}`}
      autoFocus
      secureTextEntry={fieldType === FIELD_TYPES.PASSWORD}
    />
  );

  // Tab Item Component
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
      {/* Header */}
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image source={require('../assets/arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image source={require('../assets/profiley.png')} style={styles.profileImage} />
          <Text style={styles.name}>Edit Profile</Text>
        </View>

        {/* Editable Fields */}
        <View style={styles.buttonGroup}>
          {editingField === FIELD_TYPES.FIRST_NAME ? (
            <InputField fieldType={FIELD_TYPES.FIRST_NAME} />
          ) : (
            <FieldButton fieldType={FIELD_TYPES.FIRST_NAME} label="First Name" value={userData.firstName} />
          )}

          {editingField === FIELD_TYPES.LAST_NAME ? (
            <InputField fieldType={FIELD_TYPES.LAST_NAME} />
          ) : (
            <FieldButton fieldType={FIELD_TYPES.LAST_NAME} label="Last Name" value={userData.lastName} />
          )}

          {editingField === FIELD_TYPES.GROUP ? (
            <InputField fieldType={FIELD_TYPES.GROUP} />
          ) : (
            <FieldButton fieldType={FIELD_TYPES.GROUP} label="Group" value={`Group ${userData.group}`} />
          )}

          {editingField === FIELD_TYPES.PASSWORD ? (
            <InputField fieldType={FIELD_TYPES.PASSWORD} />
          ) : (
            <FieldButton fieldType={FIELD_TYPES.PASSWORD} label="Password" isPassword={true} />
          )}

          {/* Save Button */}
          {editingField && (
            <TouchableOpacity
              style={styles.buttonn}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonnText}>SAVE</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map(tab => (
          <TabItem key={tab.key} tab={tab} isActive={activeTab === tab.key} />
        ))}
      </View>
    </View>
  );
};

export default Edit;
