import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@customix3d.com' && password === 'admin123') {
      localStorage.setItem('cmx_admin', '1')
      navigate('/admin')
    } else {
      setError('Invalid credentials. Use admin@customix3d.com / admin123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-center mb-2">Admin</h1>
        <p className="text-center text-sm text-ink-500 mb-6">CustoMix3D control panel</p>
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
        <p className="mt-4 text-xs text-center text-ink-500">Demo: admin@customix3d.com / admin123</p>
      </div>
    </div>
  )
}
