import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, StyleSheet,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebase';
import firebase from "firebase/compat";
import { useIsFocused } from "@react-navigation/native";
import {HeaderBackButton} from '@react-navigation/elements'


const CaseStudy = () => {
    const [currentProfile, setCurrentProfile] = useState(0);
    const route = useRoute();
    const navigation = useNavigation();
    const dataDB = db.collection('caseStudy');
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

      updateTimesVisited();
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
    
    

 /*  const profileData = async (datas) => {
        try { for (const data of datas) {
           const docRef = await dataDB.add(data);
              console.log('Data saved with ID:', docRef.id);}
            
          }catch (error) {
           console.error('Error saving data:', error);         
      }
    }
    
        profileData(cs1); //ADDS DATA TO FIREBASE COLLECTION */   
       
    
        const ProfileScreen = ({profileC}) => { 
        return (
          <View style={styles.mainView}>
            <ScrollView style={styles.scrollviewStyle}>
            <View style={styles.viewTitle}>
              <Text style={styles.titleStyle}>{profileC[currentProfile].title}</Text>
            </View>    
            <View style={styles.innerView}>
              <Text style={styles.paragraphText}>
              {profileC[currentProfile].description}
              </Text>
            </View>
            <View>
                <Text style={styles.titleStyle}>KeyPoints:</Text>
            </View>
            <View style={styles.innerView}>
              <Text style={styles.paragraphText}>
              {profileC[currentProfile].keyPoints}
              </Text>
            </View>
            <View>
                <Text style={styles.titleStyle}>Preventive Measurements:</Text>
            </View>
            <View style={styles.innerView}>
              <Text style={styles.paragraphText}>
              {profileC[currentProfile].preventiveMeasures}
              </Text>
            </View>
            </ScrollView>
          </View>
          
        );
  };

  const getData = async () => {
    try {
      const snapshot = await dataDB.get();
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
        const currentTimes1 = await doc.exists ? doc.data().impersonationStudyTimes || 0 : 0;
        const currentTimes2 = await doc.exists ? doc.data().eavesdroppingStudyTimes || 0 : 0;
        const currentTimes3 = await doc.exists ? doc.data().shoulderStudyTimes || 0 : 0;
        const currentTimes4 = await doc.exists ? doc.data().dumpsterStudyTimes || 0 : 0;
        const currentTimes5 = await doc.exists ? doc.data().tailgatingStudyTimes || 0 : 0;
        const currentTimes6 = await doc.exists ? doc.data().baitingStudyTimes || 0 : 0;
        const currentTimes7 = await doc.exists ? doc.data().smishingStudyTimes || 0 : 0;
        const currentTimes8 = await doc.exists ? doc.data().vishingStudyTimes || 0 : 0;
        const currentTimes9 = await doc.exists ? doc.data().whalingStudyTimes || 0 : 0;
        const currentTimes10 = await doc.exists ? doc.data().spearStudyTimes || 0 : 0;
        const currentTimes11= await doc.exists ? doc.data().pretextingStudyTimes || 0 : 0;

        // Update the total screen time in Firestore
      if(savedP.optionSaved === true)
        {
          switch (route.params.name) { 
            case 'Impersonation':
              timesRef.set({
                impersonationStudyTimes: currentTimes1 + 1,}, { merge: true })
              break;
            case 'Eavesdropping':
              timesRef.set({
                eavesdroppingStudyTimes: currentTimes2 + 1,}, { merge: true })
              break;
            case 'Shoulder Surfing':
              timesRef.set({
                shoulderStudyTimes: currentTimes3 + 1,}, { merge: true })
              break;
            case 'Dumpster Diving':
              timesRef.set({
                dumpsterStudyTimes: currentTimes4 + 1,}, { merge: true })
              break;
            case 'Tailgating/Piggybacking':
              timesRef.set({
                tailgatingStudyTimes: currentTimes5 + 1,}, { merge: true })
              break;
            case 'Baiting':
              timesRef.set({
                baitingStudyTimes: currentTimes6 + 1,}, { merge: true })
              break;
            case 'Smishing':
              timesRef.set({
                smishingStudyTimes: currentTimes7 + 1,}, { merge: true })
                break;
            case 'Vishing':
              timesRef.set({
                vishingStudyTimes: currentTimes8 + 1,}, { merge: true })
                break;
            case 'Whaling':
              timesRef.set({
                whalingStudyTimes: currentTimes9 + 1,}, { merge: true })
                break;
            case 'spearPhishing':
              timesRef.set({
                spearStudyTimes: currentTimes10 + 1,}, { merge: true })
                break;
            case 'Pretexting':
              timesRef.set({
                pretextingStudyTimes: currentTimes11 + 1,}, { merge: true })
                break;    
          }
      }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const fetchData = async () => {
    const datas = await getData();
      const d1 = datas.filter((data) => data.title === 'Impersonation - Blending in');
      const d2 = datas.filter((data) => data.title === 'Eavesdropping - Listening closely');
      const d3 = datas.filter((data) => data.title === 'Shoulder Surfing - Unawareness');
      const d4 = datas.filter((data) => data.title === 'Dumpster Diving - Improper disposal');
      const d5 = datas.filter((data) => data.title === 'Piggybacking - Unverified delivery');
      const d6 = datas.filter((data) => data.title === 'Baiting - Tempting offer');
      const d7 = datas.filter((data) => data.title === 'Smishing - Unexpected text message');
      const d8 = datas.filter((data) => data.title === 'Vishing - Urgent call');
      const d9 = datas.filter((data) => data.title === 'Whaling - Urgent and confidential request');
      const d10 = datas.filter((data) => data.title === ' Spear Phishing - Targeted attack');
      const d11 = datas.filter((data) => data.title === 'Pretexting - Made up story');


  switch (route.params.name) { 
    case 'Impersonation':
      setCurrentProfile(<ProfileScreen profileC={d1} />);
      break;
    case 'Eavesdropping':
      setCurrentProfile(<ProfileScreen profileC={d2} />);
      break;
    case 'Shoulder Surfing':
      setCurrentProfile(<ProfileScreen profileC={d3} />);
      break;
    case 'Dumpster Diving':
      setCurrentProfile(<ProfileScreen profileC={d4} />);
      break;
    case 'Tailgating/Piggybacking':
      setCurrentProfile(<ProfileScreen profileC={d5} />);
      break;
    case 'Baiting':
      setCurrentProfile(<ProfileScreen profileC={d6} />);
      break;
    case 'Smishing':
        setCurrentProfile(<ProfileScreen profileC={d7} />);
        break;
    case 'Vishing':
        setCurrentProfile(<ProfileScreen profileC={d8} />);
        break;
    case 'Whaling':
        setCurrentProfile(<ProfileScreen profileC={d9} />);
        break;
    case 'spearPhishing':
        setCurrentProfile(<ProfileScreen profileC={d10} />);
        break;
    case 'Pretexting':
        setCurrentProfile(<ProfileScreen profileC={d11} />);
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
    innerView: {
      padding: 10, 
      margin:10, 
      width:'100%',
    },
    titleStyle: {
      fontSize: 20, 
      color: 'white', 
      fontWeight: 'bold', 
      padding: 10
    },
    viewTitle: {
      backgroundColor: 'rgba(255,255,255,.10)', 
      padding: 10,  
      width:'100%', 
      alignItems: 'center',
    },
    scrollviewStyle:
    {
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

  export default CaseStudy;