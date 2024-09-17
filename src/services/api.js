import db from "../utils/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, collection, setDoc, getDoc, addDoc, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

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
    });
    console.log("User data created with ID: ", user.uid);

    collection(userDocRef, "habits");
    console.log("Empty habits sub-collection created for user ID: ", user.uid);
  } catch (error) {
    console.error("Error creating user: ", error.code, error.message);
  }
}

async function logoutUser() {
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
      return { name: "Unknown", levelPoints: 0, avatar: "" }; // 返回預設值
    }
  } catch (error) {
    console.error("Error getting user profile: ", error.code, error.message);
    return { name: "Unknown", levelPoints: 0, avatar: "" }; // 返回預設值
  }
}

async function addHabit(uid, habitData) {
  try {
    const userDocRef = doc(db, "users", uid);
    const habitsCollectionRef = collection(userDocRef, "habits");
    await addDoc(habitsCollectionRef, {
      ...habitData,
      createdTime: Timestamp.now(),
    });
    console.log("Habit added for user ID: ", uid);
  } catch (error) {
    console.error("Error adding habit: ", error.code, error.message);
  }
}

async function getHabits(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const habitsCollectionRef = collection(userDocRef, "habits");
    const habitsSnapshot = await getDocs(habitsCollectionRef);
    const habitsList = habitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return habitsList;
  } catch (error) {
    console.error("Error getting habits: ", error.code, error.message);
    return [];
  }
}

async function updateHabit(uid, habitId, habitData) {
  try {
    const habitDocRef = doc(db, "users", uid, "habits", habitId);
    await updateDoc(habitDocRef, {
      ...habitData,
      updatedTime: Timestamp.now(),
    });
    console.log("Habit updated with ID: ", habitId);
  } catch (error) {
    console.error("Error updating habit: ", error.code, error.message);
  }
}

async function deleteHabit(uid, habitId) {
  try {
    const habitDocRef = doc(db, "users", uid, "habits", habitId);
    await deleteDoc(habitDocRef);
    console.log("Habit deleted with ID: ", habitId);
  } catch (error) {
    console.error("Error deleting habit: ", error.code, error.message);
  }
}

async function addPost(userID, postData) {
  try {
    const postsCollectionRef = collection(db, "posts");
    const newPostRef = await addDoc(postsCollectionRef, {
      ...postData,
      userID: userID,
      createdTime: Timestamp.now(),
      updatedTime: Timestamp.now(),
    });
    console.log("Post added with ID: ", newPostRef.id);
    return newPostRef.id;
  } catch (error) {
    console.error("Error adding post: ", error.code, error.message);
  }
}

async function getPost(postID) {
  try {
    const postDocRef = doc(db, "posts", postID);
    const postSnapshot = await getDoc(postDocRef);
    if (postSnapshot.exists()) {
      return { id: postSnapshot.id, ...postSnapshot.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting post: ", error.code, error.message);
    return null;
  }
}

async function updatePost(postID, postData) {
  try {
    const postDocRef = doc(db, "posts", postID);
    await updateDoc(postDocRef, {
      ...postData,
      updatedTime: Timestamp.now(),
    });
    console.log("Post updated with ID: ", postID);
  } catch (error) {
    console.error("Error updating post: ", error.code, error.message);
  }
}

async function deletePost(postID) {
  try {
    const postDocRef = doc(db, "posts", postID);
    await deleteDoc(postDocRef);
    console.log("Post deleted with ID: ", postID);
  } catch (error) {
    console.error("Error deleting post: ", error.code, error.message);
  }
}

async function getAllPosts() {
  try {
    const postsCollectionRef = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollectionRef);
    const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return postsList;
  } catch (error) {
    console.error("Error getting posts: ", error.code, error.message);
    return [];
  }
}

export { registerUser, logoutUser, updateUserProfile, getUserProfile, addHabit, getHabits, updateHabit, deleteHabit, addPost, getPost, updatePost, deletePost, getAllPosts };
