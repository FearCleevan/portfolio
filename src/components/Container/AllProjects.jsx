// src/components/Container/AllProjects.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './AllProjects.module.css';
import { Link } from 'react-router-dom';
import { useProjects } from '../../firebase/hooks/useProjects';
import { useTheme } from '../../context/ThemeContext';
import { FiChevronLeft, FiChevronRight, FiCode, FiX } from 'react-icons/fi';
import { SiAngular, SiExpress, SiFirebase, SiJavascript, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiReact, SiTailwindcss, SiTypescript, SiVuedotjs } from 'react-icons/si';

const getTechIcon = (technology = '') => {
    const key = technology.toLowerCase();
    if (key.includes('react')) return SiReact;
    if (key.includes('next')) return SiNextdotjs;
    if (key.includes('vue')) return SiVuedotjs;
    if (key.includes('angular')) return SiAngular;
    if (key.includes('javascript')) return SiJavascript;
    if (key.includes('typescript')) return SiTypescript;
    if (key.includes('tailwind')) return SiTailwindcss;
    if (key.includes('node')) return SiNodedotjs;
    if (key.includes('express')) return SiExpress;
    if (key.includes('firebase')) return SiFirebase;
    if (key.includes('mongodb')) return SiMongodb;
    if (key.includes('mysql')) return SiMysql;
    if (key.includes('postgres')) return SiPostgresql;
    return FiCode;
};

