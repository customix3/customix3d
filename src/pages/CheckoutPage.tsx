import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

/** Checkout requires login / signup */
export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: '',
  });

  // Redirect to login if not signed in
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Prefill from account when available
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name || '',
      email: f.email || user.email || '',
      whatsapp: f.whatsapp || user.whatsapp || '',
    }));
  }, [user]);

  const amount = typeof total === 'function' ? total() : 0;

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-slate-500">
        Checking account…
      </div>
    );
  }

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Shop now
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Order placed! 🎉</h1>
        <p className="text-slate-600 mb-6">
          Demo payment successful. We will update you on WhatsApp.
        </p>
        <Link
          to="/orders"
          className="inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          View orders
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.whatsapp.trim()) {
      alert('WhatsApp number is required');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      clear();
      setDone(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-slate-500 mb-8">
        Signed in as <strong>{user.email}</strong> · TEST payment mode
      </p>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full name *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">WhatsApp *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  required
                  placeholder="+91 9XXXXXXXXX"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Shipping</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Address *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pincode *</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sticky top-6">
            <h2 className="font-semibold mb-4">Order summary</h2>
            <ul className="space-y-3 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-2">
                  <span className="text-slate-600">
                    {i.name} × {i.quantity}
                  </span>
                  <span className="font-medium">₹{i.price * i.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{amount}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">TEST MODE — no real payment</p>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Processing…' : `Pay ₹${amount}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
