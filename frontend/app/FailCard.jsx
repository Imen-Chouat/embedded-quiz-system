import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './FailCard.styles';
import BadjobImage from '../assets/Badjob.png';
import XImage from '../assets/X.png'; // Make sure you have this image in your assets

const FailCard = () => {
  return (
    <View style={styles.screenContainer}>
      {/* New X button in top right */}
      <TouchableOpacity style={styles.xButton}>
        <Image source={XImage} style={styles.xIcon} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        {/* Big full-width image */}
        <Image source={BadjobImage} style={styles.image} />
        
        {/* "Bad Job!" text below image */}
        <Text style={styles.badtext}>BAD JOB!</Text>
        
        {/* Red rectangle with content */}
        <View style={styles.redBackground}>
          <Text style={styles.score}>2/10</Text>
          <Text style={styles.points}>+20 Points</Text>
          <Text style={styles.message}>
            You answered 2 out of 10 questions correct see the detailed Report.
          </Text>
        </View>
        
        {/* View Report button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FailCard;