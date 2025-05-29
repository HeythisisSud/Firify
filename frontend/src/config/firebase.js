import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'



const firebaseConfig = {
  apiKey:  process.env.REACT_APP_FIREBASE_KEY,
  authDomain:  process.env.REACT_APP_FIREBASE_AUTH,
  projectId:  process.env.REACT_APP_FIREBASE_ID,
  storageBucket:  process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING ,
  appId:  process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREID 
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authen=getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db= getFirestore(app)