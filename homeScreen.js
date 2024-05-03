import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import { auth } from './firebase';
import { db } from './firebase';
import firebase from "firebase/compat";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
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
        const screenTimeRef = firebase.firestore().collection('screenTimes').doc(userId);
        const dataDB = db.collection('preferences');
        const querySnapshot = await dataDB.where('uid', '==', userId).get();
        const savedP = querySnapshot.docs[0].data();

        // Fetch the current total screen time from Firestore
        const doc = await screenTimeRef.get();
        const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;

        // Update the total screen time in Firestore
        if (screenTime > 0 && savedP.optionSaved === true) {
          screenTimeRef.set({
            screen: 'homeScreen',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem('userToken');


      }).then(() => {
        navigation.replace('Login');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const homeOptions = [
    { category: 'Learn', screenName: 'Cybersecurity', paramsName: '' },
    { category: 'Quiz me', screenName: 'Testme', paramsName: 'allQuizzes', space: '' },
    { category: 'Human-based attacks', screenName: 'HumanBasedd', paramsName: '' },
    { category: 'Technology-based attacks', screenName: 'Technologybased', paramsName: ''},
    { category: 'Discussion Forum', screenName: 'GroupDiscussionScreen', paramsName: '' , space: 'Account' },
    { category: 'Profile', screenName: 'Profile', paramsName: '' },

  ]

  return (
    <ImageBackground source={require('./assets/Cybersecurityhome1.jpg')} style={styles.backgroundImage} resizeMode= 'stretch'>
      <View style={styles.overlay}>
        <View style={styles.mainView}>

          <Text style={styles.headerStyle}>Cybersecurity Training</Text>
          {homeOptions.map(({ category, screenName, paramsName, space }, index) => (
            <View key={category + index} style={{ width: '100%' }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: screenName,
                    params: { name: paramsName },
                    merge: true,
                  })}
                style={[styles.attackList, { backgroundColor: 'rgba(169,169,169,0.5)' }]}
              >
                <Text style={styles.categoryStyle}>{category}</Text>
              </TouchableOpacity>
              {space != null && (
                <Text key={category + index + 'space'} style={styles.adminStyle}>
                  {space}
                </Text>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={(handleSignOut)}
            style={[styles.attackList, { backgroundColor: 'rgba(169,169,169,0.5)' }]}>
            <Text style={styles.categoryStyle}>Logout</Text>
          </TouchableOpacity>
          {auth.currentUser.email != null && auth.currentUser.email === 'admin@admin.com' && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate({
                  name: 'Analytics',
                  params: { name: '' },
                  merge: true
                })}
              style={[styles.attackList, { backgroundColor: 'rgba(169,169,169,0.5)' }]}>
              <Text style={styles.categoryStyle}>Analytics</Text>
            </TouchableOpacity>
          )}
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
  adminStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 5,
    alignSelf: 'center'
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
  listArea: {
    flex: 1,
    width: "100%",
  },
  attackList:
  {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    margin: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5
  },
});

export default HomeScreen;