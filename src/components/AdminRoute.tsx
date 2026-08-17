import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('cmx_admin') === '1'
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
