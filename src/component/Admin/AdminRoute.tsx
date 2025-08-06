// components/AdminRoute.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext)!;

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return <>{children}</>;
};

export default AdminRoute;
