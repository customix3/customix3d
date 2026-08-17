import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AccountPage() {
  const { user, logout } = useAuth()
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-6">Account</h1>
      <div className="card p-6 space-y-3">
        <p><span className="text-ink-500">Name:</span> {user?.name}</p>
        <p><span className="text-ink-500">Email:</span> {user?.email}</p>
        <p><span className="text-ink-500">WhatsApp:</span> {user?.whatsapp || '—'}</p>
        <div className="pt-4 flex gap-3">
          <Link to="/orders" className="btn-secondary">My orders</Link>
          <button type="button" className="btn-secondary" onClick={logout}>Log out</button>
        </div>
      </div>
    </div>
  )
}
