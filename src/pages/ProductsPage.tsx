import { useMemo, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/store/productsStore';
import { searchProducts, isWeakMatch } from '@/utils/searchProducts';

export default function ProductsPage() {
  const all = useProducts((s) => s.products);
  const [params, setParams] = useSearchParams();
  const urlQ = params.get('q') || '';
  const [q, setQ] = useState(urlQ);

  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  const results = useMemo(() => {
    const active = all.filter((p) => p.active !== false);
    if (!q.trim()) return active.map((p) => ({ ...p, score: 0 }));
    return searchProducts(all, q);
  }, [q, all]);

  const weak = q.trim() ? isWeakMatch(results) : false;
  const showCustom = q.trim().length > 0 && (results.length === 0 || weak);

  const onSearchChange = (value: string) => {
    setQ(value);
    if (value.trim()) setParams({ q: value.trim() });
    else setParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {q.trim() ? 'Search results' : 'All Products'}
          </h1>
          {q.trim() && (
            <p className="mt-1 text-sm text-slate-500">
              Search recommendations for “{q.trim()}” · {results.length} product
              {results.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <input
          className="input max-w-xs"
          placeholder="Search products…"
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {q.trim() && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Search recommendations
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Custom order always last when no / weak match */}
      {showCustom && (
        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center sm:p-8">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-600" />
          <h2 className="font-display text-xl font-bold text-brand-900">
            No strong match for “{q.trim()}”
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-800/80">
            We may not stock that exact item — request a custom 3D print and we’ll quote you.
          </p>
          <Link
            to={`/custom?hint=${encodeURIComponent(q.trim())}`}
            className="mt-5 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            Do a custom order
          </Link>
        </div>
      )}

      {!q.trim() && results.length === 0 && (
        <p className="py-16 text-center text-slate-500">No products yet.</p>
      )}
    </div>
  );
}
