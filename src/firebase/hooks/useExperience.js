// src/firebase/hooks/useExperience.js
import { useEffect, useState } from 'react';
import { 
  getExperience, 
  addExperienceItem, 
  updateExperienceItem, 
  deleteExperienceItem 
} from '../services/contentService';

export const useExperience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await getExperience();
        setExperience(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const addItem = async (item) => {
    try {
      setLoading(true);
      const newItem = { ...item, id: Date.now().toString() };
      await addExperienceItem(newItem);
      setExperience(prev => [...prev, newItem]);
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
      await updateExperienceItem(oldItem, newItem);
      setExperience(prev => 
        prev.map(item => 
          item.id === oldItem.id ? newItem : item
        )
      );
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

  return { experience, loading, error, addItem, updateItem, removeItem };
};