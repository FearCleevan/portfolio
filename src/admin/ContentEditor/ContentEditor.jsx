//src/admin/ContentEditor/ContentEditor.jsx
import React, { useState, useEffect } from 'react';
import { logoutAdmin } from '../../firebase/services/authService';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import styles from './ContentEditor.module.css';
import AboutEditor from './AboutEditor';
import TechStackEditor from './TechStackEditor';
import ExperienceEditor from './ExperienceEditor';
import ProjectsEditor from './ProjectsEditor';
import CertificationsEditor from './CertificationsEditor';
import BlogPostEditor from './BlogPostEditor';

const ContentEditor = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/LoginPanel');
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'about':
        return <AboutEditor />;
      case 'techStack':
        return <TechStackEditor />;
      case 'experience':
        return <ExperienceEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'certifications':
        return <CertificationsEditor />;
      case 'blogPosts':
        return <BlogPostEditor />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Header onLogout={handleLogout} />
      <div className={styles.adminContent}>
        <Sidebar />
        <main className={styles.mainContent}>
          {isLoading ? (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
              <p>Loading content editor...</p>
            </div>
          ) : hasError ? (
            <div className={styles.errorOverlay}>
              <p>Failed to load the content editor.</p>
              <button onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className={styles.headerContainer}>
                <h1>Content Editor</h1>
                <p className={styles.previewTitle}>Manage your portfolio content</p>
              </div>

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'techStack' ? styles.active : ''}`}
                  onClick={() => setActiveTab('techStack')}
                >
                  Tech Stack
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'experience' ? styles.active : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  Experience
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  Projects
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'certifications' ? styles.active : ''}`}
                  onClick={() => setActiveTab('certifications')}
                >
                  Certifications
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'blogPosts' ? styles.active : ''}`}
                  onClick={() => setActiveTab('blogPosts')}
                >
                  Blog Posts
                </button>
              </div>

              <div className={styles.editorContainer}>
                {renderActiveTab()}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContentEditor;