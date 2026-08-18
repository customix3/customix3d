import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '@/store/productsStore';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useProducts((s) => s.getById(id || ''));
  const products = useProducts((s) => s.products);
  const addItem = useCart((s) => s.addItem);
  const gallery =
    product && (product.images?.length ? product.images : product.image ? [product.image] : []);
  const [active, setActive] = useState(0);

  if (!product || product.active === false) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p>Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  const imgs = gallery || [];
  const main = imgs[Math.min(active, imgs.length - 1)] || product.image;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.active !== false)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <img src={main} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {imgs.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === active ? 'border-brand-500' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-ink-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-ink-600">{product.description}</p>
          <button
            type="button"
            className="btn-primary mt-8"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
              })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
