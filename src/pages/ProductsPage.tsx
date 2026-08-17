import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { DEMO_PRODUCTS } from '@/data/demoProducts'

export default function ProductsPage() {
  const [q, setQ] = useState('')
  const products = useMemo(() => {
    if (!q.trim()) return DEMO_PRODUCTS
    const s = q.toLowerCase()
    return DEMO_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    )
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold">All Products</h1>
        <input
          className="input max-w-xs"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
