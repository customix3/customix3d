import { useParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES, DEMO_PRODUCTS } from '@/data/demoProducts'

export default function CategoryPage() {
  const { category } = useParams()
  const cat = CATEGORIES.find((c) => c.slug === category)
  const products = DEMO_PRODUCTS.filter((p) => p.category === category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">{cat?.name || category}</h1>
      <p className="text-ink-500 mb-8">{products.length} products</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-ink-500 py-12">No products in this category yet.</p>
      )}
    </div>
  )
}
