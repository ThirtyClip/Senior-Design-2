import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet, ScrollView } from 'react-native';
import { db } from './firebase';
import { useIsFocused } from "@react-navigation/native";
import firebase from 'firebase/compat';

const AnalyticsScreen = () => {
    const isVisible = useIsFocused();
    const [total24hrsActivity, settotal24hrsActivity] = useState();
    const [usersTotal, setusersTotal] = useState();
    const [totalSeconds, settotalSeconds] = useState();
    const [homeUsers, sethomeUsers] = useState();
    const [totalSecondsHB, settotalSecondsHB] = useState();
    const [totalSecondsLearn, settotalSecondsLearn] = useState();
    const [totalSecondsQuiz, settotalSecondsQuiz] = useState();
    const [learnUsers, setlearnUsers] = useState();
    const [hbUsers, sethbUsers] = useState();
    const [quizUsers, setquizUsers] = useState();
    const [total48hrs, settotal48hrs] = useState();
    const [lastWeek, setlastWeek] = useState();
    const [timesVisited, settimesVisited] = useState({
      Cyber:0,
      WhatAre: 0,
      TwoTypes: 0,
      Identity:0,
      Daily: 0,
      Preventive: 0,
      Examples: 0,
      Attacks: 0,
      Impersonation: 0,
      Eavesdropping: 0,
      ShoulderSurfing: 0,
      DumpsterDiving: 0,
      Tailgating: 0,
      Baiting: 0,
      Smishing: 0,
      Vishing: 0,
      Whaling: 0,
      SpearPhishing: 0,
      Pretexting: 0,
    });

    const getTimesVisited = async () => {
      const querySnapshot = await db.collection('timesVisited').get();
      const categoryKeys = [
        'cybersecurityTimes', 'whatAreTimes', 'twoTypesTimes', 'identifyTimes', 'dailyAttacksTimes',
        'preventiveTimes', 'realExampleTimes', 'socialAttacksTimes', 'impersonationStudyTimes',
        'eavesdroppingStudyTimes', 'shoulderStudyTimes', 'dumpsterStudyTimes', 'tailgatingStudyTimes',
        'baitingStudyTimes', 'smishingStudyTimes', 'vishingStudyTimes', 'whalingStudyTimes',
        'spearStudyTimes', 'pretextingStudyTimes'
      ];
    
      const categoryTotals = categoryKeys.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {});
    
      querySnapshot.forEach((doc) => {
        categoryKeys.forEach((category) => {
          categoryTotals[category] += doc.data()[category] || 0;
        });
      }); 
      const arrayOfVisited = Object.values(categoryTotals);
      return arrayOfVisited; 
    }

    

    const usersLoggedInTimestamp = async () => {
        const now = new Date();
        const last24hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);  
        const querySnapshot = await firebase.firestore().collection('users').where('lastLoginField', '>', last24hours).get();
        const totalUsers = querySnapshot.docs.map((doc) => doc.data());
        return totalUsers.length;
    }

    const usersLoggedInTimestamp1 = async () => {
      const now = new Date(); 
      const last48hours = new Date(now.getTime() - 48 * 60 * 60 * 1000); 
      const last24hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);   
      const querySnapshot = await firebase.firestore().collection('users').where('lastLoginField', '>', last48hours).where('lastLoginField', '<', last24hours).get(); //get users that logged in between 24 hrs to 48 hrs ago
      const totalUsers = querySnapshot.docs.map((doc) => doc.data());
      const total = totalUsers.length;
      return total;
      
        
  }
  const usersLoggedInTimestamp2 = async () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 168 * 60 * 60 * 1000); 
    const last24hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);  
    const querySnapshot = await firebase.firestore().collection('users').where('lastLoginField', '>', lastWeek).where('lastLoginField', '<', last24hours).get();
    const totalUsers = querySnapshot.docs.map((doc) => doc.data());
    const total = totalUsers.length;
    return total;
}

    const totalAmountUsers = async () => {
        const querySnapshot = await firebase.firestore().collection('preferences').get();     
        const amount = querySnapshot.docs.map((doc) => doc.data());
        totalAmount = amount.length;
        return totalAmount;
    }
    

    const averageScreenTime = async () => {
          try{
            const screenTimeSnapshot = await firebase.firestore().collection('screenTimes').get();
          var totalSecs = 0;
          screenTimeSnapshot.forEach((doc) => { //looping across all users
              const seconds = doc.data().totalScreenTime || 0; // time from each user
              const screen = doc.data().screen;
              if (screen === 'homeScreen') {
              totalSecs += seconds;          
            }            
          })

          return totalSecs;
        } catch (error) {
            console.log('Error calculating overall screen time:', error);
            return 0;
          }
      }

      const averageScreenTimeHB = async () => {
        try{
          const screenTimeSnapshot = await firebase.firestore().collection('screenTimesHB').get();
        var totalSecs = 0;
        screenTimeSnapshot.forEach((doc) => { //looping across all users
            const seconds = doc.data().totalScreenTime || 0; // time from each user
            const screen = doc.data().screen;
            if (screen === 'HB') {
            totalSecs += seconds;          
          }            
        })

        return totalSecs;
      } catch (error) {
          console.log('Error calculating overall screen time:', error);
          return 0;
        }
    }

    const averageScreenTimeQuiz = async () => {
      try{
        const screenTimeSnapshot = await firebase.firestore().collection('screenTimesQuiz').get();
      var totalSecs = 0;
      screenTimeSnapshot.forEach((doc) => { //looping across all users
          const seconds = doc.data().totalScreenTime || 0; // time from each user
          const screen = doc.data().screen;
          if (screen === 'Quiz') {
          totalSecs += seconds;          
        }            
      })

      return totalSecs;
    } catch (error) {
        console.log('Error calculating overall screen time:', error);
        return 0;
      }
  }

      const averageScreenTimeLearn = async () => {
        try{
          const screenTimeSnapshot = await firebase.firestore().collection('screenTimesLearn').get();
        var totalSecs = 0;
        screenTimeSnapshot.forEach((doc) => { //looping across all users
            const seconds = doc.data().totalScreenTime || 0; // time from each user
            const screen = doc.data().screen;
            if (screen === 'Learn') {
            totalSecs += seconds;          
          }            
        })

        return totalSecs;
      } catch (error) {
          console.log('Error calculating overall screen time:', error);
          return 0;
        }
    }

    const usersinLearn = async () => {
      const usersinLearn = await firebase.firestore().collection('screenTimesLearn').where('screen', '==', 'Learn').get()
      const learnAmount = usersinLearn.docs.map((doc) => doc.data());
      totallearnAmount = learnAmount.length;
      return totallearnAmount;
    }

    const usersinHB = async () => {
      const usersin = await firebase.firestore().collection('screenTimesHB').where('screen', '==', 'HB').get()
      const amount = usersin.docs.map((doc) => doc.data());
      totalAmount = amount.length;
      return totalAmount;
    }
    const usersinQuiz = async () => {
      const usersin = await firebase.firestore().collection('screenTimesQuiz').where('screen', '==', 'Quiz').get()
      const amount = usersin.docs.map((doc) => doc.data());
      totalAmount = amount.length;
      return totalAmount;
    }

      const usersinHome = async () => {
        const usersinHome = await firebase.firestore().collection('screenTimes').where('screen', '==', 'homeScreen').get()
        const homeAmount = usersinHome.docs.map((doc) => doc.data());
        totalhomeAmount = homeAmount.length;
        return totalhomeAmount;
      }
              

    useEffect(() => {
        usersLoggedInTimestamp().then((data) => {
            settotal24hrsActivity(data) // in here we use .then(data) to fetch the data from the database first then assigning it. Not doing this will cause read-only rejection
        })

        getTimesVisited().then((data) => {
          const categories = [
            'Cyber',
            'WhatAre',
            'TwoTypes',
            'Identity',
            'Daily',
            'Preventive',
            'Examples',
            'Attacks',
            'Impersonation',
            'Eavesdropping',
            'ShoulderSurfing',
            'DumpsterDiving',
            'Tailgating',
            'Baiting',
            'Smishing',
            'Vishing',
            'Whaling',
            'SpearPhishing',
            'Pretexting',
          ];
        
          const updatedTimesVisited = {};
        
          categories.forEach((category, index) => {
            updatedTimesVisited[category] = data[index] || 0; //Another way of updatedTimesVisited.Cyber/WhatAre/TwoTypes through a for-loop... First iteration creates updatedTimesVisited['Cyber'] with cyber as key. 2nd ...['WhatAre']
          });
        
          settimesVisited({ ...timesVisited, ...updatedTimesVisited });
          
        })

        usersLoggedInTimestamp1().then((data) => {
          settotal48hrs(data) 
      })

      usersLoggedInTimestamp2().then((data) => {
        setlastWeek(data) 
    })

        totalAmountUsers().then((data)=> {
            setusersTotal(data);
        })

        averageScreenTime().then((data) => {
          settotalSeconds(data);
        })

        averageScreenTimeLearn().then((data) => {
          settotalSecondsLearn(data);
        })
        averageScreenTimeHB().then((data) => {
          settotalSecondsHB(data);
        })
        averageScreenTimeQuiz().then((data) => {
          settotalSecondsQuiz(data);
      })

        usersinHome().then((data) => {
            sethomeUsers(data);
        })
        usersinLearn().then((data) => {
          setlearnUsers(data);
        })
        usersinHB().then((data) => {
          sethbUsers(data);
        })
        usersinQuiz().then((data) => {
          setquizUsers(data);
        })
        }, [isVisible]);

        const getChangeColor = (scores) => {

          if(scores > 0)
          {
            return 'green'
          }
          else if (scores < 0)
          {
            return 'red'
          }
          else if (scores === 0)
          {
            return 'lightgrey'
          }
          else{
            return'lightgrey'
          }
    
        }

        const categoryData = [
          { category: 'Cyber', label: 'What is Cybersecurity:' },
          { category: 'WhatAre', label: 'What are social engineering attacks:' },
          { category: 'TwoTypes', label: 'Two types of attacks:' },
          { category: 'Daily', label: 'Everyone faces daily:' },
          { category: 'Attacks', label: 'Social Engineering Attacks:' },
          { category: 'Identity', label: 'How to identify: ' }, 
          { category: 'Preventive', label: 'Preventive Measurements:' }, 
          { category: 'Examples', label: 'Real Life Examples:' },
          { category: 'Impersonation', label: 'Impersonation Case Study:' },
          { category: 'Eavesdropping', label: 'Eavesdropping Case Study:' },
          { category: 'ShoulderSurfing', label: 'Shoulder Surfing Case Study:' },
          { category: 'DumpsterDiving', label: 'Dumpster Diving Case Study:' },
          { category: 'Tailgating', label: 'Tailgating Case Study:' },
          { category: 'Baiting', label: 'Baiting Case Study:' },
          { category: 'Smishing', label: 'Smishing Case Study:' },
          { category: 'Vishing', label: 'Vishing Case Study:' },
          { category: 'Whaling', label: 'Whaling Case Study:' },
          { category: 'SpearPhishing', label: 'Spear Phishing Case Study:' },
          { category: 'Pretexting', label: 'Pretexting Case Study:' },
        ];

        const analyticsData = [
          {category: 'Average Time in Home', dataTime:'totalSeconds', dataLength: 'homeUsers' },
          {category: 'Average time in Learn', dataTime:'totalSecondsLearn', dataLength: 'learnUsers' },
          {category: 'Average time in Category', dataTime:'totalSecondsHB', dataLength: 'hbUsers' },
          {category: 'Average time in Quizzes', dataTime:'totalSecondsQuiz', dataLength: 'quizUsers' },
          {category: 'Total users registered', dataTime:'usersTotal', dataLength: '' },
        ]

        const averageTime = (dataTime) => {
            if(dataTime === 'totalSeconds')
            {
              return Math.floor(totalSeconds/ homeUsers)+ 's';
            }
            else if (dataTime === 'totalSecondsLearn')
            {
              return Math.floor(totalSecondsLearn / learnUsers)+ 's';
            }
            else if (dataTime === 'totalSecondsHB')
            {
              return Math.floor(totalSecondsHB / hbUsers)+ 's';
            }
            else if (dataTime === 'totalSecondsQuiz')
            {
              return Math.floor(totalSecondsQuiz/ quizUsers)+ 's';;
            }
            else if (dataTime === 'usersTotal')
            {
              return usersTotal;
            }
        };


        const changeMath = (timePassed) => {
          if (timePassed === 'total48hrs') {
            return total48hrs ? Math.round(((total24hrsActivity- total48hrs)/total48hrs)*100)+ '% 48hrs' : total24hrsActivity*100 + '% 48hrs'; /*if total48hrs is false/0 then only use 24hrs number*/ 
          } 
          if (timePassed === 'lastWeek') {
            return lastWeek ? Math.round(((total24hrsActivity- lastWeek)/lastWeek)*100) +'% 1w': total24hrsActivity*100 + '% 1w';  
          }
        };

        
    return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollviewContainer}>
            <Text style={styles.textHeader}>Users Logged in: </Text>
            <View style={styles.viewBox}>
              <Text style={styles.calculatedValue}>{total24hrsActivity} </Text>
              <Text style={styles.categoryStyles}>Total users last 24 hours</Text>
              <View style={{flexDirection:'row', alignSelf:'center' }}>
              <Text style={[styles.colorValueStyles, {color: getChangeColor(Math.round(((total24hrsActivity- total48hrs)/total48hrs)*100))}]}>{changeMath('total48hrs')}</Text> 
              <Text style={[styles.colorValueStyles, {color: getChangeColor(Math.round(((total24hrsActivity- total48hrs)/total48hrs)*100))}]}>{changeMath('lastWeek')}</Text>
              </View>
              <Text style={styles.categoryStyles}>Total change</Text>
            </View>
            <Text style={styles.textHeader}>Screen Times & Users Registered:</Text>
            {analyticsData.map(({ category, dataTime}) => (
              <View key={category} style={styles.viewBox}>
                <Text style={styles.calculatedValue}>{averageTime(dataTime)}</Text>
                <Text style={styles.categoryStyles}>{[category]}</Text>
              </View>
            ))}
            
            <Text style={styles.textHeader}>Total times visited:</Text>
            {categoryData.map(({ category, label }) => (
              <View key={category} style={styles.screenTimeViewBox}>
                <Text style={styles.categoryStyles}>{label}</Text>
                <Text style={styles.categoryStyles}>{timesVisited[category]}</Text>
              </View>
            ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  screenTimeViewBox: {
    margin: 10, 
    backgroundColor: 'rgba(255,255,255,.03)', 
    padding: 30, 
    width: '100%', 
    borderRadius: 20, 
    alignSelf: 'center', 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  colorValueStyles: {
    fontSize: 20, 
    color: 'white', 
    fontWeight:'bold',  
    alignSelf: 'center', 
    padding: 10, 
  },
  categoryStyles: {
    fontSize: 16, 
    color: 'white', 
    fontWeight:'bold',  
    alignSelf: 'center' 
  },
  calculatedValue: {
    fontSize: 30, 
    color: 'white', 
    fontWeight:'bold', 
    alignSelf: 'center', 
    padding: 10, 
    color: 'green'
  },
  viewBox: {
    margin: 10, 
    backgroundColor: 'rgba(255,255,255,.03)', 
    padding: 30, 
    width:'75%', 
    borderRadius: 20, 
    alignSelf:'center'  
  },
  textHeader: {
    fontSize: 20, 
    color: 'white', 
    fontWeight:'bold',  
    alignSelf:'center'
  },
    scrollviewContainer: {
      width:'100%', alignContent:'center'
    },
    container: {
      backgroundColor:'#121212',
     
      alignItems: 'center',
      padding: 16,
      height: '100%',
      justifyContent:'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color:'white',
      marginBottom: 10
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 16,
      paddingLeft: 10,
      color:'black',
      backgroundColor: 'white',
    },
    button: {
      backgroundColor: 'rgba(255,255,255,.05)',
      padding: 10,
      width: '100%', 
      margin: 5,
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default AnalyticsScreen;