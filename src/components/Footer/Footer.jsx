// src/components/Footer/Footer.jsx
import styles from './Footer.module.css';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <footer className={`${styles.footer} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.content}>
        <p className={`${styles.copyright} ${isDarkMode ? styles.darkText : ''}`}>
          © 2025 Peter Paul Abillar Lazan. All rights reserved.
        </p>
        <a 
          href="#feedback" 
          className={`${styles.feedback} ${isDarkMode ? styles.darkLink : ''}`}
          aria-label="Provide feedback"
        >
          Feedback
        </a>
      </div>
    </footer>
  );
};

export default Footer;