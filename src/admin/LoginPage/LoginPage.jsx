//src/admin/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../firebase/services/authService';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await loginAdmin(email, password);
      navigate('/AdminPanel'); // Changed to /AdminPanel
    } catch (err) {
      let errorMessage = 'Failed to login. Please try again.';
      
      // More specific error messages
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Account temporarily locked.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.pageWrapper} ${styles.loginWrapper}`}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1>Admin Login</h1>
          <p>Access your content management panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formInput}
              placeholder="admin@example.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              'Login'
            )}
          </button>

          {/* Demo credentials hint (remove in production) */}
          {/* <div className={styles.demoHint}>
            <p>Demo credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: password123</p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;