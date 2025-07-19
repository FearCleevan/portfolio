import { Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import LoginPage from './admin/LoginPage/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/LoginPanel" element={<LoginPage />} />
    </Routes>
  );
}

export default App;