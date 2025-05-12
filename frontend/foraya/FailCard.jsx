import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './FailCard.styles';
import BadjobImage from '../assets/Badjob.png';
import XImage from '../assets/X.png';

const FailCard = ({ navigation }) => {
  // ========================
  // STATE & PLACEHOLDER DATA
  // ========================
  const [quizResult, setQuizResult] = useState({
    score: '2/10',
    points: '+20 Points',
    message: 'You answered 2 out of 10 questions correctly. See the detailed Report.',
    passed: false // Added to distinguish fail/success states
  });

  // ========================
  // API FUNCTIONS (TO BE IMPLEMENTED)
  // ========================
  const fetchQuizResult = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/quiz-results/latest');
      // setQuizResult({
      //   score: `${response.data.correct}/${response.data.total}`,
      //   points: `+${response.data.points} Points`,
      //   message: `You answered ${response.data.correct} out of ${response.data.total} questions correctly.`,
      //   passed: response.data.passed
      // });
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz results');
    }
  };

  // ========================
  // HANDLERS
  // ========================
  const handleClose = () => {
    // TODO: Add analytics if needed
    // trackEvent('quiz_fail_closed');
    navigation.goBack();
  };

  const handleViewReport = () => {
    // TODO: Pass actual quiz ID
    navigation.navigate('QuizCorrectionScreen', { 
      quizId: '123',
      isFail: true // Flag for fail-specific report
    });
  };

  // ========================
  // LOAD DATA ON MOUNT
  // ========================
  useEffect(() => {
    fetchQuizResult();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {/* Close button */}
      <TouchableOpacity 
        style={styles.xButton} 
        onPress={handleClose}
        testID="close-button"
      >
        <Image source={XImage} style={styles.xIcon} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Image 
          source={BadjobImage} 
          style={styles.image} 
          accessibilityLabel="Bad job illustration"
        />
        
        <Text style={styles.badtext}>BAD JOB!</Text>
        
        <View style={styles.redBackground}>
          <Text style={styles.score}>{quizResult.score}</Text>
          <Text style={styles.points}>{quizResult.points}</Text>
          <Text style={styles.message}>{quizResult.message}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleViewReport}
          testID="report-button"
        >
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FailCard;