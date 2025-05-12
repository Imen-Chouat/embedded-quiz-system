import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import QuizNotification from '../screens/QuizNotification'; // adjust path if needed
import { useNavigation, useRoute } from '@react-navigation/native';

const Notification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const message = route.params?.message || 'A new quiz is available!';

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    navigation.goBack(); // Go back to previous screen or stay
  };

  const handleStartQuiz = () => {
    setVisible(false);
    navigation.navigate('QuizScreen'); // Or pass quiz ID if needed
  };

  return (
    <View style={styles.container}>
      {visible && (
        <QuizNotification onClose={handleClose} onStart={handleStartQuiz} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000040',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;
