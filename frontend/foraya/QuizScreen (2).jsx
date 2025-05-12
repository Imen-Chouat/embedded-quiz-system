import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';


const QuizScreen = ({ route, navigation }) => {
  const { quizId} = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [studentId, setStudentId] = useState(null); 

  /*const [token, setToken] = useState('');*/

 useEffect(() => {
     const loadStudentId = async () => {
       const storedStudentId = await AsyncStorage.getItem('studentId'); // Change this to the key where studentId is stored
       if (storedStudentId) {
         setStudentId(storedStudentId);
       }
     };
   
     loadStudentId();
   }, []);
   
 useEffect(() => {
  const loadToken = async () => {
   const storedToken = await AsyncStorage.getItem('accesstoken'); // Change to 'accesstoken'
   if (storedToken) setToken(storedToken);
 };
 
   loadToken();
 }, []);
 
  
 const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoiQXlhZGphZmFyMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2ODc4OTAyLCJleHAiOjE3NDcyMDI5MDJ9.DFaJagDYjB1C3_4IgP9HAJZZ74DSRhIQjHuzJ-XJrWI";


useEffect(() => {
  if (duration <= 0) {
    handleSubmitQuiz(); // Auto-submit when time is up
    return;
  }

  const interval = setInterval(() => {
    setDuration(prev => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [duration]);


const formatTime = () => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
  const fetchQuizData = async (quizId) => {
    try {
      const response = await fetch(`http://192.168.100.30:7000/api/result/quiz/${quizId}/questions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch quiz');

      const data = await response.json();
      setTitle(data.title);
      const [hours, minutes, seconds] = data.duration.split(':').map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setDuration(totalSeconds);
      const transformedQuestions = data.questions.map(q => ({
        id: q.id,
        question: q.question_text,
        options: q.answers.map(a => a.answer_text),
        answers: q.answers, // Keep answers for ID lookup
      }));

      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  useEffect(() => {
    if (quizId) fetchQuizData(quizId);
  }, [quizId]);
  

  const handleAnswer = async (option) => {
    const question = questions[currentQuestionIndex];
    const answer_id = question.answers.find(a => a.answer_text === option)?.id;

    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });

    try {
      const response = await fetch('http://192.168.100.30:7000/api/answers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: studentId,
          quiz_id: quizId,
          question_id: question.id,
          answer_id,
        }),
      });

      const result = await response.json();
      console.log('Submit answer result:', result);
    } catch (error) {
      console.error('Error submitting answer:', error.message);
    }
  };

  const handleSubmitQuiz = async () => {

    try {
      const response = await fetch('http://192.168.100.30:7000/api/quizzes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ student_id: studentId, quiz_id: quizId  })
      });

      const score = await fetchStudentScore(quizId);

    if (score > questions.length / 2) {
      navigation.navigate('SuccessCard');
    } else {
      navigation.navigate('FailCard');
    }
    } catch (error) {
      console.error('Error submitting quiz:', error.message);
    }
  };
const fetchStudentScore = async (quizId) => {
  try {
    const response = await fetch(`http://192.168.100.30:7000/api/result/quiz/${quizId}/student/score`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch score');
    }

    const data = await response.json();
    console.log('Student Score:', data.score);
    return data.score;

  } catch (error) {
    console.error('Error fetching score:', error.message);
  }
};

  const currentQuestion = questions[currentQuestionIndex];

 return (
     
      
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menu}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.Text}>My Quiz</Text>

      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            {questions.map((q, index) => (
              <View key={q.id} style={[styles.progressItem, selectedAnswers[index] ? styles.answered : {}]}>
                <Text style={styles.progressText}>{index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.duration}>{formatTime()}</Text>

      {currentQuestion && (
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          <Text style={styles.questionText2}>Choose an answer</Text>

          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionContainer, selectedAnswers[currentQuestionIndex] === option ? styles.selectedOption : {}]}
              onPress={() => handleAnswer(option)}
            >
              <View style={[styles.optionLetter, styles[`optionLetter${index}`]]}>
                <Text style={styles.letterText}>{String.fromCharCode(65 + index)}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.navigation}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} style={[styles.button, styles.previousButton]}>
            <Text style={styles.buttonText1}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
              handleSubmitQuiz();
            }
          }}
          style={[
            styles.button,
            currentQuestionIndex === questions.length - 1 ? styles.submitButton : {},
            currentQuestionIndex === 0 ? styles.firstNextButton : {},
          ]}
        >
          <Text style={styles.buttonText2}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>


  );
};







