// src/firebase/hooks/useExperience.js
import { useEffect, useState } from 'react';
import { 
  getExperience, 
  addExperienceItem, 
  updateExperienceItem, 
  deleteExperienceItem 
} from '../services/contentService';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return uuidv4();
};

export const useExperience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await getExperience();
        // Sort by order in descending order (higher number = top)
        const sortedData = [...data].sort((a, b) => b.order - a.order);
        setExperience(sortedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const getNextOrderNumber = () => {
    if (experience.length === 0) return 1;
    // Get the highest order number and add 1
    const maxOrder = Math.max(...experience.map(item => item.order || 0));
    return maxOrder + 1;
  };

  const addItem = async (item) => {
    try {
      setLoading(true);
      const order = getNextOrderNumber();
      const newItem = { 
        ...item, 
        id: generateUniqueId(),
        order 
      };
      const savedItem = await addExperienceItem(newItem);
      // Add to beginning of array since higher order = top position
      setExperience(prev => [savedItem, ...prev].sort((a, b) => b.order - a.order));
      return savedItem;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (oldItem, newItem) => {
    try {
      setLoading(true);
      // Keep the existing order if not changed
      const updatedItem = { 
        ...newItem, 
        order: newItem.order !== undefined ? newItem.order : oldItem.order 
      };
      const savedItem = await updateExperienceItem(oldItem, updatedItem);
      setExperience(prev => 
        prev.map(item => 
          item.id === oldItem.id ? savedItem : item
        ).sort((a, b) => b.order - a.order)
      );
      return savedItem;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item) => {
    try {
      setLoading(true);
      await deleteExperienceItem(item);
      setExperience(prev => 
        prev.filter(i => i.id !== item.id)
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderItems = async (item1, item2) => {
    try {
      setLoading(true);
      // Swap order numbers
      const tempOrder = item1.order;
      const updatedItem1 = { ...item1, order: item2.order };
      const updatedItem2 = { ...item2, order: tempOrder };
      
      // Update both items in database
      const savedItem1 = await updateExperienceItem(item1, updatedItem1);
      const savedItem2 = await updateExperienceItem(item2, updatedItem2);
      
      // Update local state
      setExperience(prev => 
        prev.map(item => {
          if (item.id === item1.id) return savedItem1;
          if (item.id === item2.id) return savedItem2;
          return item;
        }).sort((a, b) => b.order - a.order)
      );
      
      return { savedItem1, savedItem2 };
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    experience, 
    loading, 
    error, 
    addItem, 
    updateItem, 
    removeItem, 
    getNextOrderNumber,
    reorderItems 
  };
};