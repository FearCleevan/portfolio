import React, { useState, useEffect } from 'react';
import styles from './Main.module.css';
import Header from '../Header/Header';
import Container from '../Container/Container';
import Footer from '../Footer/Footer';
import { aboutData } from '../../data/about';
import { techStackData } from '../../data/techStack';
import { experienceData } from '../../data/experience';
import ChatButton from '../Chat/ChatButton';

export default function Main() {
    // Initialize state with localStorage value or default to false
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isMounted, setIsMounted] = useState(false);

    // Update localStorage whenever dark mode changes
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    return (
        <div
            className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''} ${isMounted ? styles.mounted : ''}`}
        >
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className={`${styles.mainContent} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={styles.gridContainer}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        <section className={`${styles.gridBox} ${isDarkMode ? styles.darkGridBox : ''}`}>
                            <h2 className={`${styles.gridTitle} ${isDarkMode ? styles.darkText : ''}`}>
                                <span className={styles.gridIcon}>📄</span> About
                            </h2>
                            {aboutData.description.map((paragraph, index) => (
                                <React.Fragment key={index}>
                                    <p className={`${styles.aboutText} ${isDarkMode ? styles.darkText : ''}`}>{paragraph}</p>
                                    {index < aboutData.description.length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </section>

                        {/* Tech Stack */}
                        <section className={`${styles.gridBox} ${isDarkMode ? styles.darkGridBox : ''}`}>
                            <div className={styles.techStackHeader}>
                                <div className={styles.techStackTitleRow}>
                                    <h2 className={`${styles.gridTitle} ${isDarkMode ? styles.darkText : ''}`}> <span className={styles.gridIcon}>💻</span> Tech Stack</h2>
                                </div>
                                <a className={`${styles.techStackLink} ${isDarkMode ? styles.darkLink : ''}`} href="/tech-stack">
                                    View All
                                    <svg className={styles.techStackArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                            <div className={styles.techStackGroups}>
                                {techStackData.groups.map((group, index) => (
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
            <Container isDarkMode={isDarkMode} />
            <Footer isDarkMode={isDarkMode} />
            <ChatButton isDarkMode={isDarkMode} />
        </div>
    );
}