import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fetchQuizCorrection = async (quiz_id, studentId) => {
  try {
    const response = await fetch(`http://10.42.0.1:7000/api/result/quiz-correction/${quiz_id}/${studentId}`);
    const data = await response.json();
    return response.ok ? data : null;
  } catch (error) {
    console.error('Error fetching quiz correction:', error);
    return null;
  }
};

const QuizCorrectionScreen = ({ route, navigation }) => {
  const { quiz_id, studentId } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const getCorrection = async () => {
      const result = await fetchQuizCorrection(quiz_id, studentId);
      if (result) {
        setQuestions(result);
      }
    };
    getCorrection();
  }, [quiz_id, studentId]);

  if (!questions) {
    return (
      <View style={styles.container}>
        <Text>Loading correction...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const studentAnswerId = currentQuestion.student_answer_id;
  const correctAnswer = currentQuestion.answers.find(a => a.is_correct);
  const studentAnswer = currentQuestion.answers.find(a => a.answer_id === studentAnswerId);
  const isCorrect = correctAnswer?.answer_id === studentAnswerId;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.Text}>Correction of the Quiz</Text>

      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBar}>
          {questions.map((q, index) => {
            const correct = q.answers.find(a => a.is_correct)?.answer_id === q.student_answer_id;
            return (
              <View
                key={q.question_id}
                style={[
                  styles.progressItem,
                  correct ? styles.correctAnswer : styles.wrongAnswer
                ]}
              >
                <Text style={styles.progressText}>{index + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.questionBox, isCorrect ? styles.correctBox : styles.wrongBox]}>
        <Text style={styles.questionText}>Question {currentIndex + 1}</Text>
        <Text style={styles.question}>{currentQuestion.question_text}</Text>
        <Text style={styles.questionText2}>Choose an answer</Text>
        <Text style={isCorrect ? styles.correctText : styles.wrongText}>
          {isCorrect ? 'Correct' : 'Wrong'}
        </Text>
      </View>

      {currentQuestion.answers.map((answer, index) => {
        const isSelected = answer.answer_id === studentAnswerId;
        const isCorrectOption = answer.is_correct;
        return (
          <View
            key={answer.answer_id}
            style={[
              styles.option,
              isSelected
                ? (isCorrect ? styles.correct : styles.wrong)
                : isCorrectOption
                  ? styles.correct
                  : styles.neutral
            ]}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.letterText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text style={styles.optionText}>{answer.answer_text}</Text>
          </View>
        );
      })}

      <View style={styles.navigation}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={() => setCurrentIndex(currentIndex - 1)} style={styles.button0}>
            <Text style={styles.buttonText1}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentIndex < questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setCurrentIndex(currentIndex + 1)}
            style={[styles.button1, currentIndex === 0 && styles.firstQuestionButton]}
          >
            <Text style={styles.buttonText2}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button2}>
            <Text style={styles.buttonText1}>End</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menu: { fontSize: 24, fontWeight: 'bold', marginRight: 10 },
  container: { flex: 1, padding: 20, backgroundColor: '#fff', bottom: -30 },
  title: { fontSize: 20, fontWeight: 'bold'},
  questionBox: { padding: 15, borderWidth: 2, borderRadius: 20, marginBottom: 15,weight:900,height:180,top:40,width:350,alignSelf:'center', 
    shadowOffset: { width: 4, height: 100}, // Drop shadow direction
    shadowOpacity: -100, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 20, // Required for Android
  },
  navigation: { flexDirection: 'row', justifyContent: 'space-between' },

  correctBox: { borderColor: 'green' , backgroundColor: '#fff', padding: 40, borderRadius: 20, shadowColor: 'rgb(13, 132, 45)', height: 180, top: 40, width: 350, alignSelf: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 6},
  wrongBox: { borderColor: 'red', backgroundColor: '#fff', padding: 40, borderRadius: 20, shadowColor: 'rgb(215, 36, 36)', height: 180, top: 40, width: 350, alignSelf: 'center', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 6, elevation: 6 },
  option: { alignSelf:'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, marginBottom: 25,bottom:-70,width:330 },
  correct: { borderColor: 'green', backgroundColor: '#d4edda' },
  wrong: { borderColor: 'red', backgroundColor: '#f8d7da' },
  neutral: { borderColor: '#ddd' },
  button0: { backgroundColor: 'rgba(24, 79, 120, 0.2)', shadowColor: '#184F78', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 14, borderRadius: 10, padding: 10, top: 120, width: 162 },
  button1: { backgroundColor: 'rgba(24, 79, 120, 1)', shadowColor: '#184F78', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5, borderRadius: 10, padding: 10, top: 120, width: 162 },
  firstQuestionButton: { left:210,padding: 10, top: 200, width: 162 },
  button2: { backgroundColor: '#FEDC62', shadowColor: '#184F78', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5, borderRadius: 10, padding: 10, top: 120, width: 162 },
  buttonText2: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  buttonText1: { color: '#184F78', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  Text: { color: '000', fontSize: 24, fontWeight: 'bold' ,textAlign:'center',marginBottom:10 ,fontFamily:'poppins'},
  questionText: { fontSize: 20, fontWeight: 'bold', marginBottom: 15,top:-10,left:-15 },
  questionText2: { fontSize: 20, fontWeight: 'medium', marginBottom: 10,color:' rgb(173, 168, 168)',left:-15,top:-10},
  question: { fontSize: 20, color: '#000',fontWeight: 'light', marginBottom: 10 ,left:-15,top:-10},
  correctText: { color: 'green',  fontSize: 20, fontWeight: 'bold', marginBottom: -5,left:-30 ,top:-200},
  wrongText: { color: 'red', fontSize: 20, fontWeight: 'bold', marginBottom: -5,left:-30 ,top:-200},
 
  progressItem: {  width: 30, height: 30, borderRadius: 0, marginLeft:0,marginRight:0,
    backgroundColor: '#184F78', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center'  },
  progressText: { color: '#fff', fontWeight: 'bold',fontSize:18 },
  correctAnswer: { backgroundColor: '#C3E8C9' },
  wrongAnswer: { backgroundColor: 'rgb(244, 143, 151)' },
  optionLetter: {
    width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 ,backgroundColor:'rgba(18, 7, 8, 0.1)',
    shadowColor:'#000', 
    shadowOffset: { width: 0, height: 20}, // Moins de déplacement
    shadowOpacity: 2, // Moins intense
    shadowRadius: 20, // Ajuste la diffusion
    elevation: 20, // Pour Android
  },
  letterText: {
    color: '#fff', fontWeight:'900' , fontSize: 16
  },
  optionText: {
    fontSize: 16, color: '#000', textAlign:'center'
  },
  progressBarWrapper: {
    height:30,
    borderRadius:90,
    backgroundColor: '#f0f0f0', // Couleur du rectangle en dessous
    paddingVertical: -20,
    marginBottom: 20,
  },
  progressBar: { flexDirection: 'row', justifyContent: 'center' },
  progressItem: { 
    width: 30, height: 30, borderRadius: 0, marginLeft:0,marginRight:0,
     marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' 
  },
});


export default QuizCorrectionScreen;
