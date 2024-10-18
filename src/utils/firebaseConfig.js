import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "habit-piggy-project.firebaseapp.com",
  projectId: "habit-piggy-project",
  storageBucket: "habit-piggy-project.appspot.com",
  messagingSenderId: "230345565651",
  appId: "1:230345565651:web:4f5fae0a011a8a355cbb26",
  measurementId: "G-D5V6H13VEM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
