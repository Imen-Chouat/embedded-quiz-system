// useQuizListener.js
import { useEffect } from 'react';
import socket from './socket';
import { useNavigation } from '@react-navigation/native';

const useQuizListener = () => {
  const navigation = useNavigation();

  useEffect(() => {
    socket.on('quizAvailable', (data) => {
      navigation.navigate('Notification', {
        message: `New quiz available: ${data.title}`,
        quizId: data.id,
      });
    });

    return () => {
      socket.off('quizAvailable');
    };
  }, []);
};

export default useQuizListener;
