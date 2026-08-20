import { useEffect, useMemo, useState } from 'react';
import { Cloud, RefreshCw, Trash2 } from 'lucide-react';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';
import { subscribeUsers, type FsUser } from '@/services/firestoreAdmin';
import { deleteAllUsers } from '@/services/deleteUsers';

type Row = {
  key: string;
  name: string;
  email: string;
  whatsapp: string;
  orders: number;
  custom: number;
  spent: number;
  lastSeen: string;
  source: string;
};

export default function AdminCustomers() {
  const orders = useOrders((s) => s.orders);
  const refreshOrders = useOrders((s) => s.refresh);
  const custom = useCustomOrders((s) => s.items);
  const refreshCustom = useCustomOrders((s) => s.refresh);
  const [users, setUsers] = useState<FsUser[]>([]);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    refreshOrders();
    refreshCustom();
    return subscribeUsers(setUsers);
  }, [refreshOrders, refreshCustom]);

  const wipeUsers = async () => {
    if (
      !confirm(
        'Delete ALL registered users from Firebase?\n\nCustomers must sign up again with WhatsApp.\nOrders/custom requests are NOT deleted.'
      )
    )
      return;
    if (!confirm('Sure? This cannot be undone.')) return;
    setWiping(true);
    try {
      const n = await deleteAllUsers();
      alert(`Deleted ${n} user(s). Ask everyone to sign up fresh.`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setWiping(false);
    }
  };

  const rows = useMemo(() => {
    const map = new Map<string, Row>();

    for (const u of users) {
      const key = (u.email || u.whatsapp || u.id).toLowerCase();
      map.set(key, {
        key,
        name: u.name || 'User',
        email: u.email || '',
        whatsapp: u.whatsapp || '',
        orders: 0,
        custom: 0,
        spent: 0,
        lastSeen: u.createdAt,
        source: 'registered',
      });
    }

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
          source: 'order',
        });
      } else {
        prev.orders += 1;
        prev.spent += o.total || 0;
        if (o.createdAt > prev.lastSeen) prev.lastSeen = o.createdAt;
        if (!prev.name || prev.name === 'User') prev.name = o.customerName || prev.name;
        if (!prev.whatsapp) prev.whatsapp = o.customerWhatsapp || '';
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
          source: 'custom',
        });
      } else {
        prev.custom += 1;
        if (c.createdAt > prev.lastSeen) prev.lastSeen = c.createdAt;
        if (!prev.whatsapp) prev.whatsapp = c.whatsapp;
        if (!prev.email && c.email) prev.email = c.email;
      }
    }

    return Array.from(map.values()).sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : -1));
  }, [orders, custom, users]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display mb-1 text-2xl font-bold">Customers</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <Cloud className="h-3.5 w-3.5" />
            {users.length} registered · {rows.length} total rows
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              refreshOrders();
              refreshCustom();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            type="button"
            disabled={wiping}
            onClick={() => void wipeUsers()}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {wiping ? 'Deleting…' : 'Delete all users'}
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          No customers yet. Signup with WhatsApp will appear here.
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
