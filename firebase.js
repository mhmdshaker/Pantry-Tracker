// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXoizWNLvRu3T0Gr82aJ111qa5844hcdo",
  authDomain: "inventory-management-2fe72.firebaseapp.com",
  projectId: "inventory-management-2fe72",
  storageBucket: "inventory-management-2fe72.appspot.com",
  messagingSenderId: "1024611650983",
  appId: "1:1024611650983:web:6e0fcf8a2525cff19fba82",
  measurementId: "G-9TK2SNKYFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};