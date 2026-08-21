import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/store/ordersStore';

function maskName(name: string) {
  const n = (name || 'Customer').trim();
  if (n.length <= 2) return n[0] + '***';
  return n.slice(0, 1) + '***' + n.slice(-1);
}

export default function LiveOrdersTicker() {
  const orders = useOrders((s) => s.orders);
  const [idx, setIdx] = useState(0);

  const recent = useMemo(() => {
    return [...orders]
      .filter((o) => o.customerName || o.items?.length)
      .slice(0, 12)
      .map((o) => {
        const item = o.items?.[0]?.name || 'a miniature';
        return {
          id: o.id,
          text: `${maskName(o.customerName)} just ordered ${item}`,
          city: o.city || '',
        };
      });
  }, [orders]);

  useEffect(() => {
    if (recent.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % recent.length), 4200);
    return () => clearInterval(t);
  }, [recent.length]);

  if (recent.length === 0) return null;

  const current = recent[idx % recent.length];

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-40 flex justify-center sm:bottom-6 sm:justify-start">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + idx}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-ink-900/10 bg-white/95 px-4 py-3 shadow-soft backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">{current.text}</p>
            <p className="text-[11px] text-ink-500">
              Live order{current.city ? ` · ${current.city}` : ''}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
