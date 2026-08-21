import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/store/ordersStore';
import { CheckCircle2, XCircle, Clock, Layers } from 'lucide-react';

const TOTAL_SEC = 180; // 3 minutes

const WAIT_LINES = [
  'Printing confirmation layer by layer…',
  'Your shelf is almost upgraded…',
  'Nozzle warm. Waiting for admin check…',
  'Matching UTR with the print bed…',
  'Almost there — good prints take a minute.',
];

type Props = {
  orderId: string;
  utr: string;
  amount: number;
};

export default function PaymentWaitingScreen({ orderId, utr, amount }: Props) {
  const orders = useOrders((s) => s.orders);
  const order = orders.find((o) => o.id === orderId);
  const status = order?.status || 'Pending';

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SEC);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (status !== 'Pending') return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [status, secondsLeft]);

  useEffect(() => {
    if (status !== 'Pending') return;
    const t = setInterval(() => setLineIndex((i) => (i + 1) % WAIT_LINES.length), 3200);
    return () => clearInterval(t);
  }, [status]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = ((TOTAL_SEC - secondsLeft) / TOTAL_SEC) * 100;
  const timedOut = secondsLeft <= 0 && status === 'Pending';
  const paid =
    status === 'Paid' || status === 'Processing' || status === 'Shipped' || status === 'Delivered';
  const failed = status === 'Cancelled' || status === 'Refunded';

  if (paid) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Payment successful!</h1>
        <p className="mt-2 text-slate-600">Your order is confirmed. Print queue unlocked.</p>
        <p className="mt-3 font-mono text-sm font-semibold text-brand-600">{orderId}</p>
        <p className="mt-1 text-xs text-slate-400">UTR: {utr}</p>
        <Link
          to={`/orders/${orderId}`}
          className="mt-8 inline-flex rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white"
        >
          View order tracking
        </Link>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100"
        >
          <XCircle className="h-14 w-14 text-red-500" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Payment not confirmed</h1>
        <p className="mt-2 text-slate-600">
          This order was cancelled or refunded. If money left your account, it will return as per UPI
          rules.
        </p>
        <p className="mt-3 font-mono text-sm font-semibold text-slate-500">{orderId}</p>
        <Link
          to="/orders"
          className="mt-8 inline-flex rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white"
        >
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative mb-8 flex flex-col items-center">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-brand-400/15 blur-3xl" />
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <div className="h-3 w-12 rounded-t-md bg-ink-700" />
          <div className="mx-auto h-7 w-7 rounded-b-full bg-gradient-to-b from-ink-600 to-ink-900 shadow-lg" />
          <div className="absolute left-1/2 top-full h-3 w-1 -translate-x-1/2 bg-brand-400" />
        </motion.div>

        <div className="relative mt-1 flex h-32 w-28 flex-col-reverse items-center justify-start gap-[3px] overflow-hidden">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              className="rounded-sm bg-gradient-to-r from-brand-500 via-brand-400 to-mint-400"
              style={{
                height: 11,
                width: `${48 + (i % 4) * 12}%`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 1.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
        <div className="mt-1 h-1.5 w-32 rounded-full bg-ink-700" />
        <div className="mt-0.5 h-2 w-36 rounded-b-md bg-ink-800" />

        <motion.span
          className="absolute -left-6 top-8 rounded-full border border-brand-200 bg-white px-2 py-1 text-[10px] font-bold text-brand-600 shadow-sm"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Layers className="mr-1 inline h-3 w-3" />
          Mini
        </motion.span>
        <motion.span
          className="absolute -right-4 top-16 rounded-full border border-mint-400/40 bg-white px-2 py-1 text-[10px] font-bold text-ink-700 shadow-sm"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        >
          Keychain
        </motion.span>
      </div>

      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {timedOut ? 'Still verifying…' : 'Confirming payment'}
      </h1>

      <AnimatePresence mode="wait">
        <motion.p
          key={timedOut ? 'timeout' : lineIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-2 max-w-sm text-sm text-slate-600"
        >
          {timedOut
            ? 'Admin is taking a bit longer. Your order is safe — we will confirm once payment is matched.'
            : WAIT_LINES[lineIndex]}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-white">
        <Clock className="h-4 w-4 text-brand-400" />
        <span className="font-mono text-lg font-bold tracking-wider">
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="mt-8 space-y-1 text-sm">
        <p className="font-mono text-xs font-semibold text-brand-600">{orderId}</p>
        <p className="text-xs text-slate-500">
          Amount <strong>₹{amount}</strong> · UTR <strong className="font-mono">{utr}</strong>
        </p>
      </div>

      <p className="mt-6 max-w-xs text-xs leading-relaxed text-slate-400">
        Keep this page open. When admin confirms your UPI payment, you will see success automatically.
        If not confirmed, the order stays pending — no fake success.
      </p>

      <Link
        to={`/orders/${orderId}`}
        className="mt-6 text-sm font-semibold text-brand-600 hover:underline"
      >
        View order page instead →
      </Link>
    </div>
  );
}
