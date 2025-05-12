// context/QuizNotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import socket from './socket'; // ✅ Use the shared socket instance

const QuizNotificationContext = createContext();

export const useQuizNotification = () => useContext(QuizNotificationContext);

export const QuizNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);

  // Set the shared socket instance once
  useEffect(() => {
    setSocketInstance(socket);
  }, []);

  // Listen for incoming quiz notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log('✅ Quiz notification received:', data);
      setNotification({
        message: data.message || 'A new quiz is available!',
        quizId: data.quizId || null,
        timestamp: new Date(),
      });
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, []);

  // Clear notification when dismissed
  const dismissNotification = () => {
    setNotification(null);
  };

  const value = {
    notification,
    dismissNotification,
    socket: socketInstance,
  };

  return (
    <QuizNotificationContext.Provider value={value}>
      {children}
    </QuizNotificationContext.Provider>
  );
};
