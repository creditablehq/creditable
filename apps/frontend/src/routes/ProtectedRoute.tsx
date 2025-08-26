import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Roles = 'ADMIN' | 'BROKER';

interface props {
  allowedRoles: Roles[]
};

const ProtectedRoute = ({ allowedRoles }: props) => {
  const { user, logout } = useAuth(); // Get user and their roles from context

  if (!user) {
    logout();
  }

  // Check if user has any of the allowed roles
  const hasRequiredRole = allowedRoles.some(role => user.role === role);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
