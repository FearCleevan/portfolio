import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './BackToTop.module.css';

export default function BackToTop() {
    const { isDarkMode } = useTheme();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            className={`${styles.button} ${isDarkMode ? styles.dark : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
}
