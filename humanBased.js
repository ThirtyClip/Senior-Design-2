import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import { auth } from './firebase';
import { db } from './firebase';
import { HeaderBackButton } from '@react-navigation/elements'
import firebase from "firebase/compat";

const HumanBased = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState();
  const dataDB = db.collection('scores');
  const isVisible = useIsFocused();
  const [screenTime, setscreenTime] = useState();

  const handleBackButton = () => {
    navigation.navigate('Home');
    updateScreenTimeInFirestore();
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<HeaderBackButton onPress={() => handleBackButton()} tintColor='white'></HeaderBackButton>)
    })
  })

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
        const screenTimeRef = firebase.firestore().collection('screenTimesHB').doc(userId);

        const dataDB = db.collection('preferences');
        const querySnapshot = await dataDB.where('uid', '==', userId).get();
        const savedP = querySnapshot.docs[0].data();

        const doc = await screenTimeRef.get();
        const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;

        if (screenTime > 0 && savedP.optionSaved === true) {
          screenTimeRef.set({
            screen: 'HB',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const getData = async () => {
    try {
      const snapshot = await dataDB.where('userid', '==', auth.currentUser.uid).get();
      const progressData = snapshot.docs.map((doc) => doc.data());
      setProgress(progressData);
    } catch (error) {
      console.error('Error retrieving data info:', error);
      setProgress([]);
    }
  };

  useEffect(() => {
    getData();
  }, [isVisible]);

  const getScoreColor = (scores) => {
    if (scores === 1) {
      return 'orange'
    }
    else if (scores === 2) {
      return 'yellow'
    }
    else if (scores === 3) {
      return 'green'
    }
    else {
      return 'lightgrey'
    }
  }

  const humanBasedAttacks = [
    { category: 'Impersonation', screenName: 'Attackprofile', paramsname: 'Impersonation' },
    { category: 'Eavesdropping', screenName: 'Attackprofile', paramsname: 'Eavesdropping' },
    { category: 'Shoulder Surfing', screenName: 'Attackprofile', paramsname: 'Shoulder Surfing' },
    { category: 'Dumpster Diving', screenName: 'Attackprofile', paramsname: 'Dumpster Diving' },
    { category: 'Tailgating/Piggybacking', screenName: 'Attackprofile', paramsname: 'Tailgating/Piggybacking' },
    { category: 'Baiting', screenName: 'Attackprofile', paramsname: 'Baiting' },
  ]

  return (
    <ImageBackground source={require('./assets/Cybersecurityhuman.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {humanBasedAttacks.map(({ category, screenName, paramsname }) => (
            <TouchableOpacity key={category} style={styles.attackList} onPress={() =>
              navigation.navigate({
                name: screenName,
                params: { name: paramsname },
                merge: true
              })}>
              <Text style={styles.categoryStyle}>{category}</Text>
              {progress && progress.length > 0 ? (
                <View style={{ width: '100%' }}>
                  <Text style={{ color: getScoreColor(progress.find((item) => item.quizName === paramsname)?.scores), alignSelf: 'flex-end' }}>score: {progress.find((item) => item.quizName === paramsname)?.scores || '0'}/3</Text>
                  <View style={{ borderRadius: 10, borderColor: getScoreColor(progress.find((item) => item.quizName === paramsname)?.scores), borderWidth: 2, width: '100%', marginTop: 5 }}></View>
                </View>
              ) :
                (
                  <View style={{ width: '100%' }}>
                    <Text style={styles.scoreStyle}>score: 0/3</Text>
                    <View style={styles.underlineStyle}></View>
                  </View>
                )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  underlineStyle: {
    borderRadius: 10,
    borderColor: 'lightgrey',
    borderWidth: 2,
    width: '100%',
    marginTop: 5
  },
  scoreStyle: {
    color: 'lightgrey',
    alignSelf: 'flex-end'
  },
  categoryStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  attackList: {
    backgroundColor: 'rgba(255,255,255,.10)',
    padding: 10,
    margin: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
    width: '100%'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default HumanBased;
