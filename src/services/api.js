import { db, storage } from "../utils/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, collection, setDoc, getDoc, addDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

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
      const userData = userSnapshot.data();
      if (!userData.avatar) {
        const defaultAvatarURL = await getDefaultAvatar("Piggy.png");
        userData.avatar = defaultAvatarURL;
      }
      return userData;
    } else {
      console.log("No such document!");
      const defaultAvatarURL = await getDefaultAvatar("Piggy.png");
      return { name: "Unknown", levelPoints: 0, avatar: defaultAvatarURL };
    }
  } catch (error) {
    console.error("Error getting user profile: ", error.code, error.message);
    const defaultAvatarURL = await getDefaultAvatar("Piggy.png");
    return { name: "Unknown", levelPoints: 0, avatar: defaultAvatarURL };
  }
}

async function getAllUsers() {
  try {
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return usersList;
  } catch (error) {
    console.error("Error getting users: ", error.code, error.message);
    return [];
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
    // console.log("Habit updated with ID: ", habitId);
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
    const q = query(postsCollectionRef, orderBy("createdTime", "desc"));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return postsList;
  } catch (error) {
    console.error("Error getting posts: ", error.code, error.message);
    return [];
  }
}

async function uploadAvatar(uid, file) {
  try {
    const storageRef = ref(storage, `avatars/${uid}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Avatar uploaded: ", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar: ", error.code, error.message);
    return null;
  }
}

async function getDefaultAvatar(fileName) {
  try {
    const storageRef = ref(storage, `default_avatars/${fileName}`);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Default avatar URL: ", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error getting default avatar: ", error.code, error.message);
    return "https://firebasestorage.googleapis.com/v0/b/habit-piggy-project.appspot.com/o/avatars%2FPiggy.png?alt=media&token=be62eb4e-44a3-46c5-ba6d-bba575da75a8";
  }
}

async function addComment(postID, commentData) {
  try {
    const postDocRef = doc(db, "posts", postID);
    const commentsCollectionRef = collection(postDocRef, "comments");
    await addDoc(commentsCollectionRef, {
      ...commentData,
      createdTime: Timestamp.now(),
    });
    console.log("Comment added to post ID: ", postID);
  } catch (error) {
    console.error("Error adding comment: ", error.code, error.message);
  }
}

async function getComments(postID) {
  try {
    const postDocRef = doc(db, "posts", postID);
    const commentsCollectionRef = collection(postDocRef, "comments");
    const commentsSnapshot = await getDocs(commentsCollectionRef);
    const commentsList = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return commentsList;
  } catch (error) {
    console.error("Error getting comments: ", error.code, error.message);
    return [];
  }
}

async function updateComment(postID, commentID, commentData) {
  try {
    const commentDocRef = doc(db, "posts", postID, "comments", commentID);
    await updateDoc(commentDocRef, {
      ...commentData,
      updatedTime: Timestamp.now(),
    });
    console.log("Comment updated with ID: ", commentID);
  } catch (error) {
    console.error("Error updating comment: ", error.code, error.message);
  }
}

async function deleteComment(postID, commentID) {
  try {
    const commentDocRef = doc(db, "posts", postID, "comments", commentID);
    await deleteDoc(commentDocRef);
    console.log("Comment deleted with ID: ", commentID);
  } catch (error) {
    console.error("Error deleting comment: ", error.code, error.message);
  }
}

async function getPostBackgrounds() {
  try {
    const storageRef = ref(storage, "post_backgrounds");
    const result = await listAll(storageRef);
    const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);
    return urls;
  } catch (error) {
    console.error("Error getting post backgrounds: ", error.code, error.message);
    return [];
  }
}

async function addLike(postID, userID) {
  try {
    const postDocRef = doc(db, "posts", postID);
    const postSnapshot = await getDoc(postDocRef);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const likes = postData.likes || [];
      if (!likes.includes(userID)) {
        likes.push(userID);
        await updateDoc(postDocRef, { likes });
        console.log("Like added to post ID: ", postID);
      }
    }
  } catch (error) {
    console.error("Error adding like: ", error.code, error.message);
  }
}

async function removeLike(postID, userID) {
  try {
    const postDocRef = doc(db, "posts", postID);
    const postSnapshot = await getDoc(postDocRef);
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      const likes = postData.likes || [];
      const index = likes.indexOf(userID);
      if (index > -1) {
        likes.splice(index, 1);
        await updateDoc(postDocRef, { likes });
        console.log("Like removed from post ID: ", postID);

        const likeDocRef = doc(db, "posts", postID, "likes", userID);
        await deleteDoc(likeDocRef);
        console.log("Like document removed for user ID: ", userID);
      }
    }
  } catch (error) {
    console.error("Error removing like: ", error.code, error.message);
  }
}

async function getAchievements() {
  try {
    const achievementsSnapshot = await getDocs(collection(db, "achievements"));
    const achievementsList = achievementsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return achievementsList;
  } catch (error) {
    console.error("Error getting achievements: ", error.code, error.message);
    return [];
  }
}

async function getUserAchievements(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const achievements = userData.achievements || [];
      return achievements;
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting user achievements: ", error.code, error.message);
    return [];
  }
}

async function checkAndAwardAchievements(uid, taskType, taskValue) {
  try {
    const achievementsSnapshot = await getDocs(collection(db, "achievements"));
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    const userAchievements = userSnapshot.exists() ? userSnapshot.data().achievements || [] : [];

    achievementsSnapshot.forEach(async (doc) => {
      const achievement = doc.data();
      const condition = achievement.condition;

      let achieved = false;
      if (condition.type === taskType) {
        if (taskType === "habit" && taskValue >= condition.count) {
          achieved = true;
        } else if (taskType === "savings" && taskValue >= condition.amount) {
          achieved = true;
        } else if (taskType === "streak" && taskValue >= condition.count) {
          achieved = true;
        }
      }

      if (achieved && !userAchievements.includes(doc.id)) {
        userAchievements.push(doc.id);
        await updateDoc(userDocRef, { achievements: userAchievements });
        console.log(`Achievement ${achievement.name} awarded to user ID: ${uid}`);
      }
    });
  } catch (error) {
    console.error("Error checking and awarding achievements: ", error.code, error.message);
  }
}

async function getBadges() {
  try {
    const badgesCollectionRef = collection(db, "badges");
    const badgesSnapshot = await getDocs(badgesCollectionRef);
    const badgesList = badgesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return badgesList;
  } catch (error) {
    console.error("Error getting badges: ", error.code, error.message);
    return [];
  }
}

export {
  registerUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  addPost,
  getPost,
  updatePost,
  deletePost,
  getAllPosts,
  uploadAvatar,
  getDefaultAvatar,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  getPostBackgrounds,
  addLike,
  removeLike,
  getAchievements,
  getUserAchievements,
  checkAndAwardAchievements,
  getBadges,
};
