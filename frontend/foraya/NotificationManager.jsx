import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import QuizNotification from '../components/QuizNotification'; // Update path if needed
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // or fetch if you prefer

const NotificationManager = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Start polling every 10 seconds
    const intervalId = setInterval(checkForNewQuiz, 10000);

    // Handle tapping the mobile notification
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate('QuizScreen'); // change this if your screen name is different
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  async function checkForNewQuiz() {
    try {
      // You replace this with your actual server call
      const response = await axios.get('http://YOUR_PI_IP:PORT/api/new-quiz');

      if (response.data.hasNewQuiz) {
        if (AppState.currentState === 'active') {
          // App open: show popup
          setShowPopup(true);
        } else {
          // App backgrounded: show system notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🚀 New Quiz Available!',
              body: 'Tap to start the quiz!',
              sound: true,
            },
            trigger: null,
          });
        }
      }
    } catch (error) {
      console.error('Error checking for quiz', error);
    }
  }

  const handleStartQuiz = () => {
    setShowPopup(false);
    navigation.navigate('QuizScreen'); // 👈 adapt this if different
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <Modal
      visible={showPopup}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <QuizNotification onStart={handleStartQuiz} onClose={handleClosePopup} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationManager;
