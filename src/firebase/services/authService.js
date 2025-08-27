// src/firebase/services/authService.js
import { auth } from "../config";
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence // Changed to local persistence
} from "firebase/auth";
import { 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth"

// Initialize auth persistence
export const initAuth = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Auth persistence set to local");
  } catch (error) {
    console.error("Error setting auth persistence:", error);
  }
};

export const loginAdmin = async (email, password) => {
  try {
    // Ensure persistence is set before signing in
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
  } catch (error) {
    throw error;
  }
};

// Rest of the code remains the same...
export const logoutAdmin = async () => {
  await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? { uid: user.uid, email: user.email } : null);
  });
};

export const getCurrentUser = () => {
  const user = auth.currentUser;
  return user ? { uid: user.uid, email: user.email } : null;
};

