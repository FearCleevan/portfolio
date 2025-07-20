// src/firebase/hooks/useTechStack.js
import { useEffect, useState } from 'react';
import { 
  getTechStack, 
  addTechStackGroup, 
  updateTechStackGroup, 
  deleteTechStackGroup 
} from '../services/contentService';

export const useTechStack = () => {
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        setLoading(true);
        const data = await getTechStack();
        setTechStack(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, []);

  const addGroup = async (group) => {
    try {
      setLoading(true);
      await addTechStackGroup(group);
      setTechStack(prev => [...prev, group]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (oldGroup, newGroup) => {
    try {
      setLoading(true);
      await updateTechStackGroup(oldGroup, newGroup);
      setTechStack(prev => 
        prev.map(group => 
          JSON.stringify(group) === JSON.stringify(oldGroup) ? newGroup : group
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeGroup = async (group) => {
    try {
      setLoading(true);
      await deleteTechStackGroup(group);
      setTechStack(prev => 
        prev.filter(g => JSON.stringify(g) !== JSON.stringify(group))
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { techStack, loading, error, addGroup, updateGroup, removeGroup };
};