// src/firebase/services/personalDetailsService.js
import { db, auth } from "../config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";

const PERSONAL_DETAILS_COLLECTION = "personalDetails";

// Get personal details
export const getPersonalDetails = async () => {
  try {
    const docRef = doc(db, PERSONAL_DETAILS_COLLECTION, "adminDetails");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return null if no data exists, let the component handle defaults
      return null;
    }
  } catch (error) {
    console.error("Error getting personal details:", error);
    throw error;
  }
};

// Update personal details
export const updatePersonalDetails = async (details) => {
  try {
    const docRef = doc(db, PERSONAL_DETAILS_COLLECTION, "adminDetails");
    await setDoc(docRef, details, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating personal details:", error);
    throw error;
  }
};

// Update admin password
export const updateAdminPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    
    if (!user.email) {
      throw new Error("User email not available");
    }
    
    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};