import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBSDmZjxc1TLilHn0adOJdMLFKohGGmpb8",
  authDomain: "bakemore-a57e0.firebaseapp.com",
  projectId: "bakemore-a57e0",
  storageBucket: "bakemore-a57e0.appspot.com",
  messagingSenderId: "809043942436",
  appId: "1:809043942436:web:3ec9f39967087e82a80cb1",
  measurementId: "G-ESBJB3YQMW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, signInWithEmailAndPassword };
