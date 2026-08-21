import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Layers } from 'lucide-react';
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
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="perspective-1000"
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white shadow-card transition-all duration-500 group-hover:shadow-soft group-hover:border-brand-500/20">
          <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
            <div className="absolute inset-x-0 top-[20%] h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />
            <div className="absolute inset-x-0 top-[40%] h-px bg-gradient-to-r from-transparent via-mint-400/20 to-transparent" />
            <div className="absolute inset-x-0 top-[60%] h-px bg-gradient-to-r from-transparent via-brand-400/15 to-transparent" />
            <div className="absolute inset-x-0 top-[80%] h-px bg-gradient-to-r from-transparent via-mint-400/15 to-transparent" />
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <motion.img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${out ? 'opacity-50 grayscale' : ''}`}
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-60 transition group-hover:opacity-90" />

            {!out && (
              <motion.span
                className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-ink-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.04 }}
              >
                <Layers className="h-3 w-3 text-brand-400" />
                Fresh print
              </motion.span>
            )}

            {out && (
              <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Sold out
              </span>
            )}
            {!out && product.compareAtPrice && (
              <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-glow">
                Deal
              </span>
            )}

            {!out && (
              <motion.button
                type="button"
                onClick={add}
                whileTap={{ scale: 0.86 }}
                whileHover={{ scale: 1.08 }}
                className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg transition hover:bg-brand-500 hover:shadow-glow"
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
              <span className="absolute bottom-3 left-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500 px-2 text-[12px] font-bold text-white shadow-md">
                {inCart.quantity}
              </span>
            )}
          </div>

          <div className="relative p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">{product.category}</p>
            <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-ink-900 transition group-hover:text-brand-600">
              {product.name}
            </h3>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-lg font-bold tracking-tight">₹{product.price}</span>
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
