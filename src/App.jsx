import { Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import LoginPage from './admin/LoginPage/LoginPage';
import AdminPanel from './admin/dashboard/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/LoginPanel" element={<LoginPage />} />
      <Route path="/AdminPanel" element={<ProtectedRoute element={AdminPanel} />} />
    </Routes>
  );
}

export default App;