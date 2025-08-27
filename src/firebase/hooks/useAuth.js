// src/firebase/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthChange, getCurrentUser } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/LoginPanel');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  return user;
};