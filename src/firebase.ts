import firebase from "firebase";


const firebaseConfig = {

    apiKey: "AIzaSyAHD5io5M1Vrvs9offx9mnRSwtR1z1Yt4E",
  
    authDomain: "identity-theft-detection.firebaseapp.com",
  
    projectId: "identity-theft-detection",
  
    storageBucket: "identity-theft-detection.appspot.com",
  
    messagingSenderId: "341279911197",
  
    appId: "1:341279911197:web:05d5fa2fac3e69e96c05f4",
  
    measurementId: "G-45WPF1Y9SY"
  
  };
    // Initialize Firebase
   const app= firebase.initializeApp(firebaseConfig);

   //initialize auth, fstore, and storage
    const auth = firebase.auth();
    const fstore = firebase.firestore();
    const storage = firebase.storage();

    export {app, auth, fstore, storage};
  