//src/firebase/services/contentService.js
import { db } from "../config";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Collection name for content
const CONTENT_COLLECTION = "portfolioContent";

// Get about content
export const getAboutContent = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "about");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().paragraphs;
    } else {
      // Initialize with default content if doesn't exist
      const defaultContent = [
        "I'm a passionate web developer with expertise in React and modern JavaScript frameworks.",
        "I specialize in creating responsive, user-friendly interfaces with clean, maintainable code."
      ];
      await setDoc(docRef, { paragraphs: defaultContent });
      return defaultContent;
    }
  } catch (error) {
    console.error("Error getting about content:", error);
    throw error;
  }
};

// Update about content
export const updateAboutContent = async (paragraphs) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "about");
    await updateDoc(docRef, { paragraphs });
  } catch (error) {
    console.error("Error updating about content:", error);
    throw error;
  }
};

export const getTechStack = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "techStack");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().groups || [];
    } else {
      // Initialize with empty array if doesn't exist
      const defaultGroups = [];
      await setDoc(docRef, { groups: defaultGroups });
      return defaultGroups;
    }
  } catch (error) {
    console.error("Error getting tech stack:", error);
    throw error;
  }
};

export const addTechStackGroup = async (group) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "techStack");
    await updateDoc(docRef, {
      groups: arrayUnion(group)
    });
  } catch (error) {
    console.error("Error adding tech stack group:", error);
    throw error;
  }
};

export const updateTechStackGroup = async (oldGroup, newGroup) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "techStack");
    await updateDoc(docRef, {
      groups: arrayRemove(oldGroup)
    });
    await updateDoc(docRef, {
      groups: arrayUnion(newGroup)
    });
  } catch (error) {
    console.error("Error updating tech stack group:", error);
    throw error;
  }
};

export const deleteTechStackGroup = async (group) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "techStack");
    await updateDoc(docRef, {
      groups: arrayRemove(group)
    });
  } catch (error) {
    console.error("Error deleting tech stack group:", error);
    throw error;
  }
};