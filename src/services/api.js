import db from "../utils/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth();
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created: ", user);

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: "",
      introduction: "",
      avatar: "",
      createdTime: Date.now(),
      levelPoints: 0,
      isAcceptReminder: false,
      achievements: [],
      badges: [],
      habit: [],
    });
    console.log("User data created with ID: ", user.uid);
  } catch (error) {
    console.error("Error creating user: ", error.code, error.message);
  }
}

async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error.code, error.message);
  }
}

export { registerUser, logout };
