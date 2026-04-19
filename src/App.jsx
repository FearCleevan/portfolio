// src/App.jsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initAuth } from './firebase/services/authService';

// Eagerly loaded — renders immediately on first visit
import Main from './components/Main/Main';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTop from './components/BackToTop/BackToTop';

// Lazily loaded — only fetched when the user navigates to these routes
const FullTechStack     = lazy(() => import('./components/Main/FullTechStack'));
const FullExperience    = lazy(() => import('./components/Main/FullExperience'));
const AllProjects       = lazy(() => import('./components/Container/AllProjects'));
const AllCertifications = lazy(() => import('./components/Container/AllCertifications'));
const RecentBlogs       = lazy(() => import('./components/RecentBlogs/RecentBlogs'));
const BlogPost          = lazy(() => import('./components/BlogPost/BlogPost'));

// Admin routes — heaviest bundle, only loaded by authenticated user
const LoginPage     = lazy(() => import('./admin/LoginPage/LoginPage'));
const AdminPanel    = lazy(() => import('./admin/dashboard/AdminPanel'));
const ContentEditor = lazy(() => import('./admin/ContentEditor/ContentEditor'));
const NotFound      = lazy(() => import('./components/NotFound/NotFound'));

function PageLoader() {
  const isDark = (() => {
    try { return localStorage.getItem('darkMode') === 'true'; } catch { return false; }
  })();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: isDark ? '#1a1a1a' : '#ffffff',
    }}>
      <div
        className="app-loader-spinner"
        style={{
          border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          borderTopColor: isDark ? '#f0f0f0' : '#111827',
        }}
      />
    </div>
  );
}

function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initAuth();
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeApp();
  }, []);

  if (!isAuthChecked) {
    return <PageLoader />;
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/tech-stack" element={<FullTechStack />} />
          <Route path="/experience" element={<FullExperience />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/certifications" element={<AllCertifications />} />
          <Route path="/blog" element={<RecentBlogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/LoginPanel" element={<LoginPage />} />
          <Route path="/AdminPanel" element={<ProtectedRoute element={AdminPanel} />} />
          <Route path="/AdminPanel/content" element={<ProtectedRoute element={ContentEditor} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <BackToTop />
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
