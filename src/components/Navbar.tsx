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
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-cream-50/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-cream-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          to="/"
          className="font-display text-base font-bold tracking-tight sm:text-xl md:mr-2"
          onClick={() => setOpen(false)}
        >
          CUSTO<span className="text-brand-600">MIX</span>3D
        </Link>

        <SearchBox className="mx-4 hidden min-w-0 flex-1 max-w-md md:block" />

        <div className="flex-1 md:hidden" />

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            to={user ? '/account' : '/login'}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-200"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-200"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white"
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-5 px-4 pb-3 text-sm font-medium text-ink-700 md:flex lg:gap-7">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="transition hover:text-brand-600">
            {c.name}
          </Link>
        ))}
        <Link to="/custom" className="text-brand-600 hover:text-brand-700">
          Custom Print
        </Link>
      </nav>

      <div className="border-t border-cream-200/80 md:hidden">
        <div className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none">
          <Link to="/products" className="shrink-0 rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium">
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="shrink-0 whitespace-nowrap rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium"
            >
              {c.name}
            </Link>
          ))}
          <Link
            to="/custom"
            className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
          >
            Custom
          </Link>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-cream-200 bg-white shadow-lg md:hidden">
            <div className="space-y-1 px-4 py-4">
              <SearchBox className="mb-3" onNavigate={() => setOpen(false)} />
              <Link
                to="/products"
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-cream-100"
                onClick={() => setOpen(false)}
              >
                All Products
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-cream-100"
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
              <Link
                to="/custom"
                className="block rounded-xl px-3 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                Custom Print
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
