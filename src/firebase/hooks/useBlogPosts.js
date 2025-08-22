// src/firebase/hooks/useBlogPosts.js
import { useEffect, useState } from 'react';
import { 
  getBlogPosts, 
  addBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '../services/contentService';

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setBlogPosts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const addItem = async (post) => {
    try {
      setLoading(true);
      const newPost = { ...post, id: Date.now().toString() };
      await addBlogPost(newPost);
      setBlogPosts(prev => [...prev, newPost]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (oldPost, newPost) => {
    try {
      setLoading(true);
      await updateBlogPost(oldPost, newPost);
      setBlogPosts(prev => 
        prev.map(post => 
          post.id === oldPost.id ? newPost : post
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (post) => {
    try {
      setLoading(true);
      await deleteBlogPost(post);
      setBlogPosts(prev => 
        prev.filter(p => p.id !== post.id)
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { blogPosts, loading, error, addItem, updateItem, removeItem };
};