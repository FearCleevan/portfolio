import { auth } from "../config";
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";

// Initialize session persistence
export const initAuth = async () => {
  await setPersistence(auth, browserSessionPersistence);
};

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
  } catch (error) {
    throw error;
  }
};

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