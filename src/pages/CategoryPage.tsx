import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/demoProducts';
import { useProducts } from '@/store/productsStore';

export default function CategoryPage() {
  const { category } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === category);
  const isNameIt = category === 'name-it';

  const products = useProducts((s) => s.products).filter((p) => {
    if (p.active === false) return false;
    if (isNameIt) return p.personalizable === true || p.category === 'name-it';
    if (p.personalizable) return false;
    return p.category === category;
  });

  if (isNameIt) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="mb-4 text-sm text-slate-500">
          This is the <strong>Name it</strong> category — personalizable prints only.
        </p>
        <Link
          to="/name-it"
          className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Open Name it shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display mb-2 text-3xl font-bold">{cat?.name || category}</h1>
      <p className="mb-8 text-slate-500">{products.length} products</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-16 text-center">
          <p className="mb-4 text-slate-500">No products in this category yet.</p>
          <Link to="/products" className="font-medium text-brand-600">
            Browse all
          </Link>
        </div>
      )}
    </div>
  );
}
