// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyBIwQrz7ntHslQ02kHAGyEhjAWdY-SSkVs",

  authDomain: "housing-platform-90af6.firebaseapp.com",

  projectId: "housing-platform-90af6",

  storageBucket: "housing-platform-90af6.appspot.com",

  messagingSenderId: "700086578401",

  appId: "1:700086578401:web:990bd6b4f339ea32a49ba0"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};
