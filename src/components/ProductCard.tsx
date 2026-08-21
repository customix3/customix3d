import { Link } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  active?: boolean;
  stock?: number;
};

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const inCart = items.find((i) => i.id === product.id);
  const out = product.active === false || (product.stock != null && product.stock <= 0);
  const [pop, setPop] = useState(false);

  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (out) return;
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    setPop(true);
    setTimeout(() => setPop(false), 900);
    toast.success(
      (t) => (
        <span className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>
            <strong>{product.name}</strong> added
            {inCart ? ` · qty ${(inCart.quantity || 0) + 1}` : ''}
          </span>
          <button
            type="button"
            className="ml-1 font-semibold text-brand-600 underline"
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = '/cart';
            }}
          >
            Cart
          </button>
        </span>
      ),
      { duration: 2800, position: 'bottom-center' }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="card overflow-hidden transition hover:shadow-soft">
          <div className="relative aspect-square overflow-hidden bg-cream-100">
            <motion.img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${
                out ? 'opacity-60 grayscale' : ''
              }`}
              loading="lazy"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.45 }}
            />
            {out && (
              <span className="absolute left-3 top-3 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                Out of stock
              </span>
            )}
            {!out && product.compareAtPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                Sale
              </span>
            )}
            {!out && (
              <motion.button
                type="button"
                onClick={add}
                whileTap={{ scale: 0.85 }}
                className="absolute bottom-3 right-3 rounded-full bg-white p-2.5 shadow-card transition hover:bg-brand-500 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {pop ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-4 w-4 text-emerald-600" />
                    </motion.span>
                  ) : (
                    <motion.span key="bag" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <ShoppingBag className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
            {inCart && inCart.quantity > 0 && (
              <span className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white shadow">
                {inCart.quantity}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs uppercase tracking-wide text-ink-500">{product.category}</p>
            <h3 className="mt-1 line-clamp-2 font-medium text-ink-900 transition group-hover:text-brand-600">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink-500 line-through">₹{product.compareAtPrice}</span>
              )}
            </div>
            {product.stock != null && product.stock > 0 && product.stock <= 5 && (
              <p className="mt-1 text-xs text-amber-600">Only {product.stock} left</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
