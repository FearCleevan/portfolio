// src/components/Main/Main.jsx
import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import Header from '../Header/Header';
import Container from '../Container/Container';
import ContainerSecond from '../Container/ContainerSecond';
import Footer from '../Footer/Footer';
import { useAboutContent } from '../../firebase/hooks/useFirestore';
import ChatButton from '../Chat/ChatButton';
import { Link, useLocation } from 'react-router-dom';
import { useTechStack } from '../../firebase/hooks/useTechStack';
import { useExperience } from '../../firebase/hooks/useExperience';
import { useProjects } from '../../firebase/hooks/useProjects';
import { useCertifications } from '../../firebase/hooks/useCertifications';
import GitHubCalendar from '../Container/GitHubCalendar';

export default function Main() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isMounted, setIsMounted] = useState(false);
    const { aboutContent, loading: aboutLoading, error: aboutError } = useAboutContent();
    const { techStack: allTechStack, loading: techStackLoading, error: techStackError } = useTechStack();
    const { experience: experienceData, loading: experienceLoading, error: experienceError } = useExperience();
    const { projects, loading: projectsLoading, error: projectsError } = useProjects();
    const { certifications, loading: certLoading, error: certError } = useCertifications();

    const location = useLocation();
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsExiting(false);
        return () => setIsExiting(true);
    }, [location]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Get first 3 groups and limit items to 5 per group
    const limitedTechStackData = {
        groups: allTechStack.slice(0, 3).map(group => ({
            ...group,
            items: group.items.slice(0, 5)
        }))
    };

    if (aboutLoading || techStackLoading || experienceLoading || projectsLoading || certLoading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading portfolio...</p>
            </div>
        );
    }

    if (aboutError || techStackError || experienceError || projectsError || certError) {
        return (
            <div className={styles.errorOverlay}>
                <p>Failed to load portfolio content.</p>
                <button onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''} ${isMounted ? styles.mounted : ''} ${isExiting ? styles.exit : ''}`}>
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={styles.gridContainer}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        {/* About */}
                        <section className={`${styles.gridBox} ${isDarkMode ? styles.darkGridBox : ''}`}>
                            <h2 className={`${styles.gridTitle} ${isDarkMode ? styles.darkText : ''}`}>
                                <span className={styles.gridIcon}>📄</span> About
                            </h2>
                            {aboutContent.map((paragraph, index) => (
                                <React.Fragment key={index}>
                                    <p className={`${styles.aboutText} ${isDarkMode ? styles.darkText : ''}`}>{paragraph}</p>
                                    {index < aboutContent.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </section>

                        {/* Tech Stack */}
                        <section className={`${styles.gridBox} ${isDarkMode ? styles.darkGridBox : ''}`}>
                            <div className={styles.techStackHeader}>
                                <div className={styles.techStackTitleRow}>
                                    <h2 className={`${styles.gridTitle} ${isDarkMode ? styles.darkText : ''}`}> <span className={styles.gridIcon}>💻</span> Tech Stack</h2>
                                </div>
                                <Link to="/tech-stack" className={`${styles.techStackLink} ${isDarkMode ? styles.darkLink : ''}`}>
                                    View All
                                    <svg className={styles.techStackArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </div>
                            <div className={styles.techStackGroups}>
                                {limitedTechStackData.groups.map((group, index) => (
                                    <div key={index} className={styles.techStackGroup}>
                                        <h3 className={`${styles.techStackGroupTitle} ${isDarkMode ? styles.darkText : ''}`}>{group.title}</h3>
                                        <div className={styles.techStackTags}>
                                            {group.items.map((item, itemIndex) => (
                                                <span key={itemIndex} className={`${styles.techTag} ${isDarkMode ? styles.darkTechTag : ''}`}>{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumn}>
                        {/* Experience Section */}
                        <section className={`${styles.gridBox} ${isDarkMode ? styles.darkGridBox : ''}`}>
                            <div className={styles.experienceHeader}>
                                <h2 className={`${styles.gridTitle} ${isDarkMode ? styles.darkText : ''}`}> <span className={styles.gridIcon}>💼</span> Experience</h2>
                            </div>
                            <div className={styles.timelineBox}>
                                <div className={`${styles.timelineLine} ${isDarkMode ? styles.darkTimelineLine : ''}`}></div>
                                {experienceData.map((item) => {
                                    const itemClass = item.status === 'active'
                                        ? styles.timelineItemActive
                                        : item.status === 'current'
                                            ? styles.timelineItemCurrent
                                            : styles.timelineItem;

                                    const dotClass = item.status === 'active'
                                        ? styles.timelineDotActive
                                        : item.status === 'current'
                                            ? styles.timelineDotCurrent
                                            : styles.timelineDot;

                                    const roleClass = item.status === 'active'
                                        ? styles.timelineRoleActive
                                        : styles.timelineRole;

                                    return (
                                        <div key={item.id} className={itemClass}>
                                            <div className={`${dotClass} ${isDarkMode ? item.status === 'active' ? styles.darkTimelineDotActive : styles.darkTimelineDot : ''}`}></div>
                                            <div className={styles.timelineContent}>
                                                <h3 className={`${roleClass} ${isDarkMode ? styles.darkText : ''}`}>{item.role}</h3>
                                                <div className={styles.timelineDetails}>
                                                    <span className={`${styles.timelineCompany} ${isDarkMode ? styles.darkText : ''}`}>{item.company}</span>
                                                    <span className={`${styles.timelineYear} ${isDarkMode ? styles.darkTimelineYear : ''}`}>{item.year}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Container isDarkMode={isDarkMode} projects={projects} certifications={certifications} />
            <ContainerSecond isDarkMode={isDarkMode} />
            <GitHubCalendar
                username={import.meta.env.VITE_GITHUB_USERNAME}
                token={import.meta.env.VITE_GITHUB_TOKEN}
                isDarkMode={isDarkMode}
            />
            <Footer isDarkMode={isDarkMode} />
            <ChatButton isDarkMode={isDarkMode} />
        </div>
    );
}
