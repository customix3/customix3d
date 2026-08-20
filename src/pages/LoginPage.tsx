import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect.startsWith('/') ? redirect : '/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display mb-2 text-center text-3xl font-bold">Welcome back</h1>
      {redirect === '/checkout' && (
        <p className="mb-6 text-center text-sm text-slate-500">Sign in to continue to checkout</p>
      )}
      {!redirect.includes('checkout') && <div className="mb-6" />}
      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            className="input mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            className="input mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-slate-500">
          No account?{' '}
          <Link
            to={`/signup${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-medium text-sky-600"
          >
            Sign up with WhatsApp
          </Link>
        </p>
      </form>
    </div>
  );
}
