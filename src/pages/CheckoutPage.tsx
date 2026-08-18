import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { openRazorpayCheckout } from '@/services/paymentService';
import { useOrders } from '@/store/ordersStore';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const addOrder = useOrders((s) => s.addOrder);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/login?redirect=/checkout', { replace: true });
  }, [user, authLoading, navigate]);

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
        <h1 className="font-display text-2xl font-bold mb-3">Payment successful 🎉</h1>
        <p className="text-slate-600 mb-2">
          Order <strong>{orderId}</strong>
        </p>
        {paymentId && <p className="text-xs text-slate-400 mb-6">Payment ID: {paymentId}</p>}
        <p className="text-slate-600 mb-6">Saved to cloud · visible on all admin devices.</p>
        <Link
          to="/orders"
          className="inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          View orders
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.whatsapp.trim()) {
      setError('WhatsApp number is required');
      return;
    }
    setLoading(true);
    try {
      const payment = await openRazorpayCheckout({
        amountRupees: amount,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.whatsapp,
        description: `CustoMix3D order · ${items.length} item(s)`,
      });

      const order = await addOrder({
        customerName: form.name,
        customerEmail: form.email,
        customerWhatsapp: form.whatsapp,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        total: amount,
        status: 'Paid',
        paymentId: payment.razorpay_payment_id,
        razorpayOrderId: payment.razorpay_order_id,
      });

      clear();
      setOrderId(order.id);
      setPaymentId(payment.razorpay_payment_id);
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      if (msg.includes('permission') || msg.includes('Permission')) {
        setError('Order save failed (Firestore rules). Publish rules from FIRESTORE_SETUP.md');
      } else if (msg !== 'Payment cancelled') {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-2xl font-bold sm:text-3xl mb-2">Checkout</h1>
      <p className="text-sm text-slate-500 mb-6 sm:mb-8">
        Signed in as <strong>{user.email}</strong> · Razorpay{' '}
        <span className="text-amber-600 font-medium">TEST</span>
      </p>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
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
                <label className="text-sm font-medium">WhatsApp / Mobile *</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  required
                  placeholder="10-digit mobile for UPI"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
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
          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-20">
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

            {/* Payment methods hint */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700 mb-2">Pay with</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  UPI
                </span>
                <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  GPay / PhonePe
                </span>
                <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  Cards
                </span>
                <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  Netbanking
                </span>
                <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  Wallets
                </span>
              </div>
              <p className="mt-2 text-[11px] text-amber-700">
                TEST mode: UPI shows in Razorpay popup. Use test UPI ID{' '}
                <code className="font-mono">success@razorpay</code> if asked.
              </p>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Opening payment…' : `Pay ₹${amount} · UPI / Card`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
