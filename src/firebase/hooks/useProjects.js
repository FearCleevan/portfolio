// src/firebase/hooks/useProjects.js
import { useEffect, useState } from 'react';
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject 
} from '../services/contentService';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addItem = async (project) => {
    try {
      setLoading(true);
      const newProject = { ...project, id: Date.now().toString() };
      await addProject(newProject);
      setProjects(prev => [...prev, newProject]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (oldProject, newProject) => {
    try {
      setLoading(true);
      await updateProject(oldProject, newProject);
      setProjects(prev => 
        prev.map(project => 
          project.id === oldProject.id ? newProject : project
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (project) => {
    try {
      setLoading(true);
      await deleteProject(project);
      setProjects(prev => 
        prev.filter(p => p.id !== project.id)
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, addItem, updateItem, removeItem };
};