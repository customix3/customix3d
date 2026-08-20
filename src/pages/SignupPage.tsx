import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PhoneInput, { splitPhone } from '@/components/PhoneInput';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('+91');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { local } = splitPhone(whatsapp);
    if (local.length < 8) {
      setError('Enter a valid WhatsApp mobile number');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password, whatsapp.trim());
      navigate(redirect.startsWith('/') ? redirect : '/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display mb-2 text-center text-3xl font-bold">Create account</h1>
      <p className="mb-6 text-center text-sm text-slate-500">
        WhatsApp with country code is required for order updates
      </p>
      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
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
          <div className="mt-1">
            <PhoneInput value={whatsapp} onChange={setWhatsapp} required />
          </div>
          <p className="mt-1 text-xs text-slate-400">We message shipping updates here</p>
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
            className="font-medium text-sky-600"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
