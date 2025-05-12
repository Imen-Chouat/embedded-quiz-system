import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { UserContext } from '../Navigation';  // Assuming UserContext is used for managing auth state
import styles from './Home.styles';


// Constants
const TAB_CONFIG = [
  { key: 'home', label: 'Home', icon: require('../assets/home.png') },
  { key: 'grade', label: 'Modules', icon: require('../assets/image.png') },
  { key: 'account', label: 'Account', icon: require('../assets/acc.png') },
];

const DATE_DATA = [
  { id: 1, number: '04', day: 'sun', month: 'may', date: '2025-05-04' },
  { id: 2, number: '05', day: 'mon', month: 'may', date: '2025-05-05' },
  { id: 3, number: '06', day: 'Tue', month: 'may', date: '2025-05-06' },
  { id: 4, number: '07', day: 'Wed', month: 'may', date: '2025-05-07' },
  { id: 5, number: '08', day: 'thur', month: 'may', date: '2025-05-08' },
];




const STATUS_FILTERS = [
  { id: 'all', label: 'All', style: styles.statusAll },

  { id: 'done', label: 'Done', style: styles.statusDone },
  { id: 'absent', label: 'Absent', style: styles.statusAbsent },
];


// Map tab keys to screen names
const TAB_TO_SCREEN = {
  home: 'Home',
  grade: 'Modules',
  account: 'ProfileScreen',
};

// Fetch function
const fetchStudentQuizzes = async (accessToken) => {
  try {
    const response = await fetch('http://10.42.0.1:7000/api/result/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Use the accessToken for authentication
      }
    });

    console.log("API Response Status:", response.status); // Log the status of the API response

    if (!response.ok) {
      throw new Error('Failed to fetch student quizzes');
    }

    const data = await response.json();
    console.log('Fetched student quizzes:', data);
    return data.quizzes;
  } catch (error) {
    console.error('Error fetching student quizzes:', error.message);
    throw error;
  }
};

