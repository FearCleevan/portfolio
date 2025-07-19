import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthChange } from '../services/authService';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);
};