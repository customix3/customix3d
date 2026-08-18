import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/demoProducts';
import { useProducts } from '@/store/productsStore';

export default function CategoryPage() {
  const { category } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === category);
  const products = useProducts((s) => s.products).filter(
    (p) => p.category === category && p.active !== false
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">{cat?.name || category}</h1>
      <p className="text-slate-500 mb-8">{products.length} products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">No products in this category yet.</p>
          <Link to="/products" className="text-brand-600 font-medium">Browse all</Link>
        </div>
      )}
    </div>
  );
}
