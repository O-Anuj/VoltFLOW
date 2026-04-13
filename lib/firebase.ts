
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider } from 'firebase/app-check';

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

// Initialize App Check
if (typeof window !== 'undefined') {
  console.log("Firebase App Check: Initializing...");
  // Use reCAPTCHA Enterprise
  // You must register your app in the Firebase console and get a site key
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  // Enable debug token in development
  if (import.meta.env.DEV) {
    console.log("Firebase App Check: Development mode detected, enabling debug token.");
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  if (siteKey) {
    console.log("Firebase App Check: Using reCAPTCHA site key.");
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
  } else if (import.meta.env.DEV) {
    console.log("Firebase App Check: No site key found, using debug provider.");
    initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: () => {
          console.log("Firebase App Check: Generating debug token...");
          return Promise.resolve({
            token: 'debug-token',
            expireTimeMillis: Date.now() + 3600000
          });
        }
      }),
      isTokenAutoRefreshEnabled: true
    });
  } else {
    console.warn("Firebase App Check: VITE_RECAPTCHA_SITE_KEY is missing and not in DEV mode. App Check will not be initialized.");
  }
}

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);
