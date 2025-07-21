import { useEffect, useState } from 'react';
import { 
  getCertifications, 
  addCertification, 
  updateCertification, 
  deleteCertification 
} from '../services/contentService';

export const useCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const data = await getCertifications();
        setCertifications(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const addItem = async (certification) => {
    try {
      setLoading(true);
      const newCert = { ...certification, id: Date.now().toString() };
      await addCertification(newCert);
      setCertifications(prev => [...prev, newCert]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (oldCert, newCert) => {
    try {
      setLoading(true);
      await updateCertification(oldCert, newCert);
      setCertifications(prev => 
        prev.map(cert => 
          cert.id === oldCert.id ? newCert : cert
        )
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (certification) => {
    try {
      setLoading(true);
      await deleteCertification(certification);
      setCertifications(prev => 
        prev.filter(c => c.id !== certification.id)
      );
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { certifications, loading, error, addItem, updateItem, removeItem };
};