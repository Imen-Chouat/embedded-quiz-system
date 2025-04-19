import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './SuccessCard.styles';
import GoodjobImage from '../assets/Goodjob.png';
import XImage from '../assets/X.png'; // Make sure you have this image in your assets

const SuccessCard = () => {
  return (
    <View style={styles.screenContainer}>
      {/* New X button in top right */}
      <TouchableOpacity style={styles.xButton}>
        <Image source={XImage} style={styles.xIcon} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        {/* Big full-width image */}
        <Image source={GoodjobImage} style={styles.image} />
        
        {/* "Bad Job!" text below image */}
      
        
        {/* Red rectangle with content */}
        <View style={styles.redBackground}>
          <Text style={styles.score}>8/10</Text>
          <Text style={styles.points}>+80 Points</Text>
          <Text style={styles.message}>
            You answered 8 out of 10 questions correct see the detailed Report.
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

export default SuccessCard;