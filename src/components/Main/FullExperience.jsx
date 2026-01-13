// src/components/Main/FullExperience.jsx
import React from 'react';
import styles from './FullExperience.module.css';
import { Link } from 'react-router-dom';
import { useExperience } from '../../firebase/hooks/useExperience';

export default function FullExperience({ isDarkMode }) {
    const { experience, loading, error } = useExperience();

    if (loading) {
        return (
            <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.fullExperienceContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                    <div className={styles.loadingOverlay}>
                        <div className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`}></div>
                        <p className={isDarkMode ? styles.darkText : ''}>Loading experience...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.fullExperienceContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                    <div className={styles.errorOverlay}>
                        <p className={isDarkMode ? styles.darkText : ''}>Error loading experience</p>
                        <button 
                            className={isDarkMode ? styles.darkButton : ''}
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={`${styles.fullExperienceContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={styles.header}>
                    <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
                        <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>Experience</h1>
                </div>
                
                <div className={styles.experienceList}>
                    {experience.map((item) => {
                        const statusClass = item.status === 'active' 
                            ? styles.experienceItemActive 
                            : item.status === 'current' 
                                ? styles.experienceItemCurrent 
                                : styles.experienceItem;

                        const dotClass = item.status === 'active'
                            ? styles.experienceDotActive
                            : item.status === 'current'
                                ? styles.experienceDotCurrent
                                : styles.experienceDot;

                        const roleClass = item.status === 'active'
                            ? styles.experienceRoleActive
                            : styles.experienceRole;

                        return (
                            <div 
                                key={item.id} 
                                className={`${statusClass} ${isDarkMode ? styles.darkGridBox : ''}`}
                            >
                                <div className={styles.experienceHeader}>
                                    <div className={styles.experienceDotContainer}>
                                        <div className={`${dotClass} ${isDarkMode ? item.status === 'active' ? styles.darkDotActive : styles.darkDot : ''}`}></div>
                                    </div>
                                    <div className={styles.experienceTitle}>
                                        <h2 className={`${roleClass} ${isDarkMode ? styles.darkText : ''}`}>{item.role}</h2>
                                        <div className={styles.experienceMeta}>
                                            <span className={`${styles.company} ${isDarkMode ? styles.darkText : ''}`}>{item.company}</span>
                                            <span className={`${styles.year} ${isDarkMode ? styles.darkYear : ''}`}>{item.year}</span>
                                            {item.location && (
                                                <span className={`${styles.location} ${isDarkMode ? styles.darkText : ''}`}>
                                                    <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    {item.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {item.description && item.description.length > 0 && (
                                    <div className={styles.experienceDescription}>
                                        <ul className={styles.descriptionList}>
                                            {item.description.map((point, index) => (
                                                <li key={index} className={styles.descriptionItem}>
                                                    <span className={styles.descriptionText}>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {item.technologies && item.technologies.length > 0 && (
                                    <div className={styles.technologies}>
                                        <h3 className={`${styles.technologiesTitle} ${isDarkMode ? styles.darkText : ''}`}>Technologies Used</h3>
                                        <div className={styles.techTags}>
                                            {item.technologies.map((tech, index) => (
                                                <span key={index} className={`${styles.techTag} ${isDarkMode ? styles.darkTechTag : ''}`}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}