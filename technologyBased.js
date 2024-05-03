import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text,  TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";
import { auth } from './firebase';
import { db } from './firebase';
import {HeaderBackButton} from '@react-navigation/elements'
import firebase from "firebase/compat";

const TechnologyBased = () => {
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
        headerLeft: () => (<HeaderBackButton onPress={()=>handleBackButton()} tintColor='white'></HeaderBackButton>) //have to manually update screentime as react navigation pops the current stack off the screen
      })
    })

  

    useEffect(() => {
      var secCounter = 0;

      var secInterval = setInterval(() => {
        if (!isVisible )
        {
          clearInterval(secInterval)
          updateScreenTimeInFirestore();      
        }
        else{
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
  
          // Fetch the current total screen time from Firestore
          const doc = await screenTimeRef.get();
          const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;
  
          // Update the total screen time in Firestore
        if(screenTime > 0 && savedP.optionSaved === true)
          {screenTimeRef.set({
            screen: 'HB',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });}
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
      getData(); //useEffect allows the data to be loaded before components compared to useEffect() alone where data is not ready. the [] indiciated only run this once. 
    }, [isVisible]); //isVisible makes useEffect refresh everytime the user opens the screen

    const getScoreColor = (scores) => {

      if(scores === 1)
      {
        return 'orange'
      }
      else if (scores === 2)
      {
        return 'yellow'
      }
      else if (scores === 3)
      {
        return 'green'
      }
      else{
        return'lightgrey'
      }

    }

    const techBasedAttacks = [
      {category: 'Smishing', screenName: 'Attackprofile', paramsName: 'Smishing'},
      {category: 'Vishing', screenName: 'Attackprofile', paramsName: 'Vishing'},
      {category: 'Whaling', screenName: 'Attackprofile', paramsName: 'Whaling'},
      {category: 'Spear Phishing', screenName: 'Attackprofile', paramsName: 'spearPhishing'},
      {category: 'Pretexting', screenName: 'Attackprofile', paramsName: 'Pretexting'},
    ]

    return (
      <ImageBackground source={require('./assets/techbased.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {techBasedAttacks.map(({ category, screenName, paramsname }) => (
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
    mainView: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor:'#121212', 
      width: '100%'
    },
    listArea: {
      flex: 1,
      width: "100%"
    },
    attackList: 
    {
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

  export default TechnologyBased;