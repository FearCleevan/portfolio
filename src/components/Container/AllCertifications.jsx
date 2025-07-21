import React from 'react';
import styles from './AllCertifications.module.css';
import { Link } from 'react-router-dom';
import { useCertifications } from '../../firebase/hooks/useCertifications';

export default function AllCertifications({ isDarkMode }) {
    const { certifications, loading, error } = useCertifications();

    if (loading) return <div className={styles.allCertificationsContainer}>Loading certifications...</div>;
    if (error) return <div>Error loading certifications</div>;

    return (
        <div className={`${styles.allCertificationsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.header}>
                <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
                    <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Home
                </Link>
                <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>All Certifications</h1>
            </div>

            <div className={styles.certificationsGrid}>
                {certifications.map((cert) => (
                    <div key={cert.id} className={`${styles.certificationCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
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
    );
}