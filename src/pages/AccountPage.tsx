import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCustomOrders } from '@/store/customOrdersStore';
import { useOrders } from '@/store/ordersStore';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const custom = useCustomOrders((s) => s.items);
  const orders = useOrders((s) => s.orders);

  const myCustom = custom.filter(
    (c) =>
      (user?.email && c.email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.whatsapp && c.whatsapp && c.whatsapp.includes(user.whatsapp.replace(/\D/g, '').slice(-10)))
  );

  const myOrders = orders.filter(
    (o) => user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-6">Account</h1>
      <div className="card mb-8 space-y-3 p-6">
        <p>
          <span className="text-ink-500">Name:</span> {user?.name}
        </p>
        <p>
          <span className="text-ink-500">Email:</span> {user?.email}
        </p>
        <p>
          <span className="text-ink-500">WhatsApp:</span> {user?.whatsapp || '—'}
        </p>
        <div className="flex gap-3 pt-4">
          <Link to="/orders" className="btn-secondary">
            My orders ({myOrders.length})
          </Link>
          <button type="button" className="btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold mb-4">My custom requests</h2>
      {myCustom.length === 0 ? (
        <div className="card p-6 text-sm text-slate-500">
          No custom requests yet.{' '}
          <Link to="/custom" className="text-brand-600 font-medium">
            Submit one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myCustom.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{c.id}</p>
                  <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-600">{c.fileName}</p>
                  {c.notes && <p className="text-xs text-slate-500 mt-1">{c.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {c.status}
                  </span>
                  {c.quote != null && (
                    <p className="mt-2 text-sm font-semibold">Quote: ₹{c.quote}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
