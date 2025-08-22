import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './components/Main/Main';
import LoginPage from './admin/LoginPage/LoginPage';
import AdminPanel from './admin/dashboard/AdminPanel';
import ContentEditor from './admin/ContentEditor/ContentEditor';
import ProtectedRoute from './components/ProtectedRoute';
import FullTechStack from './components/Main/FullTechStack';
import AllProjects from './components/Container/AllProjects';
import AllCertifications from './components/Container/AllCertifications';
import RecentBlogs from './components/RecentBlogs/RecentBlogs';
import BlogPost from './components/BlogPost/BlogPost';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/tech-stack" element={<FullTechStack />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/certifications" element={<AllCertifications />} />
        <Route path="/blog" element={<RecentBlogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/LoginPanel" element={<LoginPage />} />
        <Route path="/AdminPanel" element={<ProtectedRoute element={AdminPanel} />} />
        <Route path="/AdminPanel/content" element={<ProtectedRoute element={ContentEditor} />} />
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