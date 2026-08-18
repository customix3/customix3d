import { Navigate } from 'react-router-dom';

function isAdminLoggedIn() {
  if (typeof window === 'undefined') return false;
  // Support both keys (old + new)
  return (
    localStorage.getItem('cmx_admin') === '1' ||
    localStorage.getItem('customix3d-admin') === '1'
  );
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
