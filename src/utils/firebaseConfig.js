// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoA9vGq5gsjRVqngQcfX9wDHv03MFX8Mo",
  authDomain: "habit-piggy-project.firebaseapp.com",
  projectId: "habit-piggy-project",
  storageBucket: "habit-piggy-project.appspot.com",
  messagingSenderId: "230345565651",
  appId: "1:230345565651:web:4f5fae0a011a8a355cbb26",
  measurementId: "G-D5V6H13VEM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