const Home = ({ navigation }) => {
  const { user } = useContext(UserContext); // Fetch user context for accessToken
  const [activeTab, setActiveTab] = useState('home');
  const [activeStatus, setActiveStatus] = useState('all');
  const [quizzes, setQuizzes] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2025-05-13');

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user?.accessToken) {
        console.log("Access token not found or loading:", user?.accessToken);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        console.log("Access token:", user.accessToken);
        const quizzesData = await fetchStudentQuizzes(user.accessToken);
        if (quizzesData) {
          setQuizzes(quizzesData);
        }
      } catch (err) {
        setError('Failed to fetch student quizzes');
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuizzes();
  }, [user?.accessToken]); // ✅ only accessToken
  
  
  /* Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const status = quiz.status?.toLowerCase();
    if (activeStatus === 'all') {
      return status === 'done' || status === 'absent';
    }
    return status === activeStatus;
  });  
  */


  const filteredQuizzes = quizzes.filter((quiz) => {
    const status = quiz.status?.toLowerCase();
    if (activeStatus === 'all') {
      return ['done', 'absent', 'Start'].includes(status); // Include "Start"
    }
    return status === activeStatus;
  });
  
 

  // Handlers
  const handleProfilePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);


  
 const getQuizById = async (quizId) => {
  try {
    const response = await fetch('http://10.42.0.1:7000/api/quizzes/getQuizById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    const quiz = await response.json();
    return quiz; // return it instead of relying on state
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

  const handleStartQuiz = async () => {
  try {
const quiz = await getQuizById(notification.quizId);

    const timedBy = quiz.timed_by?.trim(); // just in case
    const visibility = quiz.visibility?.trim(); // just in case

    console.log("timedBy:", timedBy, "visibility:", visibility);

    if (visibility === "show" && timedBy === "quiz") {
      console.log("Navigating to QuizScreen");
          navigation.navigate('QuizScreen', { quizId: notification.quizId });

    } else if (visibility === "hide" && timedBy === "quiz") {
      console.log("Navigating to QuizScreenV2");
          navigation.navigate('QuizScreenV2', { quizId: notification.quizId });

    } else if (visibility === "show" && timedBy === "question") {
      console.log("Navigating to QuizScreenTime");
    navigation.navigate('QuizScreenTime', { quizId: notification.quizId });
    } else if (visibility === "hide" && timedBy === "question") {
      console.log("Navigating to QuizScreenV3");
          navigation.navigate('QuizScreenV3', { quizId: notification.quizId });

    } else {
      console.warn("No condition matched. visibility:", visibility, "timed_by:", timedBy);
    }

  } catch (error) {
    console.error('Error starting quiz:', error);
  }
  dismissNotification();
};


 

const handleQuizPress = useCallback(async (quiz) => {
  try {
    const fetchedQuiz = await getQuizById(quiz.id);

    const timedBy = fetchedQuiz.timed_by?.trim();
    const visibility = fetchedQuiz.visibility?.trim();

    if (fetchedQuiz.status === 'Start') {
      console.log("timedBy:", timedBy, "visibility:", visibility);

      if (visibility === "show" && timedBy === "quiz") {
        navigation.navigate('QuizScreen', { quizId: quiz.id });
      } else if (visibility === "hide" && timedBy === "quiz") {
        navigation.navigate('QuizScreenV2', { quizId: quiz.id });
      } else if (visibility === "show" && timedBy === "question") {
        navigation.navigate('QuizScreenTime', { quizId: quiz.id });
      } else if (visibility === "hide" && timedBy === "question") {
        navigation.navigate('QuizScreenV3', { quizId: quiz.id });
      } else {
        console.warn("No condition matched. visibility:", visibility, "timed_by:", timedBy);
      }
    } else {
navigation.navigate('QuizCorrectionScreen', { quiz_id: quiz.id });
    }
  } catch (error) {
    console.error('Error starting quiz:', error);
  }
}, [navigation]);

  



  const handleTabPress = useCallback((tabKey) => {
    setActiveTab(tabKey);
    const screenName = TAB_TO_SCREEN[tabKey];
    if (screenName) {
      navigation.navigate(screenName);
    }
  }, [navigation]);


 


  const handleStatusPress = useCallback((statusId) => {
    setActiveStatus(statusId);
  }, []);

  const handleDatePress = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  // Components
  const DateItem = ({ date }) => (
    <TouchableOpacity 
      style={[styles.dateItem, date.date === selectedDate ? styles.activeDate : null]}
      onPress={() => handleDatePress(date.date)}
      activeOpacity={0.8}
    >
      <Text style={[styles.dateNumber, date.date === selectedDate ? styles.activeDateText : null]}>
        {date.number}
      </Text>
      <Text style={[styles.dateDay, date.date === selectedDate ? styles.activeDateText : null]}>
        {date.day}
      </Text>
      <Text style={[styles.dateMonth, date.date === selectedDate ? styles.activeDateText : null]}>
        {date.month}
      </Text>
    </TouchableOpacity>
  );

  const StatusItem = ({ status }) => (
    <TouchableOpacity
      style={[styles.statusItem, status.style, activeStatus === status.id ? styles.activeStatus : null]}
      onPress={() => handleStatusPress(status.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.statusText, activeStatus === status.id ? styles.activeStatusText : null]}>
        {status.label}
      </Text>
    </TouchableOpacity>
  );

  const QuizItem = ({ quiz }) => {
    const status = quiz.status || 'unknown';
    
    const formattedStatus = status === 'Start' ? 'Start Quiz' : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <TouchableOpacity
        style={styles.quizItem}
        onPress={() => handleQuizPress(quiz)}
        activeOpacity={0.8}
      >
        <Text style={styles.quizTitle}>{quiz.title || 'Untitled'}</Text>
        <Text style={styles.quizStatus}>{formattedStatus}</Text>
      </TouchableOpacity>
    );
  };

  const TabItem = ({ tab, isActive }) => (
    <TouchableOpacity
      onPress={() => handleTabPress(tab.key)}
      style={styles.tab}
      activeOpacity={0.7}
    >
      {isActive ? (
        <View style={styles.activeTab}>
          <View style={styles.whiteOuterCircle}>
            <View style={styles.yellowCircle}>
              <Image source={tab.icon} style={styles.activeIcon} />
            </View>
          </View>
          <Text style={styles.activeLabel}>{tab.label}</Text>
        </View>
      ) : (
        <>
          <Image source={tab.icon} style={styles.inactiveIcon} />
          <Text style={styles.tabLabel}>{tab.label}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <Image   
              source={require('../assets/profiley.png')} 
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.greeting}>Hello!</Text>
              <Text style={styles.name}>.</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Today's Quiz</Text>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          {DATE_DATA.map(date => (
            <DateItem key={date.id} date={date} />
          ))}
        </View>

        {/* Status Filter */}
        <View style={styles.statusFilter}>
          {STATUS_FILTERS.map(status => (
            <StatusItem key={status.id} status={status} />
          ))}
        </View>

        {/* Quiz List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredQuizzes}
            renderItem={({ item }) => <QuizItem quiz={item} />}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noQuizzesText}>No quizzes found</Text>}
            contentContainerStyle={styles.quizList}
          />
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {TAB_CONFIG.map(tab => (
          <TabItem key={tab.key} tab={tab} isActive={tab.key === activeTab} />
        ))}
      </View>
    </View>
  );
};

export default Home;