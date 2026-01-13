// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './components/Main/Main';
import LoginPage from './admin/LoginPage/LoginPage';
import AdminPanel from './admin/dashboard/AdminPanel';
import ContentEditor from './admin/ContentEditor/ContentEditor';
import ProtectedRoute from './components/ProtectedRoute';
import FullTechStack from './components/Main/FullTechStack';
import FullExperience from './components/Main/FullExperience'; // Import the new component
import AllProjects from './components/Container/AllProjects';
import AllCertifications from './components/Container/AllCertifications';
import RecentBlogs from './components/RecentBlogs/RecentBlogs';
import BlogPost from './components/BlogPost/BlogPost';
import { useEffect, useState } from 'react';
import { initAuth, getCurrentUser } from './firebase/services/authService';

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Firebase auth with persistence
        await initAuth();
        
        // Get the current user if already logged in
        const user = getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Show loading state while checking authentication
  if (!isAuthChecked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#fffff'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '18px',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <Main 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode} 
            />
          } 
        />
        <Route 
          path="/tech-stack" 
          element={
            <FullTechStack 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route 
          path="/experience" 
          element={
            <FullExperience 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route 
          path="/projects" 
          element={
            <AllProjects 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route 
          path="/certifications" 
          element={
            <AllCertifications 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route 
          path="/blog" 
          element={
            <RecentBlogs 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route 
          path="/blog/:slug" 
          element={
            <BlogPost 
              isDarkMode={isDarkMode} 
            />
          } 
        />
        <Route path="/LoginPanel" element={<LoginPage />} />
        <Route 
          path="/AdminPanel" 
          element={<ProtectedRoute element={AdminPanel} />} 
        />
        <Route 
          path="/AdminPanel/content" 
          element={<ProtectedRoute element={ContentEditor} />} 
        />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;