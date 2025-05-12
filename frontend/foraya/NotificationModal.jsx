import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuizNotification } from '../QuizNotificationContext';
import React, { useState, useEffect } from 'react';

const NotificationModal = () => {
  const { notification, dismissNotification } = useQuizNotification();
  const navigation = useNavigation();
const [timedBy, setTimedBy] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
  const loadToken = async () => {
   const storedToken = await AsyncStorage.getItem('accesstoken'); // Change to 'accesstoken'
   if (storedToken) setToken(storedToken);
   console.log(token);
 };
 
   loadToken();
 }, []);
 
  if (!notification) return null;
const getQuizById = async (quizId) => {
  try {
    const response = await fetch('http://10.42.0.1:7000/api/quizzes/getQuizById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,

      },
      body: JSON.stringify({ quizId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    const quiz = await response.json();
    return quiz; // return it instead of relying on state
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

const handleStartQuiz = async () => {
  try {
const quiz = await getQuizById(notification.quizId);

    const timedBy = quiz.timed_by?.trim(); // just in case
    const visibility = quiz.visibility; // just in case

    console.log("timedBy:", timedBy, "visibility:", visibility);

    if (visibility === 1 && timedBy === "quiz") {
      console.log("Navigating to QuizScreen");
          navigation.navigate('QuizScreen', { quizId: notification.quizId });

    } else if (visibility === 0 && timedBy === "quiz") {
      console.log("Navigating to QuizScreenV2");
          navigation.navigate('QuizScreenV2', { quizId: notification.quizId });

    } else if (visibility ===  1 && timedBy === "question") {
      console.log("Navigating to QuizScreenTime");
    navigation.navigate('QuizScreenTime', { quizId: notification.quizId });
    } else if (visibility === 0 && timedBy === "question") {
      console.log("Navigating to QuizScreenV3");
          navigation.navigate('QuizScreenV3', { quizId: notification.quizId });

    } else {
      console.warn("No condition matched. visibility:", visibility, "timed_by:", timedBy);
    }

  } catch (error) {
    console.error('Error starting quiz:', error);
  }
  dismissNotification();
};


   
  console.log('Notification state:', notification); // This will show the notification state in your console

  return (
    <Modal transparent animationType="fade" visible={!!notification}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Quiz Time!</Text>
          <Text style={styles.message}>{notification.message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={dismissNotification}>
              <Text style={styles.dismissButtonText}>Later</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStartQuiz}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dismissButton: {
    backgroundColor: '#f0f0f0',
  },
  dismissButtonText: {
    color: '#666',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NotificationModal;