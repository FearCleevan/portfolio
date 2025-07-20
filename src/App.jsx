import { Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import LoginPage from './admin/LoginPage/LoginPage';
import AdminPanel from './admin/dashboard/AdminPanel';
import ContentEditor from './admin/ContentEditor/ContentEditor';
import ProtectedRoute from './components/ProtectedRoute';
import FullTechStack from './components/Main/FullTechStack'; // Add this import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/tech-stack" element={<FullTechStack />} /> {/* Add this route */}
      <Route path="/LoginPanel" element={<LoginPage />} />
      <Route path="/AdminPanel" element={<ProtectedRoute element={AdminPanel} />} />
      <Route path="/AdminPanel/content" element={<ProtectedRoute element={ContentEditor} />} />
    </Routes>
  );
}

export default App;