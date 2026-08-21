import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/data/demoProducts';
import SearchBox from '@/components/SearchBox';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.count());
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/5 bg-cream-50/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-ink-900/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          to="/"
          className="font-display text-lg font-extrabold tracking-tight sm:text-xl"
          onClick={() => setOpen(false)}
        >
          CUSTO<span className="text-brand-500">MIX</span>
          <span className="ml-0.5 align-super text-[10px] font-bold text-ink-500">3D</span>
        </Link>

        <SearchBox className="mx-4 hidden min-w-0 flex-1 max-w-md md:block" />

        <div className="flex-1 md:hidden" />

        <div className="flex shrink-0 items-center gap-0.5">
          <Link
            to={user ? '/account' : '/login'}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-900/5"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-900/5"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white"
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-6 px-4 pb-3 text-sm font-semibold text-ink-600 md:flex">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="transition hover:text-brand-500">
            {c.name}
          </Link>
        ))}
        <Link to="/custom" className="text-brand-500">
          Custom
        </Link>
      </nav>

      <div className="border-t border-ink-900/5 md:hidden">
        <div className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none">
          <Link to="/products" className="chip shrink-0">
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="chip shrink-0 whitespace-nowrap">
              {c.name}
            </Link>
          ))}
          <Link to="/custom" className="chip shrink-0 border-brand-200 bg-brand-50 text-brand-700">
            Custom
          </Link>
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 top-14 z-40 bg-ink-900/40 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed left-0 right-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-ink-900/5 bg-cream-50 shadow-soft md:hidden">
            <div className="space-y-1 px-4 py-4">
              <SearchBox className="mb-3" onNavigate={() => setOpen(false)} />
              <Link to="/products" className="block rounded-2xl px-3 py-3 text-sm font-semibold" onClick={() => setOpen(false)}>
                All Products
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className="block rounded-2xl px-3 py-3 text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
              <Link
                to="/custom"
                className="block rounded-2xl px-3 py-3 text-sm font-semibold text-brand-500"
                onClick={() => setOpen(false)}
              >
                Custom
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
