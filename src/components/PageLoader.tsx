import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  "Patience. Good prints take time. Bad ones take longer.",
  "Your shelf called. It wants better roommates.",
  "Mass-produced is for people who fear personality.",
  "Layer by layer. Judgment by judgment.",
  "3D printed. 100% attitude. Zero excuses.",
  "We don't do ordinary. Ordinary is already sold out.",
  "Printed with care. Judged in 0.2 seconds.",
  "Your desk deserves more than factory leftovers.",
  "Filament is temporary. Style is forever.",
  "One of one. Not one of many.",
];

export default function PageLoader({ done }: { done: boolean }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-brand-500/25 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-mint-400/15 blur-[110px]" />

          <div className="relative mb-10 flex flex-col items-center">
            <motion.div
              className="relative z-10"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-3 w-10 rounded-t-md bg-ink-700" />
              <div className="mx-auto h-6 w-6 rounded-b-full bg-gradient-to-b from-ink-600 to-ink-800 shadow-lg" />
              <div className="absolute left-1/2 top-full h-3 w-1 -translate-x-1/2 bg-brand-400" />
            </motion.div>

            <div className="relative mt-1 flex h-28 w-24 flex-col-reverse items-center justify-start gap-[3px] overflow-hidden">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="h-[10px] rounded-sm bg-gradient-to-r from-brand-500 via-brand-400 to-mint-400"
                  style={{ width: `${55 + (i % 3) * 12}%` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.18,
                    repeat: Infinity,
                    repeatDelay: 1.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            <div className="mt-1 h-1.5 w-28 rounded-full bg-ink-700 shadow-inner" />
            <div className="mt-0.5 h-2 w-32 rounded-b-md bg-ink-800" />
          </div>

          <motion.h1
            className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            CUSTO<span className="text-brand-400">MIX</span>
          </motion.h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
            printing your experience
          </p>

          <div className="mt-10 h-14 w-full max-w-md px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                className="text-sm leading-relaxed text-white/70 sm:text-base"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                “{QUOTES[quoteIndex]}”
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-400"
              initial={{ width: '0%' }}
              animate={{ width: done ? '100%' : ['0%', '70%', '85%'] }}
              transition={
                done
                  ? { duration: 0.4 }
                  : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
