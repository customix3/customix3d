import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/store/productsStore';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useProducts((s) => s.getById(id || ''));
  const products = useProducts((s) => s.products);
  const addItem = useCart((s) => s.addItem);

  if (!product || product.active === false) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <p>Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-flex">Back to shop</Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.active !== false)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-ink-500 uppercase tracking-wide">{product.category}</p>
          <h1 className="font-display text-3xl font-bold mt-2">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-ink-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <p className="mt-6 text-ink-600 leading-relaxed">{product.description}</p>
          <button
            type="button"
            className="btn-primary mt-8"
            onClick={() =>
              addItem({ id: product.id, name: product.name, image: product.image, price: product.price })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
