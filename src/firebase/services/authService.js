// import { auth } from '../config';
// import { 
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged
// } from 'firebase/auth';

// export const loginAdmin = async (email, password) => {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//     return true;
//   } catch (error) {
//     console.error("Login error:", error);
//     return false;
//   }
// };

// export const logoutAdmin = async () => {
//   await signOut(auth);
// };

// export const onAuthChange = (callback) => {
//   return onAuthStateChanged(auth, (user) => {
//     callback(user);
//   });
// };