import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import SuccessCard from './screens/SuccessCard';
import FailCard from './screens/FailCard';
import Setting from './screens/Setting';
import ProfileScreen from './screens/ProfileScreen';
import Contact from './screens/Contact';
import Edit from './screens/Edit';
import Modules from './screens/Modules';
import Grade from './screens/Grade';
import Home from './screens/Home';
import BottomBar from './screens/BottomBar';



const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <FailCard/>
      </View>
    </SafeAreaView>
  );
};



export default App;
