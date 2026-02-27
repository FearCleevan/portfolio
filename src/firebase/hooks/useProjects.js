// src/firebase/hooks/useProjects.js
import { useEffect, useState } from 'react';
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject,
  uploadProjectSampleImage
} from '../services/contentService';

const normalizeProject = (project) => ({
  ...project,
  sampleImages: Array.isArray(project.sampleImages)
    ? project.sampleImages
        .map((image) => (typeof image === 'string' ? { id: image, url: image } : image))
        .filter((image) => Boolean(image?.url))
    : []
});

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data.map(normalizeProject));
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
      const newProject = normalizeProject({
        ...project,
        id: project.id || Date.now().toString()
      });
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
      const normalizedProject = normalizeProject(newProject);
      await updateProject(oldProject, normalizedProject);
      setProjects(prev => 
        prev.map(project => 
          project.id === oldProject.id ? normalizedProject : project
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

  const uploadSampleImages = async (projectId, files = []) => {
    try {
      const uploadPromises = files.map((file) => uploadProjectSampleImage(file, projectId));
      return await Promise.all(uploadPromises);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { projects, loading, error, addItem, updateItem, removeItem, uploadSampleImages };
};
