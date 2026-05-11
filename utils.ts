import firebaseConfig from '../../firebase-applet-config.json';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = Object.keys(firebaseConfig).length > 0 ? firebaseConfig : {
  apiKey: "placeholder",
  authDomain: "placeholder",
  projectId: "placeholder",
  storageBucket: "placeholder",
  messagingSenderId: "placeholder",
  appId: "placeholder"
};

const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
