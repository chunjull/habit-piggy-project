import db from "../utils/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const auth = getAuth();
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created: ", user);

    const docRef = await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error creating user: ", error.code, error.message);
  }
}

export { registerUser };
