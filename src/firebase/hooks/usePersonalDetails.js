// src/hooks/usePersonalDetails.js
import { useState, useEffect } from 'react';
import { getPersonalDetails } from '../services/personalDetailsService';

export const usePersonalDetails = () => {
    const [personalDetails, setPersonalDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonalDetails = async () => {
            try {
                setLoading(true);
                const details = await getPersonalDetails();
                setPersonalDetails(details);
            } catch (err) {
                console.error('Error fetching personal details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalDetails();
    }, []);

    return { personalDetails, loading, error };
};