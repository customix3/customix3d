import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Check, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '@/store/productsStore';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useProducts((s) => s.getById(id || ''));
  const products = useProducts((s) => s.products);
  const addItem = useCart((s) => s.addItem);
  const cartItem = useCart((s) => s.items.find((i) => i.id === id));
  const gallery =
    product && (product.images?.length ? product.images : product.image ? [product.image] : []);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

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

  const out = product.stock != null && product.stock <= 0;
  const imgs = gallery || [];
  const main = imgs[Math.min(active, imgs.length - 1)] || product.image;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.active !== false)
    .slice(0, 4);

  const add = () => {
    if (out) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    toast.success(`${product.name} × ${qty} added to cart`, {
      duration: 2500,
      position: 'bottom-center',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <motion.img
              key={main}
              src={main}
              alt={product.name}
              className="h-full w-full object-cover"
              initial={{ opacity: 0.6, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            />
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <p className="text-sm uppercase tracking-wide text-ink-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-ink-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-ink-600">{product.description}</p>

          {!out && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-slate-200 bg-white">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-100"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-100"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                type="button"
                className="btn-primary inline-flex min-w-[10rem] items-center justify-center gap-2"
                onClick={add}
                whileTap={{ scale: 0.96 }}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Add to cart
                  </>
                )}
              </motion.button>
            </div>
          )}

          {out && (
            <p className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
              Out of stock
            </p>
          )}

          {cartItem && (
            <p className="mt-3 text-sm text-brand-600">
              In cart: <strong>{cartItem.quantity}</strong> ·{' '}
              <Link to="/cart" className="underline">
                View cart
              </Link>
            </p>
          )}
        </motion.div>
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
