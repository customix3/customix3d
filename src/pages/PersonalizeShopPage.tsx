import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Type, Sparkles } from 'lucide-react';
import { useProducts } from '@/store/productsStore';

/** Dedicated browse page for name/text personalizable 3D products. */
export default function PersonalizeShopPage() {
  const products = useProducts((s) => s.products).filter(
    (p) => p.active !== false && p.personalizable === true
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10 overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-12 text-center sm:px-12">
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-300">
            <Type className="h-3.5 w-3.5" />
            Name it
          </span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
          Your name. Your print.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/60 sm:text-base">
          Pick a piece, type any name or text, see a live preview — then we print it for you.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-brand-500" />
          <p className="text-slate-600">No personalizable products yet.</p>
          <p className="mt-1 text-sm text-slate-400">
            Admin: mark a product as Name / text personalizable.
          </p>
          <Link to="/products" className="mt-6 inline-block text-sm font-semibold text-brand-600">
            Browse regular products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/personalize/${p.id}`}
                className="group block overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-mint-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-900">
                    Name it
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="font-display text-lg font-bold">{p.name}</h2>
                    <p className="mt-0.5 text-sm text-white/80">₹{p.price}</p>
                    <p className="mt-2 text-xs font-semibold text-brand-300">
                      Customize with live preview →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
