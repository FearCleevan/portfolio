import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './services/analyticsService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LoadingProvider } from './context/LoadingContext';
import PageLoader, { NavigationBar } from './components/PageLoader/PageLoader';
import Main from './components/Main/Main';
import ChatButton from './components/Chat/ChatButton';

const FullTechStack     = lazy(() => import('./components/Main/FullTechStack'));
const FullExperience    = lazy(() => import('./components/Main/FullExperience'));
const AllProjects       = lazy(() => import('./components/Container/AllProjects'));
const AllCertifications = lazy(() => import('./components/Container/AllCertifications'));
const RecentBlogs       = lazy(() => import('./components/RecentBlogs/RecentBlogs'));
const BlogPost          = lazy(() => import('./components/BlogPost/BlogPost'));
const NotFound          = lazy(() => import('./components/NotFound/NotFound'));

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <LoadingProvider>
      {/* Fires trackPageView on every navigation */}
      <RouteTracker />

      {/* Thin progress bar on every route change */}
      <NavigationBar />

      {/* Full-screen loader on first-load of lazy chunks */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/tech-stack" element={<FullTechStack />} />
          <Route path="/experience" element={<FullExperience />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/certifications" element={<AllCertifications />} />
          <Route path="/blog" element={<RecentBlogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ChatButton />

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
    </LoadingProvider>
  );
}

export default App;
