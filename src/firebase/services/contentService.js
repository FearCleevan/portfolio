//src/firebase/services/contentService.js
import { db } from "../config";
import { v4 as uuidv4 } from 'uuid';
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

const generateUniqueId = () => {
  return uuidv4();
};

const readEnvValue = (key) => {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : '';
};

const CLOUDINARY_CLOUD_NAME =
  readEnvValue('VITE_CLOUDINARY_CLOUD_NAME') ||
  readEnvValue('VITE_CLOUDINARY_CLOUDNAME');

const CLOUDINARY_UPLOAD_PRESETS = [
  readEnvValue('VITE_CLOUDINARY_PROJECTS_UPLOAD_PRESET'),
  readEnvValue('VITE_CLOUDINARY_UPLOAD_PRESET'),
  readEnvValue('VITE_CLOUDINARY_UNSIGNED_UPLOAD_PRESET')
].filter(Boolean);

const getCloudinaryUploadUrl = () => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME in .env');
  }

  if (!CLOUDINARY_UPLOAD_PRESETS.length) {
    throw new Error(
      'Missing Cloudinary upload preset in .env. Set one of: VITE_CLOUDINARY_PROJECTS_UPLOAD_PRESET, VITE_CLOUDINARY_UPLOAD_PRESET, VITE_CLOUDINARY_UNSIGNED_UPLOAD_PRESET'
    );
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
};

export const uploadProjectSampleImage = async (file, projectId) => {
  try {
    const uploadUrl = getCloudinaryUploadUrl();
    let lastErrorMessage = 'Cloudinary upload failed';

    for (const preset of CLOUDINARY_UPLOAD_PRESETS) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);
      formData.append('folder', `portfolio/projects/${projectId}`);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        return {
          id: result.public_id,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height
        };
      }

      const errorData = await response.json().catch(() => ({}));
      const cloudinaryMessage = errorData?.error?.message || '';
      lastErrorMessage = cloudinaryMessage || `Cloudinary upload failed (${response.status})`;

      // If preset is invalid, try next configured preset (if any).
      if (/upload preset not found/i.test(cloudinaryMessage)) {
        continue;
      }

      break;
    }

    if (/upload preset not found/i.test(lastErrorMessage)) {
      throw new Error(
        `Cloudinary upload preset was not found for cloud "${CLOUDINARY_CLOUD_NAME}". Check your .env preset value(s).`
      );
    }

    throw new Error(lastErrorMessage);
  } catch (error) {
    console.error('Error uploading project sample image:', error);
    throw error;
  }
};


// Experience functions
export const getExperience = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "experience");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const items = docSnap.data().items || [];
      // Ensure each item has an order field and unique ID
      return items.map(item => ({
        ...item,
        id: item.id || generateUniqueId(),
        order: item.order || 0
      }));
    } else {
      // Initialize with default experience if doesn't exist
      const defaultExperience = [
        {
          id: generateUniqueId(),
          role: "Frontend Developer",
          company: "The Launchpad Inc",
          year: "2022 - Present",
          status: "current",
          order: 1
        }
      ];
      await setDoc(docRef, { items: defaultExperience });
      return defaultExperience;
    }
  } catch (error) {
    console.error("Error getting experience:", error);
    throw error;
  }
};

export const addExperienceItem = async (item) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "experience");
    // Ensure the item has all required fields with unique ID
    const completeItem = {
      id: item.id || generateUniqueId(),
      role: item.role || '',
      company: item.company || '',
      year: item.year || '',
      status: item.status || 'active',
      order: item.order || 0
    };
    await updateDoc(docRef, {
      items: arrayUnion(completeItem)
    });
    return completeItem;
  } catch (error) {
    console.error("Error adding experience item:", error);
    throw error;
  }
};

export const updateExperienceItem = async (oldItem, newItem) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "experience");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentItems = docSnap.data().items || [];
      
      // Map through items and replace the old one
      const updatedItems = currentItems.map(item => 
        item.id === oldItem.id ? newItem : item
      );
      
      await setDoc(docRef, { items: updatedItems });
      return newItem;
    }
  } catch (error) {
    console.error("Error updating experience item:", error);
    throw error;
  }
};

export const deleteExperienceItem = async (item) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "experience");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentItems = docSnap.data().items || [];
      
      // Find the exact item to remove (by ID)
      const itemToRemove = currentItems.find(i => i.id === item.id);
      
      if (itemToRemove) {
        await updateDoc(docRef, {
          items: arrayRemove(itemToRemove)
        });
      } else {
        throw new Error('Item not found in database');
      }
    }
  } catch (error) {
    console.error("Error deleting experience item:", error);
    throw error;
  }
};

