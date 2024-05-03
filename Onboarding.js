import React, { useState, useEffect } from 'react';
import {View,  FlatList, } from 'react-native';
import OnboardingItem from './OnboardingItem';
import { db } from './firebase';

export default Onboarding = () => { 
    const slidesDB = db.collection('slidesData');
    const [currentData, setData] = useState(0);

  /*  const slidesData = async (datas) => {
         try { for (const data of datas) {
            const docRef = await slidesDB.add(data);
               console.log('Data saved with ID:', docRef.id);} IMAGES SAVED TO FIREBASE NEED TO BE CHANGED. 
             
           }catch (error) {
            console.error('Error saving data:', error);         
       }
     }
     
         slidesData(slides);*/

         const getData = async () => {
            try {
              const snapshot = await slidesDB.get();
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
            setData(datas);
          }

          useEffect(() => {
            fetchData();
          }, []);

    return (
        <View>
            <FlatList data={currentData} renderItem={({item}) => <OnboardingItem item={item}/>}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            bounces={false}
            keyExtractor={(item) =>item.id}
            />
        </View>
    )
}