import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/demoProducts';
import { useProducts } from '@/store/productsStore';
import { subscribeHomepage, DEFAULT_HOME, type HomepageCms } from '@/services/homepageCms';

export default function HomePage() {
  const products = useProducts((s) => s.products).filter((p) => p.active !== false);
  const bestsellers = products.slice(0, 4);
  const [cms, setCms] = useState<HomepageCms>(DEFAULT_HOME);

  useEffect(() => subscribeHomepage(setCms), []);

  return (
    <div className="overflow-x-hidden">
      <section className="relative isolate min-h-[88vh] overflow-hidden grain">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-mint-400/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pt-20">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip mb-5 inline-flex gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              {cms.badge}
            </span>
            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {cms.headline1}
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-brand-400 to-mint-500 bg-clip-text text-transparent">
                {cms.headline2}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-600 sm:text-lg">{cms.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products" className="btn-primary">
                {cms.ctaPrimary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/custom" className="btn-secondary">
                {cms.ctaSecondary}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-ink-500">
              <div>
                <p className="font-display text-2xl font-bold text-ink-900">{products.length}+</p>
                <p>pieces live</p>
              </div>
              <div className="h-10 w-px bg-ink-900/10" />
              <div>
                <p className="font-display text-2xl font-bold text-ink-900">Hand</p>
                <p>finished detail</p>
              </div>
              <div className="h-10 w-px bg-ink-900/10" />
              <div>
                <p className="font-display text-2xl font-bold text-ink-900">WA</p>
                <p>custom quotes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative md:col-span-5"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-400/30 via-transparent to-mint-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-900/5 bg-ink-900 shadow-soft">
              <img
                src={cms.heroImage}
                alt="Miniature"
                className="aspect-[4/5] w-full object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
              <motion.div
                className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Shelf drop</p>
                <p className="mt-1 font-display text-lg font-bold text-white">New miniatures weekly</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Worlds</p>
          <h2 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Pick a shelf</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {CATEGORIES.map((c, i) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="group">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-3xl border border-ink-900/5 bg-ink-900"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
                </div>
                <p className="absolute bottom-0 left-0 right-0 p-3 font-display text-sm font-bold text-white sm:p-4 sm:text-base">
                  {c.name}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Heat</p>
            <h2 className="font-display mt-1 text-3xl font-bold tracking-tight">Shelf favourites</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-ink-600 hover:text-brand-600">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="relative my-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-mint-400/20 blur-3xl" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-300">One of one</p>
            <h2 className="font-display mx-auto mt-3 max-w-xl text-3xl font-extrabold text-white sm:text-5xl">
              {cms.customTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/60 sm:text-base">{cms.customSubtitle}</p>
            <Link
              to="/custom"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink-900 transition hover:bg-brand-400 hover:text-white"
            >
              Start a custom piece
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Full shelf</p>
          <h2 className="font-display mt-1 text-3xl font-bold tracking-tight">Everything live</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