// Projects functions
export const getProjects = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "projects");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      // Initialize with default projects if doesn't exist
      const defaultProjects = [
        {
          id: Date.now().toString(),
          title: "ScapeDBM",
          description: "Landscaping Services Landing Page",
          url: "https://scapedbm.com",
          domain: "scapedbm.com",
          technologies: [],
          sampleImages: []
        }
      ];
      await setDoc(docRef, { items: defaultProjects });
      return defaultProjects;
    }
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const addProject = async (project) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "projects");
    const docSnap = await getDoc(docRef);
    const currentItems = docSnap.exists() ? (docSnap.data().items || []) : [];
    const existingIndex = currentItems.findIndex((item) => item.id === project.id);

    if (existingIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = project;
      await setDoc(docRef, { items: updatedItems }, { merge: true });
      return;
    }

    await setDoc(docRef, { items: [...currentItems, project] }, { merge: true });
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const updateProject = async (oldProject, newProject) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "projects");
    const docSnap = await getDoc(docRef);
    const currentItems = docSnap.exists() ? (docSnap.data().items || []) : [];
    const updatedItems = currentItems.map((item) =>
      item.id === oldProject.id ? { ...item, ...newProject, id: oldProject.id } : item
    );

    await setDoc(docRef, { items: updatedItems }, { merge: true });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (project) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "projects");
    const docSnap = await getDoc(docRef);
    const currentItems = docSnap.exists() ? (docSnap.data().items || []) : [];
    const updatedItems = currentItems.filter((item) => item.id !== project.id);
    await setDoc(docRef, { items: updatedItems }, { merge: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Certifications functions
export const getCertifications = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "certifications");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      // Initialize with default certifications if doesn't exist
      const defaultCertifications = [
        {
          id: Date.now().toString(),
          title: "Huawei Developer Expert",
          issuer: "Huawei",
          url: "https://example.com/cert1"
        }
      ];
      await setDoc(docRef, { items: defaultCertifications });
      return defaultCertifications;
    }
  } catch (error) {
    console.error("Error getting certifications:", error);
    throw error;
  }
};

export const addCertification = async (certification) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "certifications");
    await updateDoc(docRef, {
      items: arrayUnion(certification)
    });
  } catch (error) {
    console.error("Error adding certification:", error);
    throw error;
  }
};

export const updateCertification = async (oldCert, newCert) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "certifications");
    await updateDoc(docRef, {
      items: arrayRemove(oldCert)
    });
    await updateDoc(docRef, {
      items: arrayUnion(newCert)
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    throw error;
  }
};

export const deleteCertification = async (certification) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, "certifications");
    await updateDoc(docRef, {
      items: arrayRemove(certification)
    });
  } catch (error) {
    console.error("Error deleting certification:", error);
    throw error;
  }
};

// Add these functions to your existing contentService.js
// Add these functions to your existing contentService.js
export const getBlogPosts = async () => {
  try {
    const docRef = doc(db, 'content', 'blogPosts');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().posts || [];
    } else {
      // Initialize with empty array if document doesn't exist
      await setDoc(docRef, { posts: [] });
      return [];
    }
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    const docRef = doc(db, 'content', 'blogPosts');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const posts = docSnap.data().posts || [];
      return posts.find(post => post.slug === slug);
    }
    return null;
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    throw error;
  }
};

export const addBlogPost = async (post) => {
  try {
    const docRef = doc(db, 'content', 'blogPosts');
    const docSnap = await getDoc(docRef);
    
    let currentPosts = [];
    if (docSnap.exists()) {
      currentPosts = docSnap.data().posts || [];
    }
    
    const updatedPosts = [...currentPosts, post];
    await setDoc(docRef, { posts: updatedPosts });
    
    return post;
  } catch (error) {
    console.error('Error adding blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (oldPost, newPost) => {
  try {
    const docRef = doc(db, 'content', 'blogPosts');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentPosts = docSnap.data().posts || [];
      const updatedPosts = currentPosts.map(post => 
        post.id === oldPost.id ? newPost : post
      );
      
      await setDoc(docRef, { posts: updatedPosts });
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postToDelete) => {
  try {
    const docRef = doc(db, 'content', 'blogPosts');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentPosts = docSnap.data().posts || [];
      const updatedPosts = currentPosts.filter(post => post.id !== postToDelete.id);
      
      await setDoc(docRef, { posts: updatedPosts });
    }
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};
