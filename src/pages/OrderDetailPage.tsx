import { useParams, Link } from 'react-router-dom';
import { useOrders, type OrderStatus } from '@/store/ordersStore';

const TIMELINE: { key: OrderStatus | string; label: string }[] = [
  { key: 'Paid', label: 'Order placed & paid' },
  { key: 'Processing', label: 'Confirmed · preparing print' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
];

function stepIndex(status: string): number {
  if (status === 'Cancelled') return -1;
  if (status === 'Pending' || status === 'Paid') return 0;
  if (status === 'Processing') return 1;
  if (status === 'Shipped') return 2;
  if (status === 'Delivered') return 3;
  return 0;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const orders = useOrders((s) => s.orders);
  const order = orders.find((o) => o.id === id);
  const current = order ? stepIndex(order.status) : 0;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-2 font-medium">Order not found</p>
        <p className="mb-6 text-sm text-slate-500">
          It may still be syncing from the cloud — refresh in a moment.
        </p>
        <Link to="/orders" className="text-brand-600 font-medium">
          ← My orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/orders" className="mb-4 inline-block text-sm text-brand-600">
        ← Back to orders
      </Link>
      <h1 className="font-display text-2xl font-bold mb-1">{order.id}</h1>
      <p className="text-ink-500 mb-2">
        {new Date(order.createdAt).toLocaleString()} ·{' '}
        <span className="font-medium text-brand-600">{order.status}</span>
      </p>
      {order.paymentId && (
        <p className="mb-8 text-xs text-slate-400">Payment ID: {order.paymentId}</p>
      )}

      <div className="card mb-8 p-6">
        <h2 className="mb-5 font-semibold">Tracking</h2>
        {order.status === 'Cancelled' ? (
          <p className="text-sm text-red-600">This order was cancelled.</p>
        ) : (
          <div className="space-y-0">
            {TIMELINE.map((s, i) => (
              <div key={s.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      i <= current ? 'bg-brand-500' : 'bg-cream-300'
                    }`}
                  />
                  {i < TIMELINE.length - 1 && (
                    <div
                      className={`min-h-[36px] w-0.5 flex-1 ${
                        i < current ? 'bg-brand-500' : 'bg-cream-300'
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`pb-7 text-sm ${
                    i <= current ? 'font-medium text-ink-900' : 'text-ink-500'
                  }`}
                >
                  {s.label}
                  {i === current && (
                    <span className="ml-2 text-xs text-brand-600">· current</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mb-6 p-6">
        <h2 className="mb-3 font-semibold">Items</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id + i.name} className="flex justify-between gap-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span className="font-medium">₹{i.price * i.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-cream-200 pt-3 font-semibold">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <div className="card p-6 text-sm">
        <h2 className="mb-2 font-semibold">Shipping</h2>
        <p>{order.customerName}</p>
        <p className="text-slate-500">{order.customerWhatsapp}</p>
        <p className="mt-2 text-slate-600">
          {order.address}, {order.city} — {order.pincode}
        </p>
      </div>
    </div>
  );
}
