// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
import 'firebase/firestore';

//import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzPXSMs6uipEeoJwu6qvIqiJfyORCKQCs",
  authDomain: "cybersecurity-training-app.firebaseapp.com",
  projectId: "cybersecurity-training-app",
  storageBucket: "cybersecurity-training-app.appspot.com",
  messagingSenderId: "527855826805",
  appId: "1:527855826805:web:4e75517030330ab3a8053c",
  measurementId: "G-SGRRRD1P95"
};

// Initialize Firebase
//let app;
//const app = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();




export { auth, db };
