import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/data/demoProducts';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const count = useCart((s) => s.count());
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/products?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      {/* Top bar — compact on mobile */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-cream-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="font-display text-base font-bold tracking-tight sm:text-xl md:mr-2"
          onClick={() => setOpen(false)}
        >
          CUSTO<span className="text-brand-600">MIX</span>3D
        </Link>

        {/* Desktop search */}
        <form onSubmit={search} className="mx-4 hidden min-w-0 flex-1 max-w-md md:block">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              className="input py-2 pl-10 text-sm"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </form>

        {/* Spacer on mobile so icons stay right */}
        <div className="flex-1 md:hidden" />

        {/* Icons */}
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
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop category strip */}
      <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-5 px-4 pb-3 text-sm font-medium text-ink-700 md:flex lg:gap-7">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="hover:text-brand-600 transition">
            {c.name}
          </Link>
        ))}
        <Link to="/custom" className="text-brand-600 hover:text-brand-700">
          Custom Print
        </Link>
      </nav>

      {/* Mobile category chips — horizontal scroll, no overflow */}
      <div className="border-t border-cream-200/80 md:hidden">
        <div className="flex gap-2 overflow-x-auto px-3 py-2 scrollbar-none">
          <Link
            to="/products"
            className="shrink-0 rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink-700"
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="shrink-0 rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium text-ink-700 whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
          <Link
            to="/custom"
            className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 whitespace-nowrap"
          >
            Custom
          </Link>
        </div>
      </div>

      {/* Mobile full menu drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed left-0 right-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-cream-200 bg-white shadow-lg md:hidden">
            <div className="space-y-1 px-4 py-4">
              <form onSubmit={search} className="mb-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                  <input
                    className="input py-2.5 pl-10 text-sm"
                    placeholder="Search products..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </form>

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
              <div className="my-2 border-t border-cream-200" />
              <Link
                to="/about"
                className="block rounded-xl px-3 py-3 text-sm text-ink-600 hover:bg-cream-100"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block rounded-xl px-3 py-3 text-sm text-ink-600 hover:bg-cream-100"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
              <Link
                to={user ? '/account' : '/login'}
                className="block rounded-xl px-3 py-3 text-sm text-ink-600 hover:bg-cream-100"
                onClick={() => setOpen(false)}
              >
                {user ? 'My account' : 'Sign in'}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
