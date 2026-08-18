import { useEffect, useMemo } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';

type Row = {
  key: string;
  name: string;
  email: string;
  whatsapp: string;
  orders: number;
  custom: number;
  spent: number;
  lastSeen: string;
};

export default function AdminCustomers() {
  const orders = useOrders((s) => s.orders);
  const refreshOrders = useOrders((s) => s.refresh);
  const custom = useCustomOrders((s) => s.items);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const rows = useMemo(() => {
    const map = new Map<string, Row>();

    for (const o of orders) {
      const key = (o.customerEmail || o.customerWhatsapp || o.customerName || o.id).toLowerCase();
      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          key,
          name: o.customerName || 'Customer',
          email: o.customerEmail || '',
          whatsapp: o.customerWhatsapp || '',
          orders: 1,
          custom: 0,
          spent: o.total || 0,
          lastSeen: o.createdAt,
        });
      } else {
        prev.orders += 1;
        prev.spent += o.total || 0;
        if (o.createdAt > prev.lastSeen) prev.lastSeen = o.createdAt;
      }
    }

    for (const c of custom) {
      const key = (c.email || c.whatsapp || c.name || c.id).toLowerCase();
      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          key,
          name: c.name,
          email: c.email || '',
          whatsapp: c.whatsapp,
          orders: 0,
          custom: 1,
          spent: 0,
          lastSeen: c.createdAt,
        });
      } else {
        prev.custom += 1;
        if (c.createdAt > prev.lastSeen) prev.lastSeen = c.createdAt;
        if (!prev.whatsapp) prev.whatsapp = c.whatsapp;
        if (!prev.email && c.email) prev.email = c.email;
      }
    }

    return Array.from(map.values()).sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1));
  }, [orders, custom]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Customers</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5" />
            {rows.length} from paid orders + custom requests
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshOrders()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No customers yet. Anyone who completes checkout or submits a custom request will show here.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">Custom</th>
                  <th className="px-4 py-3 font-medium">Spent</th>
                  <th className="px-4 py-3 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-t border-cream-200">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-500">{r.email || '—'}</p>
                      <p className="text-xs text-slate-500">{r.whatsapp || '—'}</p>
                    </td>
                    <td className="px-4 py-3">{r.orders}</td>
                    <td className="px-4 py-3">{r.custom}</td>
                    <td className="px-4 py-3">₹{r.spent}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(r.lastSeen).toLocaleString()}
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
