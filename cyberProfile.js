import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text,  StyleSheet,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebase';
import firebase from "firebase/compat";
import { useIsFocused } from "@react-navigation/native";
import {HeaderBackButton} from '@react-navigation/elements'

const CyberProfile = () => {
    const [currentProfile, setCurrentProfile] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const cyberProfileDataDB = db.collection('cyberProfileData');

    const [screenTime, setscreenTime] = useState();
    const isVisible = useIsFocused();

    const handleBackButton = () => {
      navigation.navigate('Cybersecurity');
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
        if (!isVisible)
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
          const screenTimeRef = firebase.firestore().collection('screenTimesLearn').doc(userId);
  
          const dataDB = db.collection('preferences');
          const querySnapshot = await dataDB.where('uid', '==', userId).get();  
          const savedP = querySnapshot.docs[0].data();
  
          // Fetch the current total screen time from Firestore
          const doc = await screenTimeRef.get();
          const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;
  
          // Update the total screen time in Firestore
        if(screenTime > 0 && savedP.optionSaved === true)
          {screenTimeRef.set({
            screen: 'Learn',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });}
        }
      } catch (error) {
        console.error('Error updating screen time in Firestore:', error);
      }
    };

    const updateTimesVisited = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userId = user.uid;
          const timesRef = firebase.firestore().collection('timesVisited').doc(userId);
  
          const dataDB = db.collection('preferences');
          const querySnapshot = await dataDB.where('uid', '==', userId).get();  
          const savedP = querySnapshot.docs[0].data();
  
          // Fetch the current total screen time from Firestore
          const doc = await timesRef.get();
          const currentTimes1 = await doc.exists ? doc.data().cybersecurityTimes || 0 : 0;
          const currentTimes2 = await doc.exists ? doc.data().whatAreTimes || 0 : 0;
          const currentTimes3 = await doc.exists ? doc.data().twoTypesTimes || 0 : 0;
          const currentTimes4 = await doc.exists ? doc.data().identifyTimes || 0 : 0;
          const currentTimes5 = await doc.exists ? doc.data().dailyAttacksTimes || 0 : 0;
          const currentTimes6 = await doc.exists ? doc.data().preventiveTimes || 0 : 0;
  
          // Update the total screen time in Firestore
        if(savedP.optionSaved === true)
          {
            switch (route.params.name) { 
              case 'Cybersecurity':
                timesRef.set({
                  cybersecurityTimes: currentTimes1 + 1}, { merge: true })
                break;
              case 'What are social engineering attacks':
                timesRef.set({
                  whatAreTimes: currentTimes2 + 1,}, { merge: true })
                break;
              case 'Two types of social engineering attacks':
                timesRef.set({
                  twoTypesTimes: currentTimes3 + 1}, { merge: true })
                break;
              case 'How to identify social engineering attacks':
                timesRef.set({
                  identifyTimes: currentTimes4 + 1}, { merge: true })
                break;
              case 'Most common attacks one could face daily':
                timesRef.set({
                  dailyAttacksTimes: currentTimes5 + 1}, { merge: true })
                break;
              case 'Preventive Measurements':
                timesRef.set({
                  preventiveTimes: currentTimes6 + 1,}, { merge: true })
                break;
            }
        }
        }
      } catch (error) {
        console.error('Error updating screen time in Firestore:', error);
      }
    };
    

  /* const cyberProfileData = async (datas) => {
        try { for (const data of datas) {
           const docRef = await cyberProfileDataDB.add(data);
              console.log('Data saved with ID:', docRef.id);}
            
          }catch (error) {
           console.error('Error saving data:', error);         
      }
    }
    
        cyberProfileData(cyberProfile6); //ADDS DATA TO FIREBASE COLLECTION "cyberProfileData" Do not remove comment unless you want to add to 'cyberProfileData' collection*/   
    const ProfileScreen = ({profileC}) => { 
      
        return (
          <View style={styles.mainView}>
            <ScrollView style={styles.scrollviewStyle}>
            <View style={styles.innerView}>
              <Text style={styles.titleStyles}>{route.params.name}</Text>
            </View>    
            <View style={styles.innerView2}>
              <Text style={styles.paragraphText}>
              {profileC[currentProfile].Text}
              </Text>
            </View>
            </ScrollView>
          </View>
          
        );
  };

  const getData = async () => {
    try {
      const snapshot = await cyberProfileDataDB.get();
      const data = [];

      snapshot.forEach((doc) => {
        const dataInfo = doc.data();
        data.push(dataInfo);
      });

      return data;
    } catch (error) {
      console.error('Error retrieving data info:', error);
      return [];
    }
  };

  const fetchData = async () => {
    const datas = await getData();
    const d1 = datas.filter((data) => data.category === 'Cybersecurity');
    const d2 = datas.filter((data) => data.category === 'What Is Social Engineering');
    const d3 = datas.filter((data) => data.category === 'Types of Attacks');
    const d4 = datas.filter((data) => data.category === 'Identify');
    const d5 = datas.filter((data) => data.category === 'Common Attacks');
    const d6 = datas.filter((data) => data.category === 'Preventive Measuments');
    

  switch (route.params.name) { 
    case 'Cybersecurity':
      setCurrentProfile(<ProfileScreen profileC={d1} />);
      break;
    case 'What are social engineering attacks':
      setCurrentProfile(<ProfileScreen profileC={d2} />);
      break;
    case 'Two types of social engineering attacks':
      setCurrentProfile(<ProfileScreen profileC={d3} />);
      break;
    case 'How to identify social engineering attacks':
      setCurrentProfile(<ProfileScreen profileC={d4} />);
      break;
    case 'Most common attacks one could face daily':
      setCurrentProfile(<ProfileScreen profileC={d5} />);
      break;
    case 'Preventive Measurements':
      setCurrentProfile(<ProfileScreen profileC={d6} />);
      break;
    default:
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView style={styles.listArea}></ScrollView>
        </View>
      );
    }
  }
  useEffect(() => {
    fetchData(); //useEffect allows the data to be loaded before components compared to useEffect() alone where data is not ready. the [] indiciated only run this once.
    updateTimesVisited(); 
  }, []);
  return(
    <View>
      {currentProfile ? (currentProfile) : (<View></View>)}
    </View>
  );
};

  const styles = StyleSheet.create({
    paragraphText: {
      fontSize: 20, 
      color: 'white', 
      padding: 10
    },
    innerView2: {
      padding: 10, 
      margin:10, 
      width:'100%'
    },
    titleStyles: {
      fontSize: 20, 
      color: 'white', 
      fontWeight: 'bold', 
      padding: 10
    },
    innerView: {
      backgroundColor: 'rgba(255,255,255,.10)', 
      padding: 10,  
      width:'100%', 
      alignItems: 'center',
    },
    scrollviewStyle: {
      width:'100%', 
      height:'100%'
    },
    mainView: {
      alignItems: 'center',  
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

  export default CyberProfile;