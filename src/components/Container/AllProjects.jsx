// src/components/Container/AllProjects.jsx
import React from 'react';
import styles from './AllProjects.module.css';
import { Link } from 'react-router-dom';
import { useProjects } from '../../firebase/hooks/useProjects';

export default function AllProjects({ isDarkMode }) {
    const { projects, loading, error } = useProjects();

    if (loading) return <div className={styles.allProjectsContainer}>Loading projects...</div>;
    if (error) return <div>Error loading projects</div>;

    return (
        <div className={`${styles.allProjectsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.header}>
                <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
                    <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Home
                </Link>
                <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>All Projects</h1>
            </div>

            <div className={styles.projectsGrid}>
                {projects.map((project) => (
                    <div key={project.id} className={`${styles.projectCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
                        <a target="_blank" rel="noopener noreferrer" className={styles.projectLink} href={project.url}>
                            <h3 className={`${styles.projectTitle} ${isDarkMode ? styles.darkText : ''}`}>
                                {project.title}
                                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </h3>
                            <p className={`${styles.projectDescription} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{project.description}</p>
                            <p className={`${styles.projectDomain} ${isDarkMode ? styles.darkDomain : ''}`}>{project.domain}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}