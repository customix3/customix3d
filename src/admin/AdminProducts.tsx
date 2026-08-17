import { DEMO_PRODUCTS } from '@/data/demoProducts'

export default function AdminProducts() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Products</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PRODUCTS.map((p) => (
              <tr key={p.id} className="border-t border-cream-200">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-ink-500">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-ink-500">Full CRUD will connect to Firestore later.</p>
    </div>
  )
}
