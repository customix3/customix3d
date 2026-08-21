import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Layers } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
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

const CAPTIONS = [
  "This one has main character energy.",
  "Shelf status: upgraded.",
  "Printed with zero regrets.",
  "Your future favourite.",
  "Not for the basic shelf.",
  "Layer-by-layer perfection.",
  "Judged worthy in 0.2s.",
  "Desk called. Wants this.",
];

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const inCart = items.find((i) => i.id === product.id);
  const out = product.active === false || (product.stock != null && product.stock <= 0);
  const [pop, setPop] = useState(false);
  const [hovered, setHovered] = useState(false);

  const caption = useMemo(
    () => CAPTIONS[index % CAPTIONS.length],
    [index]
  );

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
    toast.success(`${product.name} joined the shelf 🔥`, { duration: 2200, position: 'bottom-center' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="perspective-1000"
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white shadow-card transition-all duration-500 group-hover:shadow-soft group-hover:border-brand-500/25">
          <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {[0, 20, 40, 60, 80].map((top) => (
              <div
                key={top}
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent"
                style={{ top: `${top}%` }}
              />
            ))}
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <motion.img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${out ? 'opacity-50 grayscale' : ''}`}
              loading="lazy"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent opacity-70 transition group-hover:opacity-95" />

            <AnimatePresence>
              {hovered && !out && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute inset-x-3 bottom-16 z-20 rounded-2xl border border-white/15 bg-ink-900/85 px-3 py-2 text-center backdrop-blur-md"
                >
                  <p className="text-[11px] font-semibold leading-snug text-white sm:text-xs">
                    {caption}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!out && (
              <motion.span
                className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.03 }}
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
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.12, rotate: [0, -6, 6, 0] }}
                className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg transition hover:bg-brand-500 hover:shadow-glow"
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {pop ? (
                    <motion.span key="ok" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                      <Check className="h-4 w-4 text-mint-400" />
                    </motion.span>
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {inCart && inCart.quantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-3 left-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500 px-2 text-[12px] font-bold text-white shadow-md"
              >
                {inCart.quantity}
              </motion.span>
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
