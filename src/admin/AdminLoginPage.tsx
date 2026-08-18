import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const ADMIN_EMAIL = 'admin@customix3d.com';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ok =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (!ok) {
      setError('Invalid credentials. Use admin@customix3d.com / admin123');
      setLoading(false);
      return;
    }

    // Write BOTH keys so AdminRoute always accepts
    localStorage.setItem('cmx_admin', '1');
    localStorage.setItem('customix3d-admin', '1');

    setLoading(false);
    // Hard navigate so route guard re-reads localStorage
    window.location.href = '/admin';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-400">CustoMix3D dashboard</p>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-2xl space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@customix3d.com"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-xs text-slate-500">
            Demo: <strong>admin@customix3d.com</strong> / <strong>admin123</strong>
          </p>
          <p className="text-center text-sm">
            <Link to="/" className="text-sky-600 hover:underline">
              ← Back to store
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
