import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB4FXl2V1Fkl2tJBx6yTQeidrsUAy8gZzc",
    authDomain: "sp1ru-387320.firebaseapp.com",
    projectId: "sp1ru-387320",
    storageBucket: "sp1ru-387320.appspot.com",
    messagingSenderId: "152785481960",
    appId: "1:152785481960:web:414b4b877f41744ab9995d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saveUserData = async (userData) => {
  const userRef = doc(db, "hash", userData.id.toString());

  try {
    const userDocSnap = await getDoc(userRef);

    if (userDocSnap.exists()) {
      const existingData = userDocSnap.data();

      if (existingData.balance === undefined) {
        await updateDoc(userRef, {
          balance: 0,
        });
      }
    } else {
      await setDoc(userRef, {
        ...userData,
        balance: 0,
      });
    }
  } catch (error) {
    throw error;
  }
};

export { saveUserData, db, doc, getDoc, setDoc, updateDoc };