export default function AllProjects() {
    const { isDarkMode } = useTheme();
    const { projects, loading, error } = useProjects();
    const [previewState, setPreviewState] = useState({ projectId: null, imageIndex: 0 });
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;
        const q = searchQuery.toLowerCase();
        return projects.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            (p.technologies || []).some(t => t.toLowerCase().includes(q))
        );
    }, [projects, searchQuery]);

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === previewState.projectId),
        [projects, previewState.projectId]
    );

    const selectedImages = selectedProject?.sampleImages || [];
    const activeImage = selectedImages[previewState.imageIndex];
    const isPreviewOpen = Boolean(activeImage);

    const openPreview = (projectId, imageIndex) => {
        setPreviewState({ projectId, imageIndex });
    };

    const closePreview = useCallback(() => {
        setPreviewState({ projectId: null, imageIndex: 0 });
    }, []);

    const showNextImage = useCallback(() => {
        if (!selectedImages.length) return;
        setPreviewState((prev) => ({
            ...prev,
            imageIndex: (prev.imageIndex + 1) % selectedImages.length
        }));
    }, [selectedImages.length]);

    const showPrevImage = useCallback(() => {
        if (!selectedImages.length) return;
        setPreviewState((prev) => ({
            ...prev,
            imageIndex: (prev.imageIndex - 1 + selectedImages.length) % selectedImages.length
        }));
    }, [selectedImages.length]);

    useEffect(() => {
        if (!isPreviewOpen) return;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closePreview();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [closePreview, isPreviewOpen, showNextImage, showPrevImage]);

    if (loading) {
        const skCls = `${styles.skeletonLine} ${isDarkMode ? styles.darkSkeleton : ''}`;
        return (
            <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.allProjectsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                    <div className={styles.header}>
                        <div className={skCls} style={{ width: '110px', height: '14px', marginBottom: '20px', borderRadius: '6px' }} />
                        <div className={skCls} style={{ width: '180px', height: '28px', borderRadius: '6px' }} />
                        <div className={skCls} style={{ width: '80px', height: '12px', marginTop: '8px', borderRadius: '4px' }} />
                    </div>
                    <div className={skCls} style={{ width: '100%', height: '40px', borderRadius: '8px', marginBottom: '1.5rem' }} />
                    <div className={styles.projectsGrid}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={`${styles.projectCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
                                <div className={skCls} style={{ width: '65%', height: '18px', marginBottom: '10px' }} />
                                <div className={skCls} style={{ width: '100%', height: '13px', marginBottom: '6px' }} />
                                <div className={skCls} style={{ width: '80%', height: '13px', marginBottom: '12px' }} />
                                <div className={skCls} style={{ width: '38%', height: '20px', borderRadius: '999px', marginBottom: '12px' }} />
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div className={skCls} style={{ width: '56px', height: '22px', borderRadius: '999px' }} />
                                    <div className={skCls} style={{ width: '64px', height: '22px', borderRadius: '999px' }} />
                                    <div className={skCls} style={{ width: '48px', height: '22px', borderRadius: '999px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.allProjectsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                    <div className={styles.errorOverlay}>
                        <p className={isDarkMode ? styles.darkText : ''}>Error loading projects</p>
                        <button
                            type="button"
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
            <div className={`${styles.allProjectsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={styles.header}>
                    <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
                        <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>All Projects</h1>
                    <p className={`${styles.pageSubtitle} ${isDarkMode ? styles.darkPageSubtitle : ''}`}>
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                    </p>
                </div>

                <div className={styles.searchBar}>
                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        className={`${styles.searchInput} ${isDarkMode ? styles.darkSearchInput : ''}`}
                        placeholder="Search by title, description, or technology..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search projects"
                    />
                    {searchQuery && (
                        <button type="button" className={styles.searchClear} onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
                    )}
                </div>

                {searchQuery && (
                    <p className={`${styles.resultsCount} ${isDarkMode ? styles.darkResultsCount : ''}`}>
                        {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                    </p>
                )}

                {filteredProjects.length === 0 ? (
                    <p className={`${styles.noResults} ${isDarkMode ? styles.darkNoResults : ''}`}>No projects match &ldquo;{searchQuery}&rdquo;.</p>
                ) : (
                <div className={styles.projectsGrid}>
                    {filteredProjects.map((project, projectIndex) => (
                        <div key={`${project.id}-${projectIndex}`} className={`${styles.projectCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
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
                            {!!project.technologies?.length && (
                                <div className={styles.techList}>
                                    {project.technologies.map((technology) => {
                                        const TechIcon = getTechIcon(technology);
                                        return (
                                            <span key={technology} className={`${styles.techChip} ${isDarkMode ? styles.darkTechChip : ''}`}>
                                                <TechIcon />
                                                {technology}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                            {!!project.sampleImages?.length && (
                                <div className={styles.projectImageGrid}>
                                    {project.sampleImages.map((image, index) => (
                                        <button
                                            key={`${project.id}-sample-${image.id || image.url || 'image'}-${index}`}
                                            type="button"
                                            className={styles.projectImageButton}
                                            onClick={() => openPreview(project.id, index)}
                                        >
                                            <img src={image.url} alt={`${project.title} sample ${index + 1}`} className={styles.projectImage} loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                )}
            </div>
            {isPreviewOpen && (
                <div className={styles.previewOverlay} onClick={closePreview} role="dialog" aria-modal="true" aria-label="Project image preview">
                    <button
                        type="button"
                        className={`${styles.previewCloseButton} ${isDarkMode ? styles.previewCloseButtonDark : ''}`}
                        onClick={closePreview}
                        aria-label="Close preview"
                    >
                        <FiX />
                    </button>
                    {selectedImages.length > 1 && (
                        <button
                            type="button"
                            className={`${styles.previewNavButton} ${styles.previewPrevButton} ${isDarkMode ? styles.previewNavButtonDark : ''}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                showPrevImage();
                            }}
                            aria-label="Previous image"
                        >
                            <FiChevronLeft />
                        </button>
                    )}
                    <div className={styles.previewImageContainer} onClick={(event) => event.stopPropagation()} role="presentation">
                        <img src={activeImage.url} alt={`${selectedProject?.title || 'Project'} preview`} className={styles.previewImage} />
                    </div>
                    {selectedImages.length > 1 && (
                        <button
                            type="button"
                            className={`${styles.previewNavButton} ${styles.previewNextButton} ${isDarkMode ? styles.previewNavButtonDark : ''}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                showNextImage();
                            }}
                            aria-label="Next image"
                        >
                            <FiChevronRight />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
