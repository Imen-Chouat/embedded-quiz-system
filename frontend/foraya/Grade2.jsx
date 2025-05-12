import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from './Modules.styles'; // Adjust path if necessary

const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'modules', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'profile', label: 'Profile', icon: require('../assets/acc.png') },
];

const Modules = ({ navigation, route }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // You'll need to get the studentId from somewhere - maybe route params, global state, or async storage
  // For example:
  // const studentId = route.params?.studentId || await AsyncStorage.getItem('studentId');
  const studentId = route.params?.studentId || 1; // Replace with actual way to get studentId

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        // Replace with your actual API base URL
        const response = await fetch(`http://10.0.23.12/api/1/modules`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        
        // Add teacher placeholder since the API doesn't return teacher info
        const modulesWithTeacher = data.modules.map(module => ({
          ...module,
          teacher: 'Teacher info not available' // You might want to fetch this separately or modify your API
        }));
        
        setModules(modulesWithTeacher);
        setError(null);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [studentId]);

  const getModuleIcon = (id) => {
    const icons = [
      require('../assets/s1.png'),
      require('../assets/s2.png'),
      require('../assets/s3.png'),
      require('../assets/s4.png')
    ];
    return icons[(id - 1) % icons.length];
  };

  const handleModulePress = useCallback((moduleId, moduleName) => {
    navigation.navigate('Grade', { moduleId, moduleName, studentId });
  }, [navigation, studentId]);

  const handleTabPress = useCallback((tabKey) => {
    if (tabKey === 'home') {
      navigation.navigate('Home');
    } else if (tabKey === 'modules') {
      navigation.navigate('Modules');
    } else if (tabKey === 'profile') {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      {/* Top Title */}
      <View style={styles.topTitleContainer}>
        <Text style={styles.topTitleText}>My Modules</Text>
      </View>

      {/* Modules list */}
      <View style={styles.buttonGroup}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : modules.length === 0 ? (
          <Text style={styles.noModulesText}>No modules found</Text>
        ) : (
          modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[styles.button, styles.biggerButton, styles[`button${(module.id % 4) + 1}`]]}
              activeOpacity={0.8}
              onPress={() => handleModulePress(module.id, module.name)}
            >
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>{module.name}</Text>
                <Text style={styles.buttonDetails}>{module.teacher}</Text>
              </View>
              <Image source={getModuleIcon(module.id)} style={styles.buttonIcon} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.key)}
          >
            {tab.key === 'modules' ? (
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
        ))}
      </View>
    </View>
  );
};

export default Modules;