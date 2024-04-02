import React, { useState, } from 'react';
import {  Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { auth } from './firebase';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebase';
import firebase from "firebase/compat";

const updateLastLogin = () => {
  const user = auth.currentUser;
  if(user)
  {
    const userId = user.uid;
    const lastLogin = firebase.firestore.FieldValue.serverTimestamp(); //returns server generated timestamp

    firebase.firestore().collection('users').doc(userId).set( //registers users timestamp in firebase
      {
        lastLoginField: lastLogin,
      },
      {
        merge: true
      } //merge new field is existing documents exists
    );
  }
}

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName] = useState('');
    const navigation = useNavigation();
    const dataDB = db.collection('preferences');
  
    const handleSignUp = () => {
      if(name.trim() !== ''){auth.createUserWithEmailAndPassword(email, password)
        .then(({ user }) => { 
            user
              .updateProfile({
                displayName: name,
              })
              .then(() => {

                const optionP = {
                  optionSaved: true,
                  uid: user.uid,
                };
                savePreferences(optionP);

              })
              .catch(error => {
                // Handle updateProfile error
                
                console.log(error);
              });
              updateLastLogin();})
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!');
          } else if (error.code === 'auth/invalid-email') {
            alert('That email address is invalid!');
          } else if (error.code === 'auth/weak-password') {
            alert("Password must be at least 6 characters");
          } else {
            alert(error);
          }
        });
    }
        else{
            alert("Enter name!")
        }
    };

    const savePreferences = async (option) => {
      try {
        const docRef = await dataDB.add(option);
        console.log('Option saved with ID:', docRef.id);
      } catch (error) {
        console.error('Error saving option:', error);
      }
    }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={()=>{
        handleSignUp();
      }}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'purple',
    marginBottom: 10
  },
  input: {
    width: '80%',
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
    backgroundColor: '#9c88ff',
    padding: 10,
    width: '80%', 
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

export default SignUp;