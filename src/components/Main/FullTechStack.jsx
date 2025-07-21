// src/components/Main/FullTechStack.jsx
import React from 'react';
import styles from './FullTechStack.module.css';
import { Link } from 'react-router-dom';
import { useTechStack } from '../../firebase/hooks/useTechStack';

export default function FullTechStack({ isDarkMode }) {
    const { techStack, loading, error } = useTechStack();

    if (loading) return <div className={styles.fullTechStackContainer}>Loading...</div>;
    if (error) return <div className={styles.fullTechStackContainer}>Error loading tech stack</div>;

    return (
        <div className={`${styles.fullTechStackContainer} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.header}>
                <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
                    <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Home
                </Link>
                <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>Tech Stack</h1>
            </div>
            
            <div className={styles.techStackGroups}>
                {techStack.map((group, index) => (
                    <div key={index} className={`${styles.techStackGroup} ${isDarkMode ? styles.darkBentoCard : ''}`}>
                        <h2 className={`${styles.groupTitle} ${isDarkMode ? styles.darkText : ''}`}>{group.title}</h2>
                        <div className={styles.techStackTags}>
                            {group.items.map((item, itemIndex) => (
                                <span key={itemIndex} className={`${styles.techTag} ${isDarkMode ? styles.darkTechTag : ''}`}>{item}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}