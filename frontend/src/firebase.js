import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBNYe5rSm6lJsTceUnToCtpk0G5RTlWrzk",
  authDomain: "bananasum-8d0a9.firebaseapp.com",
  projectId: "bananasum-8d0a9",
  storageBucket: "bananasum-8d0a9.appspot.com",
  messagingSenderId: "757085860857",
  appId: "1:757085860857:web:eb1c543c0b7c0f6cca0328",
  measurementId: "G-53G93JT8X4",
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
};


export const saveScore = async (score) => {
  if (!auth.currentUser) {
    console.error("No user is logged in.");
    return;
  }

  console.log("Received score object:", score);

  if (!score || typeof score !== 'object' || typeof score.score !== 'number' || !score.timestamp) {
    console.error("Invalid score object:", score);
    return;
  }

  const userId = auth.currentUser.uid;
  const scoreRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(scoreRef);

    if (docSnap.exists()) {
      await updateDoc(scoreRef, {
        scores: arrayUnion(score),
      });
      console.log("Score added to existing document.");
    } else {
      await setDoc(scoreRef, {
        scores: [score],
      });
      console.log("New score document created.");
    }
  } catch (error) {
    console.error("Error saving score:", error);
  }
};


export const fetchScores = async () => {
  if (!auth.currentUser) {
    console.error("No user is logged in.");
    return {};
  }

  const userId = auth.currentUser.uid;
  const scoreRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(scoreRef);
    if (docSnap.exists()) {
      return docSnap.data().scores || {};
    } else {
      console.log("No scores found");
      return {};
    }
  } catch (error) {
    console.error("Error fetching scores:", error);
    return {};
  }
};


export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out!");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};


export const loginAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Logged in as Guest:", userCredential.user);
    return userCredential.user; 
  } catch (error) {
    console.error("Error during guest login:", error.message);
    throw error; 
  }
};
