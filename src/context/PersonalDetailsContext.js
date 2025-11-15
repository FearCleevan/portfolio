import React, { createContext, useContext } from 'react';
import { usePersonalDetails } from '../hooks/usePersonalDetails';

const PersonalDetailsContext = createContext();

export const usePersonalDetailsContext = () => {
    const context = useContext(PersonalDetailsContext);
    if (!context) {
        throw new Error('usePersonalDetailsContext must be used within a PersonalDetailsProvider');
    }
    return context;
};

export const PersonalDetailsProvider = ({ children }) => {
    const personalDetailsData = usePersonalDetails();

    return (
        <PersonalDetailsContext.Provider value={personalDetailsData}>
            {children}
        </PersonalDetailsContext.Provider>
    );
};