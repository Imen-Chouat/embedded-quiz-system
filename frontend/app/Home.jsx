import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './Home.styles';

const HomeIcon = require('../assets/home.png');
const GradeIcon = require('../assets/image.png');
const AccountIcon = require('../assets/acc.png');

const tabs = [
  { key: 'home', label: 'Home', icon: HomeIcon },
  { key: 'grade', label: 'Modules', icon: GradeIcon },
  { key: 'account', label: 'Account', icon: AccountIcon },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleProfilePress = () => {
    console.log("Profile pressed");
  };

  const handleQuizPress = (quizNumber) => {
    console.log(`Quiz ${quizNumber} pressed`);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Header with clickable profile */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <Image   
              source={require('../assets/profiley.png')} 
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.greeting}>Hello !</Text>
              <Text style={styles.name}>Benali Sara</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Today's Quiz</Text>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity style={styles.dateItem}>
            <Text style={styles.dateNumber}>22</Text>
            <Text style={styles.dateDay}>Sat</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateItem}>
            <Text style={styles.dateNumber}>23</Text>
            <Text style={styles.dateDay}>Sun</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dateItem, styles.activeDate]}>
            <Text style={[styles.dateNumber, styles.activeDateText]}>24</Text>
            <Text style={[styles.dateDay, styles.activeDateText]}>Mon</Text>
            <Text style={[styles.dateMonth, styles.activeDateText]}>Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateItem}>
            <Text style={styles.dateNumber}>25</Text>
            <Text style={styles.dateDay}>Tue</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateItem}>
            <Text style={styles.dateNumber}>26</Text>
            <Text style={styles.dateDay}>Wed</Text>
            <Text style={styles.dateMonth}>Oct</Text>
          </TouchableOpacity>
        </View>

        {/* Status Filter */}
        <View style={styles.statusFilter}>
          <TouchableOpacity style={[styles.statusItem, styles.statusAll]}>
            <Text style={styles.statusText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusItem, styles.statusTodo]}>
            <Text style={styles.statusText}>To do</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusItem, styles.statusDone]}>
            <Text style={styles.statusText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusItem, styles.statusAbsent]}>
            <Text style={styles.statusText}>Absent</Text>
          </TouchableOpacity>
        </View>

        {/* Quiz List */}
        <View style={styles.quizList}>
          <TouchableOpacity 
            style={styles.quizItem}
            onPress={() => handleQuizPress(1)}
            activeOpacity={0.8}
          >
            <Text style={styles.subject}>Object Oriented Programming</Text>
            <Text style={styles.quizTitle}>Quiz 05 : Classes and Objects</Text>
            <Text style={styles.quizTime}>10:00 AM</Text>
            <Text style={[styles.quizStatus, styles.statusDoneText]}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quizItem}
            onPress={() => handleQuizPress(2)}
            activeOpacity={0.8}
          >
            <Text style={styles.subject}>Optique et Ondes Electromagnétiques_COE</Text>
            <Text style={styles.quizTitle}>Quiz 02 : systèmes optiques</Text>
            <Text style={styles.quizTime}>09:00 PM</Text>
            <Text style={[styles.quizStatus, styles.statusAbsentText]}>Absent</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quizItem}
            onPress={() => handleQuizPress(3)}
            activeOpacity={0.8}
          >
            <Text style={styles.subject}>English</Text>
            <Text style={styles.quizTitle}>Quiz 01 : Grammar</Text>
            <Text style={styles.quizTime}>03:00 PM</Text>
            <Text style={[styles.quizStatus, styles.statusTodoText]}>To-do</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Updated Bottom Bar */}
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

export default Home;