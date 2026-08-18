import { Link } from 'react-router-dom';
import { useOrders } from '@/store/ordersStore';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  const mine = orders.filter(
    (o) =>
      !user ||
      o.customerEmail?.toLowerCase() === user.email?.toLowerCase() ||
      (user.whatsapp && o.customerWhatsapp?.includes(user.whatsapp.replace(/\D/g, '').slice(-10)))
  );

  // Show all if filter empty (local demo accounts)
  const list = mine.length ? mine : orders;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      {loading && <p className="text-slate-500">Loading…</p>}
      {!loading && list.length === 0 && (
        <div className="card p-10 text-center text-slate-500">
          <p className="mb-4">No orders yet.</p>
          <Link to="/products" className="text-brand-600 font-medium">
            Shop now
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {list.map((o) => (
          <Link
            key={o.id}
            to={`/orders/${o.id}`}
            className="card flex items-center justify-between p-5 transition hover:shadow-soft"
          >
            <div>
              <p className="font-medium">{o.id}</p>
              <p className="text-sm text-ink-500">
                {new Date(o.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {o.items.map((i) => i.name).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{o.total}</p>
              <p className="text-sm text-brand-600">{o.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
