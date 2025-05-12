import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { UserContext } from '../Navigation';  // Assuming UserContext is used for managing auth state
import styles from './Modules.styles';  // Ensure styles are correctly imported

// Constants for the bottom navigation bar
const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'grade', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const Modules = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [modulesData, setModulesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grade'); // Added this line to manage active tab

  useEffect(() => {
    const fetchModules = async () => {
      if (!user?.accessToken) return;

      setIsLoading(true);

      try {
        const response = await fetch('http://10.42.0.1:7000/api/result/modules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.accessToken}`,
          },
        });

        const data = await response.json();

        if (data?.modules) {
          setModulesData(data.modules);
        } else {
          Alert.alert('Error', 'Modules not found.');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        Alert.alert('Error', 'Failed to load modules. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [user?.accessToken, user?.id]);

  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);

    if (tabKey === 'home') {
      navigation.navigate('Home');
    } else if (tabKey === 'grade') {
      navigation.navigate('Modules');
    } else if (tabKey === 'account') {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const handleModulePress = useCallback((moduleId) => {
    navigation.navigate('ModuleDetails', { moduleId });
  }, [navigation]);

  const ModuleItem = ({ module }) => (
    <TouchableOpacity
      style={[styles.button, styles.button1]}
      onPress={() => handleModulePress(module._id)}
      activeOpacity={0.8}
    >
      <View style={styles.buttonTextContainer}>
        <Text style={styles.buttonTitle}>{module.name}</Text>
        <Text style={styles.buttonSubtitle}>{module.subtitle || 'No subtitle'}</Text>
        <Text style={styles.buttonDetails}>{module.teacher || 'No teacher'}</Text>
      </View>
      <Image source={require('../assets/s1.png')} style={styles.buttonIcon} />
    </TouchableOpacity>
  );

  const TabItem = ({ tab, isActive }) => (
    <TouchableOpacity onPress={() => handleTabPress(tab.key)} style={styles.tab} activeOpacity={0.7}>
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
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>My Modules</Text>
      </View>

      {/* Scrollable Module List */}
      <ScrollView contentContainerStyle={styles.moduleListContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading modules...</Text>
        ) : modulesData.length > 0 ? (
          modulesData.map((module) => (
            <ModuleItem key={module._id} module={module} />
          ))
        ) : (
          <Text style={styles.loadingText}>No modules available</Text>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map((tab) => (
          <TabItem key={tab.key} tab={tab} isActive={tab.key === activeTab} />
        ))}
      </View>
    </View>
  );
};

export default Modules;
