import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth } from './firebase';
import { db } from './firebase';
import firebase from "firebase/compat";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CyberSecurity = () => {
  const navigation = useNavigation();
  const [screenTime, setscreenTime] = useState();
  const isVisible = useIsFocused();

  useEffect(() => {
    var secCounter = 0;

    var secInterval = setInterval(() => {
      if (!isVisible) {
        clearInterval(secInterval)
        updateScreenTimeInFirestore();
      }
      else {
        secCounter++;
        setscreenTime(secCounter);
      }

    }, 1000)


    return () => clearInterval(secInterval);
  }, [isVisible]);

  const updateScreenTimeInFirestore = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const screenTimeRef = firebase.firestore().collection('screenTimesLearn').doc(userId);
        const dataDB = db.collection('preferences');
        const querySnapshot = await dataDB.where('uid', '==', userId).get();
        const savedP = querySnapshot.docs[0].data();

        // Fetch the current total screen time from Firestore
        const doc = await screenTimeRef.get();
        const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;

        // Update the total screen time in Firestore
        if (screenTime > 0 && savedP.optionSaved === true) {
          screenTimeRef.set({
            screen: 'Learn',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const cybersecurityOptions = [
    { category: 'What is Cybersecurity?', screenName: 'CybersecurityProfile', paramsName: 'Cybersecurity' },
    { category: 'What are social engineering attacks?', screenName: 'CybersecurityProfile', paramsName: 'What are social engineering attacks' },
    { category: 'What are the two types of social engineering attacks?', screenName: 'CybersecurityProfile', paramsName: 'Two types of social engineering attacks' },
    { category: 'How to identify social engineering attacks?', screenName: 'CybersecurityProfile', paramsName: 'How to identify social engineering attacks' },
    { category: 'Which type of cyberattacks could everyone face daily?', screenName: 'CybersecurityProfile', paramsName: 'Most common attacks one could face daily' },
    { category: 'Social Engineering Attacks', screenName: 'AllAttacks', paramsName: 'Social Engineering Attacks' },
    { category: 'Preventive Measurements', screenName: 'CybersecurityProfile', paramsName: 'Preventive Measurements' },
    { category: 'Real Life Examples', screenName: 'Examples', paramsName: 'Real Life Examples' },
  ]

  return (
    <ImageBackground source={require('./assets/Cybersecuritylearn.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.mainView}>
          <Text style={styles.headerStyle}>Cybersecurity Training</Text>
          {cybersecurityOptions.map(({ category, screenName, paramsName }) => (
            <TouchableOpacity
              key={category}
              style={styles.attackList}
              onPress={() =>
                navigation.navigate({
                  name: screenName,
                  params: { name: paramsName },
                  merge: true
                })}
            >
              <Text style={styles.categoryStyle}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryStyle: {
    fontSize: 20,
    color: 'yellow',
    fontWeight: 'bold'
  },
  headerStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center'
  },
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%'
  },
  attackList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    margin: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5
  },
});

export default CyberSecurity;