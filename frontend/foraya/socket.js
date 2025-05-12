/*/ socket.js

import { io } from 'socket.io-client';
import { sendNotification } from './pushNotificationConfig';  // Import the function to send notifications

// Connect to your backend socket server
const socket = io('http://10.42.0.1:7000', {
  transports: ['websocket'],
});

// Listen for the 'quiz-launched' event
socket.on('quiz-launched', (data) => {
  console.log('Quiz launched:', data.quizId);
  sendNotification(
    'Nouveau Quiz Disponible 📢',
    `Un quiz vient d’être lancé !`,
    data.quizId  // Passing the quizId
  );
});

export default socket;
*/

// socket.js
import { io } from 'socket.io-client';

const socket = io('http://10.42.0.1:7000', {
  transports: ['websocket'],
});

export default socket;