const styles = StyleSheet.create({
scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
  flex: 1,
  padding: 20,
  backgroundColor: '#fff',
},

questionBox: {
  backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    shadowColor: 'rgba(160, 162, 164, 1)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    marginVertical: 30,
    height: '20%',     
    maxHeight: '100%',   
},

navigation: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 30,
},

button: { backgroundColor: '#184F78', padding:10,borderRadius: 10 ,top:400,width:162,
    backgroundColor: 'rgba(24, 79, 120, 1)',  // Light blue color
    shadowColor: '#184F78',  // Shadow color
    shadowOffset: { width: 4, height: 4 }, // Drop shadow direction
    shadowOpacity: 0.3, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 5, // Required for Android
    borderRadius: 10, // Optional for rounded corners
  },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menu: { fontSize: 24, fontWeight: 'bold', marginRight: 10 },
  title: { fontSize: 20, fontWeight: 'bold'},
  progressBar: { flexDirection: 'row', justifyContent: 'center' },
  progressItem: { 
    width: 30, height: 30, borderRadius: 0, marginLeft:0,marginRight:0,
    backgroundColor: '#184F78', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' 
  },
  answered: { backgroundColor: '#FEDC62' },
  progressText: { fontSize:18,fontWeight: 'bold', color: '#000' },
  duration: { fontSize: 20, fontWeight: 'bold', color: '#FEDC62', textAlign: 'left', marginBottom: -5,left:10 ,top:10},
 
  questionText: { fontSize: 24, fontWeight: 'bold', marginBottom: 15,top:-10,left:-10 },
  questionText2: { fontSize: 20, fontWeight: 'medium', marginBottom: 10,color:' rgb(173, 168, 168)',left:-10},

  question: { fontSize: 20, color: '#000',fontWeight: 'light', marginBottom: 10 ,left:-10},
  option: {
    padding: 15, borderRadius: 8, borderWidth: 1, Color:' rgba(191, 200, 236, 0.2)', marginTop: 50, alignItems: 'center', marginBottom: -30
  },
  selectedOption: { backgroundColor: '#FEDC62', borderColor: '#FEDC62' },
  optionText: { fontSize: 16, color: '#000', textAlign:'center' },
 
  buttonText2: { color: '#fff', fontSize: 18, fontWeight: 'bold' ,textAlign:'center'},
  buttonText1: { color: '#184F78', fontSize: 18, fontWeight: 'bold' ,textAlign:'center'},

  Text: { color: '000', fontSize: 27, fontWeight: 'bold' ,textAlign:'center',marginBottom:10 ,fontFamily:'poppins'},
  underProgressBar: { backgroundColor: '#4f46e5', height: 30, marginTop: -0 },
  submitButton: { backgroundColor: '#FEDC62' }, // Yellow for Submit
  previousButton: { backgroundColor: 'rgba(24, 79, 120, 0.2)' ,
    shadowColor: '#184F78',  // Shadow color
    shadowColor: '#184F78',  // Shadow color
    shadowOffset: { width: 4, height: 4 }, // Drop shadow direction
    shadowOpacity: 0.3, // Adjust opacity (lower = lighter shadow)
    shadowRadius: 6, // Increase for a softer shadow
    elevation: 14, // Required for Android
    borderRadius: 10, // Optional for rounded corners
  }, // Light blue for Previous
  firstNextButton: { left:190 }, // Alignement à droite pour la première question
  optionContainer: {alignSelf:'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 10, marginBottom: 25,bottom:-70,width:330 },
  optionLetter: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  optionLetter0: { backgroundColor: '#5B3277',
    shadowColor: '#EB107E', // Adjust color for a soft glow (change per color)
    shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
   },
  optionLetter1: { backgroundColor: '#196F3D' , 
    
    shadowColor: '#277937', // Adjust color for a soft glow (change per color)
    shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
  },
  optionLetter2: { backgroundColor: '#FEDC62',
  shadowColor:'#F1AC20' ,
  shadowOffset: { width: 0, height: 2 }, // Moins de déplacement
  shadowOpacity: 0.5, // Moins intense
  shadowRadius: 10, // Ajuste la diffusion
  elevation: 5, // Pour Android
  },
  letterText: { color: '#fff', fontWeight:'900' , fontSize: 16 },
  progressBarWrapper: {
    height:30,
    borderRadius:90,
    backgroundColor: '#184F78', // Couleur du rectangle en dessous
    paddingVertical: -20,
    marginBottom: 20,
  },
  questionScroll: {
    maxHeight: 400, // adjust this height as needed
    marginTop: 20,
  },
  
  
});

export default QuizScreen;