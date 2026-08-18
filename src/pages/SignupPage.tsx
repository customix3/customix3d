import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!whatsapp.trim()) {
      setError('WhatsApp number is mandatory');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password, whatsapp.trim());
      navigate(redirect.startsWith('/') ? redirect : '/account');
    } catch {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-2 text-center">Create account</h1>
      {redirect === '/checkout' && (
        <p className="text-center text-sm text-slate-500 mb-6">
          Sign up to continue to checkout
        </p>
      )}
      {!redirect.includes('checkout') && <div className="mb-6" />}
      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium text-slate-700">Full name *</label>
          <input
            className="input mt-1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email *</label>
          <input
            className="input mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">WhatsApp *</label>
          <input
            className="input mt-1"
            required
            placeholder="+91 9XXXXXXXXX"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password *</label>
          <input
            className="input mt-1"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating…' : 'Sign up'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="text-sky-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
