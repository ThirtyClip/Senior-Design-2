import React, { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { auth } from './firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase/compat";
import LottieView from 'lottie-react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);

  const handleForgotPassword = () => {
    if (email.trim() === '') {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    auth.sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password Reset Email Sent', 'Please check your email inbox for further instructions.');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('User Not Found', 'No user found with this email address.');
        } else {
          Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
        }
      });
  };

  const updateLastLogin = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const lastLogin = firebase.firestore.FieldValue.serverTimestamp();

      firebase.firestore().collection('users').doc(userId).set(
        {
          lastLoginField: lastLogin,
        },
        {
          merge: true
        } 
      );
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    retrieveRemember();
  }, []);

  const retrieveRemember = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');
      const savedToken = await AsyncStorage.getItem('userToken');
      const storedRemember = await AsyncStorage.getItem('rememberMe');

      if (storedEmail && storedRemember) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
      if (savedToken) {
        await auth.signInWithEmailAndPassword(storedEmail, storedPassword);
      }
    } catch (error) {
      console.log('Error retrieving', error);
    }
  };

  const handleLogin = async () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        updateLastLogin();
      })
      .then(async () => {
        const savedRememberMe = await AsyncStorage.getItem('rememberMe');
        if (savedRememberMe === true || rememberMe === true) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
          await AsyncStorage.setItem('rememberMe', JSON.stringify(true));
          await AsyncStorage.setItem('userToken', await auth.currentUser.getIdToken())
        }
        if (rememberMe === false) {
          await AsyncStorage.removeItem('password');
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('rememberMe');
          await AsyncStorage.removeItem('userToken');
        }
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        } else if (error.code === 'auth/missing-password') {
          alert("Missing password!");
        } else if (error.code === 'auth/user-not-found') {
          alert("User does not exist!")
        } else if (error.code === 'auth/wrong-password') {
          alert("Wrong password!");
        } else {
          alert(error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.loginContainer} behavior='padding'>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Are You Smarter Than A Hacker? Test your knowledge!</Text>
      </View>
      <View style={styles.animationContainer}>
          <LottieView
            source={require('./Animation - 1711859759813.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
        <Text style={styles.title}>Login</Text>
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
        <View style={styles.checkboxView}>
          <Checkbox
            style={{ marginEnd: 10 }}
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? 'green' : undefined}
          />
          <Text style={{ color: 'purple' }}>Remember Me </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Signup') }}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Forgot Password</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxView: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    alignContent: 'flex-start',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: '100%'
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },  
  animationContainer: {
    marginBottom: 20,
    opacity: 0.8,
  },
  animation: {
    width: 300,
    height: 300, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple',
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
    color: 'black',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
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
  forgotPassword: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
