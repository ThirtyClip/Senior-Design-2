import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements'
import firebase from "firebase/compat";
import { useIsFocused } from "@react-navigation/native";

const AttackProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const isVisible = useIsFocused();
    const [screenTime, setscreenTime] = useState();

    const handleBackButton = () => {
      navigation.goBack();
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
          const doc = await screenTimeRef.get();
          const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;

          if(screenTime > 0 )
          {screenTimeRef.set({
            screen: 'HB',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });}
        }
      } catch (error) {
        console.error('Error updating screen time in Firestore:', error);
      }
    };
    
    return (
        <View style={styles.mainView}>
        <TouchableOpacity onPress={() =>
            navigation.navigate({
              name: 'Casestudy',
              params: { name: route.params.name},
              merge: true
            })
          }
          style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Case Study</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>
            navigation.navigate({
              name: 'Testme',
              params: { name: route.params.name},
              merge: true
            })
          }
          style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Quiz me</Text>
        </TouchableOpacity>
      </View>
      );
  };

  const styles = StyleSheet.create({
    buttonStyle: {
      backgroundColor: 'rgba(255,255,255,.10)',
      padding: 10, 
      margin: 10, 
      width: 300, 
      alignItems: 'center', 
      borderRadius: 50
    },
    buttonText: {
      fontSize: 20, 
      color: 'white', 
      fontWeight:'bold', 
    },
    mainView: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',  
      backgroundColor:'#121212'
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
  });

  export default AttackProfile;