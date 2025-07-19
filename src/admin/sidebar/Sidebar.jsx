import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();

  // Check if current route is dashboard or starts with /admin
  const isDashboardActive = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>Navigation</span>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${isDashboardActive ? styles.active : ''}`}>
            <span className={styles.navIcon}>📊</span>
            Dashboard
          </li>
          <li className={styles.navItem}>
            <span className={styles.navIcon}>✏️</span>
            Content Editor
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