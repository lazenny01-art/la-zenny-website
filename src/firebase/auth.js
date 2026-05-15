import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";

// Sign in admin
export const loginAdmin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign out
export const logoutAdmin = () => signOut(auth);

// Listen to auth state changes
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
