// src/components/Container/Container.jsx
import React from 'react';
import styles from './Container.module.css';
import { Link } from 'react-router-dom';

const Container = ({ isDarkMode, projects, certifications = [] }) => {
    // Show only first 4 projects
    const displayedProjects = projects.slice(0, 4);
    const displayedCertifications = certifications.slice(0, 4);

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
            {/* Projects Section */}
            <div className={`${styles.bentoCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                        <h2 className={`${styles.cardHeading} ${isDarkMode ? styles.darkText : ''}`}><span className={styles.gridIcon}>📂</span> Recent Projects</h2>
                    </div>
                    <Link to="/projects" className={`${styles.viewAllLink} ${isDarkMode ? styles.darkLink : ''}`}>
                        View All
                        <svg className={styles.linkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
                <div className={styles.projectsGrid}>
                    {displayedProjects.map((project) => (
                        <div key={project.id} className={`${styles.projectCard} ${isDarkMode ? styles.darkProjectCard : ''}`}>
                            <a target="_blank" rel="noopener noreferrer" className={styles.projectLink} href={project.url}>
                                <h3 className={`${styles.projectTitle} ${isDarkMode ? styles.darkText : ''}`}>
                                    {project.title}
                                    {/* <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg> */}
                                </h3>
                                <p className={`${styles.projectDescription} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{project.description}</p>
                                <p className={`${styles.projectDomain} ${isDarkMode ? styles.darkDomain : ''}`}>{project.domain}</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications Section */}
            <div className={`${styles.bentoCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                        <h2 className={`${styles.cardHeading} ${isDarkMode ? styles.darkText : ''}`}>
                            <span className={styles.gridIcon}>🎓</span> Certifications
                        </h2>
                    </div>
                    <Link to="/certifications" className={`${styles.viewAllLink} ${isDarkMode ? styles.darkLink : ''}`}>
                        View All
                        <svg className={styles.linkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
                <div className={styles.certificationsList}>
                    {displayedCertifications.map((cert) => (
                        <div key={cert.id} className={`${styles.certificationItem} ${isDarkMode ? styles.darkCertificationItem : ''}`}>
                            <a target="_blank" rel="noopener noreferrer" className={styles.certificationLink} href={cert.url}>
                                <h3 className={`${styles.certificationTitle} ${isDarkMode ? styles.darkText : ''}`}>
                                    {cert.title}
                                    <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </h3>
                                <p className={`${styles.certificationIssuer} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{cert.issuer}</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Container;