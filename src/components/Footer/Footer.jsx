import styles from './Footer.module.css';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`${styles.footer} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.content}>
        <p className={`${styles.copyright} ${isDarkMode ? styles.darkText : ''}`}>© 2025 Peter Paul Abillar Lazan. All rights reserved.</p>
        <a href="#feedback" className={`${styles.feedback} ${isDarkMode ? styles.darkLink : ''}`}>Feedback</a>
      </div>
    </footer>
  );
};

export default Footer;