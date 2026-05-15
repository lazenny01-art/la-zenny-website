import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAU-znF087QjjcO1OaBXVhWQYJ6DX4HyLg",
  authDomain: "la-zenny.firebaseapp.com",
  projectId: "la-zenny",
  storageBucket: "la-zenny.firebasestorage.app",
  messagingSenderId: "527598290872",
  appId: "1:527598290872:web:d274f61440b87dde22314d",
  measurementId: "G-KR7YPS6LFL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
