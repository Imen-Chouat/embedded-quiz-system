import React, { createContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importing screens
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import Home from './screens/Home';
import QuizScreen from './screens/QuizScreen';
import QuizScreenTime from './screens/QuizScreenTime';
import QuizScreenV2 from './screens/QuizScreenV2';
import QuizScreenV3 from './screens/QuizScreenV3';

import QuizCorrectionScreen from './screens/QuizCorrectionScreen';
import Modules from './screens/Modules';
import Grade from './screens/Grade';
import ProfileScreen from './screens/ProfileScreen';
import FailCard from './screens/FailCard';
import SuccessCard from './screens/SuccessCard';
import Edit from './screens/Edit';
import Notification from './screens/Notification';
import Setting from './screens/Setting';
import Contact from './screens/Contact';

// Import NotificationModal
import NotificationModal from './screens/NotificationModal';

// Stack Navigation
const Stack = createStackNavigator();

// Context for managing user data
export const UserContext = createContext();

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const studentData = await AsyncStorage.getItem('studentData');

        if (token && studentData) {
          const parsedStudentData = JSON.parse(studentData);
          parsedStudentData.accessToken = token;
          setUser(parsedStudentData);
        }
      } catch (error) {
        console.log("Error checking login status", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? "Home" : "SignInScreen"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
          <Stack.Screen name="QuizScreenTime" component={QuizScreenTime} />
          <Stack.Screen name="QuizScreenV2" component={QuizScreenV2} />
          <Stack.Screen name="QuizScreenV3" component={QuizScreenV3} />

          <Stack.Screen name="QuizCorrectionScreen" component={QuizCorrectionScreen} />
          <Stack.Screen name="Modules" component={Modules} />
          <Stack.Screen name="Grade" component={Grade} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="FailCard" component={FailCard} />
          <Stack.Screen name="SuccessCard" component={SuccessCard} />
          <Stack.Screen name="Edit" component={Edit} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="Notification" component={Notification} />
        </Stack.Navigator>

        {/* Render the NotificationModal conditionally based on the notification state */}
        <NotificationModal /> {/* This will now have access to the navigation prop */}
      </NavigationContainer>
    </UserContext.Provider>
  );
}
