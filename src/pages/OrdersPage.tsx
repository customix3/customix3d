import { Link } from 'react-router-dom'

const DEMO_ORDERS = [
  { id: 'ORD-1001', date: '2026-08-10', total: 1299, status: 'Shipped' },
  { id: 'ORD-1002', date: '2026-08-14', total: 499, status: 'Processing' },
]

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {DEMO_ORDERS.map((o) => (
          <Link
            key={o.id}
            to={`/orders/${o.id}`}
            className="card p-5 flex items-center justify-between hover:shadow-soft transition"
          >
            <div>
              <p className="font-medium">{o.id}</p>
              <p className="text-sm text-ink-500">{o.date}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{o.total}</p>
              <p className="text-sm text-brand-600">{o.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
