import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet,  Image,
    useWindowDimensions,ScrollView} from 'react-native';
    import firebase from "firebase/compat";
    import { useIsFocused } from "@react-navigation/native";
    import {HeaderBackButton} from '@react-navigation/elements'
    import { useNavigation } from '@react-navigation/native';
    import { db } from './firebase';

export default OnboardingItem = ({item}) => {
    const { width, height } = useWindowDimensions();
    const [screenTime, setscreenTime] = useState();
    const navigation = useNavigation();
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

    useEffect(()=> {
      updateTimesVisited();
    },[])

    const updateScreenTimeInFirestore = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userId = user.uid;
          const screenTimeRef = firebase.firestore().collection('screenTimesLearn').doc(userId);
  
          // Fetch the current total screen time from Firestore
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
          const currentTimes = await doc.exists ? doc.data().socialAttacksTimes || 0 : 0;
  
  
          // Update the total screen time in Firestore
        if(savedP.optionSaved === true)
          {
            timesRef.set({
              socialAttacksTimes: currentTimes + 1
            }, {merge: true})
        }
        }
      } catch (error) {
        console.error('Error updating screen time in Firestore:', error);
      }
    };


    return(
      <ScrollView contentContainerStyle={{ }}>
      <View style={[{
    alignItems: 'center',
    justifyContent: 'center',}, {width: width}, {height: height}]}>
        {item.title === "Impersonation" &&  <Image source={require('./assets/Impersonation.jpg')} style={[styles.imageStyle]} resizeMode='contain'/>}
        {item.title === "Shoulder Surfing" &&  <Image source={require('./assets/shoulderSurfing.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Baiting" &&  <Image source={require('./assets/Baiting.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Pretexting" &&  <Image source={require('./assets/Pretexting.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Vishing" &&  <Image source={require('./assets/Vishing.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Whaling" &&  <Image source={require('./assets/whaling.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Eavesdropping" &&  <Image source={require('./assets/Eavesdropping.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Smishing" &&  <Image source={require('./assets/Smishing.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Spear Phishing" &&  <Image source={require('./assets/spearPhishing.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Tailgating" &&  <Image source={require('./assets/Tailgating.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
        {item.title === "Dumpster Diving" &&  <Image source={require('./assets/DumpsterDiving.jpg')} style={styles.imageStyle} resizeMode='contain'/>}
       
        <View style={{ flex: .6}} >
          <View style={{flex: .95}} >
          <Text style={styles.titleStyle}>{item.title}</Text>
          <Text style={styles.descriptionStyle}>{item.description}</Text>
          
        </View>
        </View>
          {item.id!=4 &&<View style={styles.notLast}>
            
           <Text style={styles.sliderStyle}>Slide right for next </Text>
          </View>}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor:'#121212'
  },
  notLast: {
    marginTop: 50,
   width:'100%',
    backgroundColor: 'rgba(255,255,255,.075)', 
    padding: 10, 
    
  },
  sliderStyle: {
    textAlign:'center', 
    fontSize: 20, 
    color: 'white', 
    fontWeight:'bold', 
  },
  descriptionStyle: {
    fontSize: 20, 
    color: 'white', 
    textAlign: 'center', 
    paddingHorizontal: 24
   
  },  
    imageStyle:{
      flex: .3,
      backgroundColor:'white',
     
  },
  titleStyle: {
    fontSize: 30, 
    marginTop: 10,
    color: 'white', 
    fontWeight:'bold', 
    textAlign: 'center', 
    marginBottom: 10
  }

  
})