import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Modules.styles';

const Modules = () => {
  return (
    <>
      {/* Back arrow */}
      <TouchableOpacity style={styles.backButton}>
        <Image source={require('../assets/list.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>My Modules</Text>
      </View>

      {/* Modules list */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.button1]}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Analyse 3</Text>
            <Text style={styles.buttonSubtitle}>math</Text>
            <Text style={styles.buttonDetails}>Ens Mahfoudi</Text>
          </View>
          <Image source={require('../assets/s1.png')} style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.button2]}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>SFDSD</Text>
            <Text style={styles.buttonSubtitle}>Structure de fichier et structure dynamique</Text>
            <Text style={styles.buttonDetails}>Ens Kermi</Text>
          </View>
          <Image source={require('../assets/s2.png')} style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.button3]}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Archi 2</Text>
            <Text style={styles.buttonSubtitle}>Architecture des ordinateurs</Text>
            <Text style={styles.buttonDetails}>Ens Sehad</Text>
          </View>
          <Image source={require('../assets/s3.png')} style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.button4]}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Algebre</Text>
            <Text style={styles.buttonSubtitle}>math</Text>
            <Text style={styles.buttonDetails}>Ens Ait Amrane</Text>
          </View>
          <Image source={require('../assets/s4.png')} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>

      {/* Updated Bottom Bar - matching the design you provided */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tab}>
          <Image source={require('../assets/home.png')} style={styles.inactiveIcon} />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={styles.activeTab}>
            <View style={styles.whiteOuterCircle}>
              <View style={styles.yellowCircle}>
                <Image source={require('../assets/image.png')} style={styles.activeIcon} />
              </View>
            </View>
            <Text style={styles.activeLabel}>Grade</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Image source={require('../assets/acc.png')} style={styles.inactiveIcon} />
          <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Modules;