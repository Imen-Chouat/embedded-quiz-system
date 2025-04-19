import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Grade.styles';

const HomeIcon = require('../assets/home.png');
const GradeIcon = require('../assets/image.png');
const AccountIcon = require('../assets/acc.png');

const tabs = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'grade', label: 'Modules', icon: GradeIcon },
  { key: 'account', label: 'Account', icon: AccountIcon },
];

const Grade = () => {
  // Helper function to get grade color
  const getGradeColor = (score) => {
    if (score >= 8) return '#4CAF50'; // Green
    if (score >= 5) return '#FFA000'; // Orange
    return '#F44336'; // Red
  };

  const [activeTab, setActiveTab] = useState('grade'); // Start on the 'grade' tab

  return (
    <View style={styles.mainContainer}>
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Back arrow */}
        <TouchableOpacity style={styles.backButton}>
          <Image source={require('../assets/list.png')} style={styles.backIcon}/>
        </TouchableOpacity>

        {/* Title section */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>My Grades</Text>
          <Text style={styles.subTitle}>Archi 2</Text>
          <Text style={styles.subSubTitle}>2023-2024 Academic Year</Text>
        </View>

        {/* Modules List */}
        <View style={styles.modulesContainer}>
          {/* Quiz 1 */}
          <View style={styles.moduleWrapper}>
            <TouchableOpacity style={styles.moduleItem}>
              <View style={styles.blueCircle} />
              <Image source={require('../assets/doc.png')} style={styles.docIcon}/>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>Quiz 1</Text>
                <Text style={styles.moduleSubtitle}>07|12|2024</Text>
                <View style={[styles.gradeContainer, {backgroundColor: getGradeColor(9)}]}>
                  <Text style={styles.gradeText}>9/10</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
          </View>

          {/* Quiz 2 */}
          <View style={styles.moduleWrapper}>
            <TouchableOpacity style={styles.moduleItem}>
              <View style={styles.blueCircle} />
              <Image source={require('../assets/doc.png')} style={styles.docIcon}/>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>Quiz 2</Text>
                <Text style={styles.moduleSubtitle}>07|12|2024</Text>
                <View style={[styles.gradeContainer, {backgroundColor: getGradeColor(7)}]}>
                  <Text style={styles.gradeText}>7/10</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
          </View>

          {/* Quiz 3 */}
          <View style={styles.moduleWrapper}>
            <TouchableOpacity style={styles.moduleItem}>
              <View style={styles.blueCircle} />
              <Image source={require('../assets/doc.png')} style={styles.docIcon}/>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>Quiz 3</Text>
                <Text style={styles.moduleSubtitle}>07|12|2024</Text>
                <View style={[styles.gradeContainer, {backgroundColor: getGradeColor(8)}]}>
                  <Text style={styles.gradeText}>8/10</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.divider}/>
          </View>

          {/* Quiz 4 */}
          <View style={styles.moduleWrapper}>
            <TouchableOpacity style={styles.moduleItem}>
              <View style={styles.blueCircle} />
              <Image source={require('../assets/doc.png')} style={styles.docIcon}/>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>Quiz 4</Text>
                <Text style={styles.moduleSubtitle}>07|12|2024</Text>
                <View style={[styles.gradeContainer, {backgroundColor: getGradeColor(10)}]}>
                  <Text style={styles.gradeText}>10/10</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
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

export default Grade;