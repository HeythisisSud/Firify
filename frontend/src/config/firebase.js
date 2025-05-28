import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'


const firebaseConfig = {
  apiKey:  process.env.FIREBASE_KEY,
  authDomain:  process.env.FIREBASE_AUTH,
  projectId:  process.env.FIREBASE_ID,
  storageBucket:  process.env.FIREBASE_STORAGE,
  messagingSenderId: process.env.FIREBASE_MESSAGING ,
  appId:  process.env.APPID,
  measurementId: process.env.FIREBASE_MEASUREID 
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authen=getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db= getFirestore(app)