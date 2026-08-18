import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/demoProducts';
import { useProducts } from '@/store/productsStore';

export default function HomePage() {
  const products = useProducts((s) => s.products).filter((p) => p.active !== false);
  const bestsellers = products.slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      <section className="relative bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-12 sm:py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-600 sm:mb-3 sm:text-sm">
              Premium 3D Prints
            </p>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 sm:text-4xl md:text-5xl">
              Custom & ready-made prints that stand out
            </h1>
            <p className="mt-3 max-w-md text-base text-ink-600 sm:mt-4 sm:text-lg">
              Miniatures, home decor, desk gadgets — designed and printed with care.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link to="/products" className="btn-primary">
                Shop collection
              </Link>
              <Link to="/custom" className="btn-secondary">
                Custom order
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="relative mx-auto w-full max-w-md md:max-w-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-cream-200 shadow-soft sm:rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80"
                alt="3D printed miniatures"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <h2 className="mb-6 text-center font-display text-xl font-bold sm:mb-8 sm:text-2xl">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="group">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="p-2 text-center text-xs font-medium sm:p-3 sm:text-sm">{c.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Bestsellers</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="my-10 bg-ink-900 text-white sm:my-16">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:py-16">
          <h2 className="mb-3 font-display text-2xl font-bold sm:mb-4 sm:text-3xl">
            Got a design? We will print it.
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-white/70 sm:mb-8 sm:text-base">
            Upload STL or OBJ files and get a custom quote. Quality materials, careful finishing.
          </p>
          <Link to="/custom" className="btn-primary bg-white text-ink-900 hover:bg-cream-100">
            Start custom order
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:pb-20">
        <h2 className="mb-6 font-display text-xl font-bold sm:mb-8 sm:text-2xl">More to explore</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
