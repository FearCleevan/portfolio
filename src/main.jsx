import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { initAuth } from './firebase/services/authService';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize Firebase auth persistence
initAuth().catch((error) => {
  console.error('Firebase initialization error:', error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);