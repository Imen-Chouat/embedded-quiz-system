import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Edit.styles';

const HomeIcon = require('../assets/home.png');
const GradeIcon = require('../assets/image.png');
const AccountIcon = require('../assets/acc.png');

const tabs = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'grade', label: 'Modules', icon: GradeIcon },
  { key: 'account', label: 'Account', icon: AccountIcon },
];

const Edit = () => {
  const [activeTab, setActiveTab] = useState('account'); // Start on the 'account' tab

  return (
    <View style={styles.mainContainer}>
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Back arrow */}
        <TouchableOpacity style={styles.backButton}>
          <Image source={require('../assets/arrow.png')} style={styles.backIcon}/>
        </TouchableOpacity>

        {/* Profile section */}
        <View style={styles.profileSection}>
          <Image source={require('../assets/profiley.png')} style={styles.profileImage}/>
          <Text style={styles.name}>Contact Information</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Benali Sara</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ns_benali@esi.dz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Year : 2CP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Section : A</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>grp : 03</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonn}>
            <Text style={styles.buttonnText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {tabs.map((tab) => {
          const isFocused = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tab}
            >
              {isFocused ? (
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
        })}
      </View>
    </View>
  );
};

export default Edit;