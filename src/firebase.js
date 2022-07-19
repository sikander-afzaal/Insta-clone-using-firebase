// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC9PhZxq-2voqFxRBXSmkJlcKBN8sD-W-A",
  authDomain: "insta-clone-a3ac1.firebaseapp.com",
  projectId: "insta-clone-a3ac1",
  storageBucket: "insta-clone-a3ac1.appspot.com",
  messagingSenderId: "143374302309",
  appId: "1:143374302309:web:d2c8b71116c2a2b3bd9a8c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
