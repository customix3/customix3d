import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { openRazorpayCheckout } from '@/services/paymentService';
import { useOrders } from '@/store/ordersStore';
import { subscribeOffers, type Offer } from '@/services/firestoreAdmin';
import PhoneInput, { splitPhone } from '@/components/PhoneInput';

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
  const [offers, setOffers] = useState<Offer[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState<Offer | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '+91',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => subscribeOffers(setOffers), []);

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
      whatsapp: f.whatsapp && f.whatsapp !== '+91' ? f.whatsapp : user.whatsapp || '+91',
    }));
  }, [user]);

  useEffect(() => {
    if (!done || !orderId) return;
    const t = setTimeout(() => navigate(`/orders/${orderId}`, { replace: true }), 3200);
    return () => clearTimeout(t);
  }, [done, orderId, navigate]);

  const subtotal = typeof total === 'function' ? total() : 0;
  const discount = applied ? Math.round((subtotal * applied.discountPercent) / 100) : 0;
  const amount = Math.max(1, subtotal - discount);

  const applyCoupon = () => {
    setCouponMsg('');
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMsg('Enter a code');
      return;
    }
    const found = offers.find((o) => o.active && o.code.toUpperCase() === code);
    if (!found) {
      setApplied(null);
      setCouponMsg('Invalid or inactive code');
      return;
    }
    setApplied(found);
    setCouponMsg(`${found.discountPercent}% off applied`);
  };

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-slate-500">Checking account…</div>
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
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="mb-6 text-7xl sm:text-8xl"
          aria-hidden
        >
          🎉
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h1 className="font-display mb-2 text-2xl font-bold sm:text-3xl">Payment done!</h1>
          <p className="mb-1 text-lg text-slate-600">Order placed successfully</p>
          <p className="mb-2 font-mono text-sm font-semibold text-brand-600">{orderId}</p>
          {paymentId && <p className="mb-4 text-xs text-slate-400">Payment: {paymentId}</p>}
          <p className="mb-6 text-sm text-slate-500">Taking you to order tracking…</p>
          <Link
            to={`/orders/${orderId}`}
            className="inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            View tracking now
          </Link>
        </motion.div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { local } = splitPhone(form.whatsapp);
    if (local.length < 8) {
      setError('Enter a valid WhatsApp number with country code');
      return;
    }
    setLoading(true);
    try {
      const payment = await openRazorpayCheckout({
        amountRupees: amount,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.whatsapp,
        description: applied
          ? `CustoMix3D · ${applied.code} · ${items.length} item(s)`
          : `CustoMix3D order · ${items.length} item(s)`,
      });

      const payId = payment.razorpay_payment_id ? String(payment.razorpay_payment_id) : '';
      const rzpOrder = payment.razorpay_order_id ? String(payment.razorpay_order_id) : '';

      const orderPayload: Parameters<typeof addOrder>[0] = {
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
          ...(i.image ? { image: i.image } : {}),
        })),
        total: amount,
        status: 'Paid',
      };
      if (payId) orderPayload.paymentId = payId;
      if (rzpOrder) orderPayload.razorpayOrderId = rzpOrder;

      const order = await addOrder(orderPayload);
      clear();
      setOrderId(order.id);
      setPaymentId(payId);
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      if (msg.includes('permission') || msg.includes('Permission')) {
        setError('Order save failed (Firestore rules).');
      } else if (msg !== 'Payment cancelled') {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="font-display mb-2 text-2xl font-bold sm:text-3xl">Checkout</h1>
      <p className="mb-6 text-sm text-slate-500 sm:mb-8">
        Signed in as <strong>{user.email}</strong> · Razorpay{' '}
        <span className="font-medium text-amber-600">TEST</span>
      </p>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-semibold">Contact</h2>
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
                <div className="mt-1">
                  <PhoneInput
                    value={form.whatsapp}
                    onChange={(v) => setForm({ ...form, whatsapp: v })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-semibold">Shipping</h2>
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
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-20">
            <h2 className="mb-4 font-semibold">Order summary</h2>
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

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-xl bg-slate-100 px-3 text-sm font-medium"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs ${applied ? 'text-emerald-600' : 'text-red-600'}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({applied?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-lg font-semibold">
                <span>Total</span>
                <span>₹{amount}</span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Opening payment…' : `Pay ₹${amount} · UPI / Card`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
