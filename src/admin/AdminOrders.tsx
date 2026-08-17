export default function AdminOrders() {
  const orders = [
    { id: 'ORD-1001', customer: 'Demo User', total: 1299, status: 'Shipped' },
    { id: 'ORD-1002', customer: 'Demo User', total: 499, status: 'Processing' },
  ]
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-cream-200">
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3">₹{o.total}</td>
                <td className="px-4 py-3 text-brand-600">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
