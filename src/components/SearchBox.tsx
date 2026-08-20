import { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useProducts } from '@/store/productsStore';
import { searchProducts, isWeakMatch } from '@/utils/searchProducts';

type Props = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onNavigate?: () => void;
};

export default function SearchBox({
  className = '',
  inputClassName = '',
  placeholder = 'Search products…',
  onNavigate,
}: Props) {
  const products = useProducts((s) => s.products);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchProducts(products, q).slice(0, 8), [products, q]);
  const weak = isWeakMatch(results);
  const showPanel = open && q.trim().length > 0;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const goSearchPage = () => {
    if (!q.trim()) return;
    navigate(`/products?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goSearchPage();
        }}
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            className={`input w-full py-2 pl-10 text-sm ${inputClassName}`}
            placeholder={placeholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
        </div>
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Search recommendations
          </p>

          {results.length > 0 && !weak && (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.id}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-cream-50"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg object-cover bg-cream-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900">{p.name}</p>
                      <p className="text-xs text-slate-500">
                        ₹{p.price} · {p.category}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && weak && (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.id}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-cream-50 opacity-80"
                  >
                    <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <p className="truncate text-sm">{p.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-500">No product matched “{q.trim()}”</p>
          )}

          {/* Always last: custom order CTA */}
          <div className="mt-1 border-t border-slate-100 px-2 pt-2">
            <Link
              to={`/custom?hint=${encodeURIComponent(q.trim())}`}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-3 text-sm hover:bg-brand-100"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <div>
                <p className="font-semibold text-brand-800">Can't find it? Custom order</p>
                <p className="mt-0.5 text-xs text-brand-700/80">
                  Tell us what you searched — we’ll quote a custom 3D print
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={goSearchPage}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 hover:bg-cream-50"
            >
              See all results for “{q.trim()}” →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
