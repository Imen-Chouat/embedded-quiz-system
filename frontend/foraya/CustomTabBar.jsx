import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import  GradeIcon from '../assets/Profile.png';
import  AccountIcon  from '../assets/Profile.png';
import  HomeIcon from '../assets/Profile.png'; // your icons
import styles from './BottomBar.styles';

const tabs = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'grade', label: 'Grade', icon: GradeIcon },
  { key: 'account', label: 'Account', icon: AccountIcon },
];

const CustomTabBar = ({ state, navigation }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => navigation.navigate(tab.key)}
            style={[
              styles.tabButton,
              isFocused && styles.activeTab,
              index === 1 && styles.middleTab, // Centered tab
            ]}
          >
            {isFocused ? (
              <View style={styles.activeIconContainer}>
                <View style={styles.yellowCircle}>
                  <Icon color="#0A426E" size={20} />
                </View>
                <Text style={styles.label}>{tab.label}</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}>
                <Icon color="white" size={20} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
