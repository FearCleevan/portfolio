import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // Add Link import
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();

  // Check if current route is dashboard or content editor
  const isDashboardActive = location.pathname === '/AdminPanel';
  const isContentEditorActive = location.pathname === '/AdminPanel/content';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Navigation</span>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${isDashboardActive ? styles.active : ''}`}>
            <Link to="/AdminPanel" className={styles.navLink}>
              <span className={styles.navIcon}>📊</span>
              Dashboard
            </Link>
          </li>
          <li className={`${styles.navItem} ${isContentEditorActive ? styles.active : ''}`}>
            <Link to="/AdminPanel/content" className={styles.navLink}>
              <span className={styles.navIcon}>✏️</span>
              Content Editor
            </Link>
          </li>
          <li className={styles.navItem}>
            <span className={styles.navIcon}>💬</span>
            Chat Management
          </li>
          <li className={styles.navItem}>
            <span className={styles.navIcon}>⚙️</span>
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;