import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../firebase/services/authService';

const ProtectedRoute = ({ element: Element }) => {
  const user = getCurrentUser();
  return user ? <Element /> : <Navigate to="/LoginPanel" replace />;
};

export default ProtectedRoute;