import db from "../utils/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

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
      createdTime: Timestamp.now(),
      levelPoints: 0,
      isAcceptReminder: false,
      achievements: [],
      badges: [],
      habits: [],
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

async function updateUserProfile(uid, profileData) {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, profileData, { merge: true });
    console.log("User profile updated with ID: ", uid);
  } catch (error) {
    console.error("Error updating user profile: ", error.code, error.message);
  }
}

async function getUserProfile(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile: ", error.code, error.message);
    return null;
  }
}

export { registerUser, logout, updateUserProfile, getUserProfile };
