import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribePromoPopup, type PromoPopup as Promo } from '@/services/firestoreAdmin';

const DISMISS_KEY = 'cmx_promo_dismissed';

export default function PromoPopup() {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return subscribePromoPopup((p) => {
      setPromo(p);
      if (!p.enabled) {
        setOpen(false);
        return;
      }
      try {
        if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
      } catch {
        /* ignore */
      }
      // slight delay so page loads first
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    });
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!promo?.enabled) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Circular spinning ring + card */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative z-10 w-full max-w-sm"
          >
            {/* Orbiting dots */}
            <div className="pointer-events-none absolute -inset-6 flex items-center justify-center">
              <motion.div
                className="h-full w-full rounded-full border-2 border-dashed border-brand-400/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute h-3 w-3 rounded-full bg-brand-500 shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ offsetPath: 'circle(48%)' } as React.CSSProperties}
              />
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {promo.imageUrl ? (
                <div className="relative aspect-[4/3] bg-cream-100">
                  <img src={promo.imageUrl} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700">
                  <motion.div
                    className="h-24 w-24 rounded-full border-4 border-white/40"
                    animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity },
                    }}
                  />
                </div>
              )}

              <div className="p-5 text-center">
                <h3 className="font-display text-xl font-bold text-ink-900">{promo.title}</h3>
                {promo.subtitle && (
                  <p className="mt-2 text-sm text-slate-600">{promo.subtitle}</p>
                )}
                <Link
                  to={promo.link || '/products'}
                  onClick={close}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-3 text-sm font-semibold text-white"
                >
                  Shop now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
