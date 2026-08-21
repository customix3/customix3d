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
    toast.success(`${product.name} added`, { duration: 2200, position: 'bottom-center' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-card transition group-hover:shadow-soft">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <motion.img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${out ? 'opacity-50 grayscale' : ''}`}
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

            {out && (
              <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Sold out
              </span>
            )}
            {!out && product.compareAtPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Deal
              </span>
            )}

            {!out && (
              <motion.button
                type="button"
                onClick={add}
                whileTap={{ scale: 0.88 }}
                className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg transition hover:bg-brand-500"
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {pop ? (
                    <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="h-4 w-4 text-mint-400" />
                    </motion.span>
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {inCart && inCart.quantity > 0 && (
              <span className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">
                {inCart.quantity}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-500">{product.category}</p>
            <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-ink-900 group-hover:text-brand-600">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-lg font-bold">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink-500 line-through">₹{product.compareAtPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
