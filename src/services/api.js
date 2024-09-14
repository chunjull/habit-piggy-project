import db from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      account: "",
      email: "",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { addUser };
