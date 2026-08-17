import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { motion } from 'framer-motion'

export type Product = {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  image: string
  category: string
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCart((s) => s.addItem)

  const add = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, image: product.image, price: product.price })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="card overflow-hidden hover:shadow-soft transition">
          <div className="relative aspect-square overflow-hidden bg-cream-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {product.compareAtPrice && (
              <span className="absolute left-3 top-3 rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                Sale
              </span>
            )}
            <button
              type="button"
              onClick={add}
              className="absolute bottom-3 right-3 rounded-full bg-white p-2.5 shadow-card opacity-0 group-hover:opacity-100 transition hover:bg-brand-500 hover:text-white"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-xs text-ink-500 uppercase tracking-wide">{product.category}</p>
            <h3 className="mt-1 font-medium text-ink-900 line-clamp-2 group-hover:text-brand-600 transition">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink-500 line-through">₹{product.compareAtPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
