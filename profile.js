import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { auth, db } from './firebase';
import { useIsFocused } from "@react-navigation/native";

const ProfileScreen = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [quizScores, setQuizScores] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizAverage, setQuizAverage] = useState(0);
  const isVisible = useIsFocused();
  const dataDB = db.collection('preferences');
  const scoresDB = db.collection('scores');

  const handleSwitchChange = () => {
    setIsEnabled(previousState => !previousState);
    updatePreferences(auth.currentUser.uid, !isEnabled);
  };

  const handleChangePassword = async () => {
    try {
      await auth.currentUser.updatePassword(password);
      setPasswordChanged(true);
      setPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleChangeEmail = async () => {
    try {
      await auth.currentUser.updateEmail(newEmail);
      Alert.alert('Success', 'Email address updated successfully.');
      setNewEmail('');
    } catch (error) {
      console.error('Error changing email:', error);
    }
  };

  const handleChangeName = async () => {
    try {
      await auth.currentUser.updateProfile({
        displayName: newName
      });
      Alert.alert('Success', 'Name updated successfully.');
      setNewName('');
    } catch (error) {
      console.error('Error changing name:', error);
    }
  };

  const updatePreferences = async (userId, optionEnable) => {
    try {
      const querySnapshot = await dataDB.where('uid', '==', userId).get();
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await docRef.update({ optionSaved: optionEnable });
        console.log('Preferences updated successfully.');
      } else {
        console.log('No document found with the specified userId.');
      }
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  const getData = async () => {
    try {
      const snapshot = await scoresDB.where('userid', '==', auth.currentUser.uid).get();
  
      const scores = [];
      let sum = 0;
  
      snapshot.forEach(doc => {
        const score = doc.data().scores;
        scores.push(score);
        sum += score;
      });
  
      const numAttempts = scores.length;
      const quizAverage = numAttempts > 0 ? sum / numAttempts : 0;
  
      setQuizScores(scores);
      setQuizAttempts(numAttempts);
      setQuizAverage(quizAverage);
  
      const latestScore = numAttempts > 0 ? Math.max(...scores) : 0;
      setLastQuizScore(latestScore);
    } catch (error) {
      console.error('Error retrieving data info:', error);
    }
  };  
  
  useEffect(() => {
    getData();
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Account Details</Text>
      <View style={styles.box}>
        <Text style={styles.textStyle}>Name: {auth.currentUser?.displayName}</Text>
        <Text style={styles.textStyle}>Email: {auth.currentUser?.email}</Text>
      </View>
      <Text style={styles.titleStyle}>Preferences</Text>
      <View style={styles.box}>
        <Text style={styles.textStyle}>Track Data </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#5C985C' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleSwitchChange}
          value={isEnabled}
        />
      </View>
      <Text style={styles.titleStyle}>Change Options</Text>
      <View style={styles.optionsContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="New Email"
          value={newEmail}
          onChangeText={text => setNewEmail(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="New Name"
          value={newName}
          onChangeText={text => setNewName(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangeName}>
          <Text style={styles.buttonText}>Change Name</Text>
        </TouchableOpacity>
      </View>
      {passwordChanged && (
        <Text style={styles.successMessage}>Password changed successfully!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 16,
    height: '100%'
  },
  titleStyle: {
    fontSize: 20,
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 10
  },
  box: {
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  textStyle: {
    fontSize: 15,
    color: 'purple',
    fontWeight: 'bold',
    marginVertical: 5
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: '100%',
    marginVertical: 5,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
