import React, { useState, useEffect } from 'react';
import { Image, ScrollView,View, Text, StyleSheet,  } from 'react-native';
import { useNavigation,  } from '@react-navigation/native';
import firebase from "firebase/compat";
import { useIsFocused } from "@react-navigation/native";
import {HeaderBackButton} from '@react-navigation/elements'
import { db } from './firebase';

const RealExamples = () => {
  const [screenTime, setscreenTime] = useState();
  const isVisible = useIsFocused();
  const navigation = useNavigation();
  const [textDatas, settextDatas] = useState();
  const [examplesData, setExamplesData] = useState([]);
  
 /* const dataDB = db.collection('realLifeExamples');

  /*const profileData = async (datas) => {
    try { for (const data of datas) {
       const docRef = await dataDB.add(data);
          console.log('Data saved with ID:', docRef.id);}
        
      }catch (error) {
       console.error('Error saving data:', error);         
  }
}

    profileData(textData2); //ADDS DATA TO FIREBASE COLLECTION. run it once on a useEffect.*/


    
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

    updateTimesVisited();
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


        const doc = await screenTimeRef.get();
        const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;


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

        const doc = await timesRef.get();
        const currentTimes = await doc.exists ? doc.data().realExampleTimes || 0 : 0;


        // Update the total screen time in Firestore
      if(savedP.optionSaved === true)
        {
          timesRef.set({
            realExampleTimes: currentTimes + 1
          }, {merge: true})
      }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const getData = async () => {
    try {
      const snapshot = await db.collection('realLifeExamples').get();
      const data = snapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error) {
      console.error('Error retrieving data info:', error);
      return [];
    }
  };


  const fetchData = async () => {
    const data = await getData();
    settextDatas(data);
    fillExamplesData(data);
  };

  const fillExamplesData = (data) => {
    const examples = data.map((item) => ({
      title: item.title, 
      text1: item.firstParagraph, 
      text2: item.secondParagraph, 
    }));
    setExamplesData(examples);
  };

  useEffect(() => {
    fetchData();
  }, []);

    return (
        <View style={styles.mainView}>
          <ScrollView style={styles.scrollviewStyle}>    
          {examplesData.map(({ title, text1, text2 }) => (
          <View key={title}>
            <View style={styles.viewStyle}>
              <Text style={styles.titleStyle}>{title}</Text>
            </View>
            <View style={styles.innerView}>
            {title === 'Texting' && <Image source={require('./assets/smsExample.png')} style={{resizeMode: 'contain'}}/>}
            
              <Text style={styles.paragraphStyle}>{text1}</Text>
              {title === 'Emails' &&<Image source={require('./assets/emailExample2.png')} style={{resizeMode: 'contain'}}/>}
              
              <Text style={styles.paragraphStyle}>{text2}</Text>
            </View>
          </View>
        ))}        
          </ScrollView>
          </View>        
      );
}

const styles = StyleSheet.create({
  paragraphStyle:
  {
    fontSize: 20, 
    color: 'white',  
    padding: 10
  },
  innerView: {
    padding: 10, 
    margin:10,
    backgroundColor: 'rgba(255,255,255,.10)', 
    borderRadius: 20, 
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: 20, 
    color: 'white',  
    fontWeight: 'bold', 
    padding: 10
  },
  viewStyle: {
    width:'100%', 
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,.10)', 
    borderBottomWidth:2, 
    borderRadius: 50
  },
  scrollviewStyle: {
    width:'100%', 
    height:'100%'
  },
  mainView: {
    alignItems: 'center',  
    backgroundColor:'#121212' 
  }

})

export default RealExamples;
