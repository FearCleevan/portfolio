import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './NotFound.module.css';

export default function NotFound() {
    const { isDarkMode } = useTheme();

    return (
        <div className={`${styles.wrapper} ${isDarkMode ? styles.dark : ''}`}>
            <div className={styles.content}>
                <p className={styles.code}>404</p>
                <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>Page Not Found</h1>
                <p className={`${styles.message} ${isDarkMode ? styles.darkSecondary : ''}`}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link to="/" className={`${styles.homeLink} ${isDarkMode ? styles.darkHomeLink : ''}`}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
