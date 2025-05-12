import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import quizImage from '../assets/acc.png';

const QuizNotification = ({ onClose, onStart }) => {
  return (
   
      <View style={styles.card}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={{ fontWeight: '900', fontSize: 20, color: 'black' }}>✕</Text>
        </TouchableOpacity>

        <Image source={quizImage} style={styles.quizIcon} />
        <Text style={styles.quizTitle}>Quiz Time</Text>
        <Text style={styles.quizSubtitle}>Quiz 01 : Classes and Objects</Text>

        <TouchableOpacity onPress={onStart} style={styles.startBtn}>
          <Text style={styles.startBtnText}>Start Now</Text>
        </TouchableOpacity>
      </View>
   
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: 254,
    height: 359,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 20,
  },
  quizIcon: {
    width: 110,
    height: 110,
    marginBottom: 15,
  },
  quizTitle: {
    color: '#184F78',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  quizSubtitle: {
    fontSize: 19,
    color: '#222',
    marginBottom: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: '#FEDC62',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: 193,
    height: 43,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  startBtnText: {
    fontSize: 17,
    color: '#184F78',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuizNotification;
