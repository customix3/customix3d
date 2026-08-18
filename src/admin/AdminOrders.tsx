import { useOrders, type OrderStatus } from '@/store/ordersStore';
import { Cloud } from 'lucide-react';

const STATUSES: OrderStatus[] = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { orders, loading, updateStatus } = useOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Orders</h1>
      <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
        <Cloud className="h-3.5 w-3.5" />
        {loading ? 'Syncing…' : `${orders.length} orders · Firebase`}
      </p>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No orders yet. Orders appear here after successful Razorpay checkout on any device.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-cream-200 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.id}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.customerName}</p>
                      <p className="text-xs text-slate-500">{o.customerEmail}</p>
                      <p className="text-xs text-slate-500">{o.customerWhatsapp}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {o.address}, {o.city} {o.pincode}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{o.total}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{o.paymentId || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        value={o.status}
                        onChange={(e) => void updateStatus(o.id, e.target.value as OrderStatus)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
