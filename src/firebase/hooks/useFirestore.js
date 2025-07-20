//src/firebase/hooks/useFirestore.js
import { useEffect, useState } from 'react';
import { getAboutContent, updateAboutContent } from '../services/contentService';

export const useAboutContent = () => {
  const [aboutContent, setAboutContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        const content = await getAboutContent();
        setAboutContent(content);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const updateContent = async (newContent) => {
    try {
      setLoading(true);
      await updateAboutContent(newContent);
      setAboutContent(newContent);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { aboutContent, loading, error, updateContent };
};