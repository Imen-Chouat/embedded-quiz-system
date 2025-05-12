// pushNotificationConfig.js

import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

let notificationData = null;

// Configure Push Notification
PushNotification.configure({
  onNotification: function (notification) {
    console.log("Notification received:", notification);

    // If the notification was interacted with, store the quiz ID
    if (notification.userInteraction) {
      notificationData = notification.data; // Store quiz ID data
    }
  },
  requestPermissions: Platform.OS === 'ios', // Request permissions for iOS
});

// Create a notification channel for Android
PushNotification.createChannel(
  {
    channelId: "quiz-alerts",
    channelName: "Quiz Alerts",
    importance: 4,  // Max importance
    vibrate: true,
  },
  (created) => console.log(`Channel created: ${created}`)
);

// Function to send notifications
export const sendNotification = (title, message, quizId) => {
  PushNotification.localNotification({
    channelId: "quiz-alerts",  // The channel ID
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 300,
    priority: "max",
    importance: "max",
    data: { quizId: quizId },  // Pass quiz ID in notification data
  });
};

// Function to get quiz ID when the user interacts with the notification
export const getNotificationData = () => notificationData;
