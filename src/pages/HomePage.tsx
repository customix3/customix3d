import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES, DEMO_PRODUCTS } from '@/data/demoProducts'

export default function HomePage() {
  const bestsellers = DEMO_PRODUCTS.slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-brand-600 font-medium text-sm tracking-wide uppercase mb-3">Premium 3D Prints</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-ink-900">
              Custom & ready-made prints that stand out
            </h1>
            <p className="mt-4 text-ink-600 text-lg max-w-md">
              Miniatures, home decor, desk gadgets — designed and printed with care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">Shop collection</Link>
              <Link to="/custom" className="btn-secondary">Custom order</Link>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-soft bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80"
                alt="3D printed miniatures"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <p className="p-3 text-center text-sm font-medium">{c.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Bestsellers</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="bg-ink-900 text-white my-16">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Got a design? We will print it.</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Upload STL or OBJ files and get a custom quote. Quality materials, careful finishing.
          </p>
          <Link to="/custom" className="btn-primary bg-white text-ink-900 hover:bg-cream-100">
            Start custom order
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="font-display text-2xl font-bold mb-8">More to explore</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {DEMO_PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
