import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCustomOrders } from '@/store/customOrdersStore';
import { useOrders } from '@/store/ordersStore';

function digits(s: string) {
  return (s || '').replace(/\D/g, '');
}

/** Strict ownership: never show other customers' requests */
function isMyCustom(
  c: { customerId?: string; email?: string; whatsapp: string },
  user: { id: string; email: string; whatsapp: string } | null
) {
  if (!user) return false;

  // 1) Same logged-in user id (best)
  if (c.customerId && user.id && c.customerId === user.id) return true;

  // 2) Exact email match (both non-empty)
  const uEmail = (user.email || '').trim().toLowerCase();
  const cEmail = (c.email || '').trim().toLowerCase();
  if (uEmail && cEmail && uEmail === cEmail) return true;

  // 3) Exact last-10 digits of WhatsApp (both must have at least 10 digits)
  const uPhone = digits(user.whatsapp);
  const cPhone = digits(c.whatsapp);
  if (uPhone.length >= 10 && cPhone.length >= 10) {
    if (uPhone.slice(-10) === cPhone.slice(-10)) return true;
  }

  return false;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const custom = useCustomOrders((s) => s.items);
  const orders = useOrders((s) => s.orders);

  const myCustom = custom.filter((c) => isMyCustom(c, user));

  const myOrders = orders.filter((o) => {
    if (!user) return false;
    const uEmail = (user.email || '').trim().toLowerCase();
    const oEmail = (o.customerEmail || '').trim().toLowerCase();
    if (uEmail && oEmail && uEmail === oEmail) return true;
    const uPhone = digits(user.whatsapp);
    const oPhone = digits(o.customerWhatsapp || '');
    if (uPhone.length >= 10 && oPhone.length >= 10 && uPhone.slice(-10) === oPhone.slice(-10)) {
      return true;
    }
    return false;
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display mb-6 text-3xl font-bold">Account</h1>
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

      <h2 className="font-display mb-4 text-xl font-bold">My custom requests</h2>
      {myCustom.length === 0 ? (
        <div className="card p-6 text-sm text-slate-500">
          No custom requests yet for this account.{' '}
          <Link to="/custom" className="font-medium text-brand-600">
            Submit one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myCustom.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="flex flex-wrap items-start gap-3">
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg border object-cover bg-cream-50"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{c.id}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{c.fileName}</p>
                      {c.notes && <p className="mt-1 text-xs text-slate-500">{c.notes}</p>}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
