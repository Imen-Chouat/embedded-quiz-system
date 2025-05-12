// components/GlobalNotification.js
import React, { createContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Modal from 'react-native-modal';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    visible: false,
    title: ''
  });

  const showNotification = (title) => {
    setNotification({ visible: true, title });
    // Auto-hide after 5 seconds
    setTimeout(() => setNotification({ ...notification, visible: false }), 5000);
  };

  const hideNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Modal
        isVisible={notification.visible}
        backdropOpacity={0.7}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.notificationContent}>
            <Text style={styles.title}>Quiz Time</Text>
            <Text style={styles.message}>{notification.title}</Text>
            <TouchableOpacity style={styles.button} onPress={hideNotification}>
              <Text style={styles.buttonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'center', alignItems: 'center' },
  blurContainer: { width: '80%', borderRadius: 20, overflow: 'hidden' },
  notificationContent: { 
    padding: 25, 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.9)' 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  message: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  button: { 
    backgroundColor: '#184F78', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 25 
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export const useNotification = () => useContext(NotificationContext);