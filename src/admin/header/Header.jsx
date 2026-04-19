import React from 'react';
import styles from './Header.module.css';

const Header = ({ onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoHighlight}>Portfolio</span> Admin
      </div>
      <button type="button" onClick={onLogout} className={styles.logoutButton}>
        <span className={styles.logoutIcon}>→</span> Logout
      </button>
    </header>
  );
};

export default Header;