import React, { useState } from 'react';
import { logoutAdmin } from '../../firebase/services/authService';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [activePreview, setActivePreview] = useState('mobile');

    const handleLogout = async () => {
        await logoutAdmin();
        navigate('/LoginPanel');
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const previewSizes = {
        mobile: { width: 530, height: 932, scale: 0.8 },
        tablet: { width: 1024, height: 1266, scale: 0.6 },
        desktop: { width: 1420, height: 1020, scale: 0.68 }
    };

    return (
        <div className={styles.adminContainer}>
            <Header onLogout={handleLogout} />
            <div className={styles.adminContent}>
                <Sidebar />
                <main className={styles.mainContent}>
                    <div className={styles.headerContainer}>
                        <h1>Admin Dashboard</h1>
                        <p className={styles.previewTitle}>Portfolio Preview</p>
                    </div>

                    <div className={styles.previewControls}>
                        <button
                            className={`${styles.previewButton} ${activePreview === 'mobile' ? styles.active : ''}`}
                            onClick={() => setActivePreview('mobile')}
                        >
                            Mobile
                        </button>
                        <button
                            className={`${styles.previewButton} ${activePreview === 'tablet' ? styles.active : ''}`}
                            onClick={() => setActivePreview('tablet')}
                        >
                            Tablet
                        </button>
                        <button
                            className={`${styles.previewButton} ${activePreview === 'desktop' ? styles.active : ''}`}
                            onClick={() => setActivePreview('desktop')}
                        >
                            Desktop
                        </button>
                    </div>

                    <div className={styles.previewContainer}>
                        <div
                            className={styles.deviceWrapper}
                            style={{
                                transform: `scale(${previewSizes[activePreview].scale})`
                            }}
                        >
                            <div
                                className={styles.deviceFrame}
                                style={{
                                    width: `${previewSizes[activePreview].width}px`,
                                    height: `${previewSizes[activePreview].height}px`
                                }}
                            >
                                <div className={styles.screen}>
                                    {isLoading && (
                                        <div className={styles.loadingOverlay}>
                                            <div className={styles.spinner}></div>
                                            <p>Loading application...</p>
                                        </div>
                                    )}

                                    {hasError ? (
                                        <div className={styles.errorOverlay}>
                                            <p>Failed to load the application.</p>
                                            <button onClick={() => {
                                                setHasError(false);
                                                setIsLoading(true);
                                            }}>
                                                Retry
                                            </button>
                                        </div>
                                    ) : (
                                        <iframe
                                            src="https://devpaul-sand.vercel.app/"
                                            title="Portfolio Preview"
                                            className={styles.embeddedFrame}
                                            allow="fullscreen"
                                            onLoad={handleIframeLoad}
                                            onError={handleIframeError}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;