import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const localAdmin =
    typeof window !== 'undefined' && localStorage.getItem('customix3d-admin') === '1';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading…
      </div>
    );
  }

  if (!isAdmin && !localAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
