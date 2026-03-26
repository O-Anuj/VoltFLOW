
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCIS4exGOEtFdDpGur70Ooy6DMggL1whTU",
  authDomain: "voltflow-82de2.firebaseapp.com",
  projectId: "voltflow-82de2",
  storageBucket: "voltflow-82de2.firebasestorage.app",
  messagingSenderId: "401622496160",
  appId: "1:401622496160:web:b61e5088051350b3da6ac5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);
