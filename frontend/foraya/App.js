/*import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Navigation from './Navigation'; // Import Navigation component

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" translucent={true} />
      <Navigation />
    </SafeAreaView>
  );
};



export default App;
*/


import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Navigation from './Navigation';  // Ensure Navigation is correct
import { QuizNotificationProvider } from './QuizNotificationContext';

const App = () => {
  return (
    <QuizNotificationProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" translucent={true} />
        <Navigation />
      </SafeAreaView>
    </QuizNotificationProvider>
  );
};

export default App;







/*
// screens/Notification.js - Update this to work with your existing screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuizNotification } from '../context/QuizNotificationContext';

const QuizNotificationScreen = () => {
  const navigation = useNavigation();
  const { simulateNotification } = useQuizNotification();
  
  const handleSimulateNotification = () => {
    simulateNotification({
      message: "It's time for your daily quiz!",
      quizId: "daily-quiz-" + new Date().getTime()
    });
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Notifications</Text>
      
      <Text style={styles.description}>
        This system allows you to receive quiz notifications in real-time, 
        no matter where you are in the app.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSimulateNotification}
      >
        <Text style={styles.buttonText}>Simulate Quiz Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={handleGoBack}
      >
        <Text style={styles.secondaryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
*/