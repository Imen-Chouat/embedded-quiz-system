import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from './SuccessCard.styles';
import GoodjobImage from '../assets/Goodjob.png';
import XImage from '../assets/X.png';

const SuccessCard = ({ navigation }) => {
  // ========================
  // PLACEHOLDER DATA (REPLACE WITH API CALLS)
  // ========================
  const [quizResult, setQuizResult] = React.useState({
    score: '8/10',
    points: '+80 Points',
    message: 'You answered 8 out of 10 questions correctly. See the detailed Report.'
  });

  // Example API function (to be implemented)
  const fetchQuizResult = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get('/api/quiz-results/latest');
      // setQuizResult(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load quiz results');
    }
  };

  // ========================
  // HANDLERS
  // ========================
  const handleClose = () => {
    // TODO: Add analytics/logging if needed
    navigation.goBack();
  };

  const handleViewReport = () => {
    // TODO: Replace with actual navigation to report screen
    navigation.navigate('QuizCorrectionScreen', { quizId: '123' });
  };

  // ========================
  // LOAD DATA ON MOUNT
  // ========================
  React.useEffect(() => {
    fetchQuizResult();
  }, []);

  return (
    <View style={styles.screenContainer}>
      {/* Close button */}
      <TouchableOpacity style={styles.xButton} onPress={handleClose}>
        <Image source={XImage} style={styles.xIcon} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Image source={GoodjobImage} style={styles.image} />
        
        <View style={styles.redBackground}>
          <Text style={styles.score}>{quizResult.score}</Text>
          <Text style={styles.points}>{quizResult.points}</Text>
          <Text style={styles.message}>{quizResult.message}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleViewReport}
        >
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuccessCard;