import { useEffect } from 'react';
import { useOrders, type OrderStatus } from '@/store/ordersStore';
import { Cloud, RefreshCw } from 'lucide-react';

const STATUSES: OrderStatus[] = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { orders, loading, error, updateStatus, refresh } = useOrders();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Orders</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5" />
            {loading ? 'Syncing…' : `${orders.length} orders · Firebase (all devices)`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-cream-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {orders.length === 0 && !loading ? (
        <div className="card p-10 text-center text-slate-500">
          No orders in cloud yet. After a successful payment they appear here automatically.
          <br />
          <button type="button" className="mt-3 text-brand-600 font-medium" onClick={() => refresh()}>
            Force refresh
          </button>
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
                      <p className="mt-1 text-xs text-slate-500">
                        {o.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.customerName}</p>
                      <p className="text-xs text-slate-500">{o.customerEmail}</p>
                      <p className="text-xs text-slate-500">{o.customerWhatsapp}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {o.address}, {o.city} {o.pincode}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{o.total}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 break-all max-w-[140px]">
                      {o.paymentId || '—'}
                    </td>
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
