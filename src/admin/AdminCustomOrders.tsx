import { useState } from 'react';
import { Cloud } from 'lucide-react';
import { useCustomOrders, type CustomOrderStatus } from '@/store/customOrdersStore';

const STATUSES: CustomOrderStatus[] = [
  'New',
  'Quoted',
  'Accepted',
  'Printing',
  'Shipped',
  'Done',
  'Rejected',
];

export default function AdminCustomOrders() {
  const { items, loading, setStatus } = useCustomOrders();
  const [quoteDraft, setQuoteDraft] = useState<Record<string, string>>({});

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Custom Orders</h1>
      <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
        <Cloud className="h-3.5 w-3.5" />
        {loading ? 'Syncing…' : `${items.length} requests · Firebase`}
      </p>

      {items.length === 0 && !loading ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium text-slate-700 mb-1">No custom orders yet</p>
          <p className="text-sm">
            When a customer submits <strong>/custom</strong>, it will appear here on every device.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Request</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">File / Notes</th>
                  <th className="px-4 py-3 font-medium">Quote ₹</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id} className="border-t border-cream-200 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.id}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{o.name}</p>
                      <p className="text-xs text-slate-500">{o.whatsapp}</p>
                      {o.email && <p className="text-xs text-slate-400">{o.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{o.fileName || '—'}</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">{o.notes || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                          placeholder={o.quote != null ? String(o.quote) : '0'}
                          value={quoteDraft[o.id] ?? (o.quote != null ? String(o.quote) : '')}
                          onChange={(e) =>
                            setQuoteDraft((d) => ({ ...d, [o.id]: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="text-xs font-medium text-sky-600 px-1"
                          onClick={() => {
                            const q = Number(quoteDraft[o.id] ?? o.quote ?? 0);
                            void setStatus(o.id, o.status === 'New' ? 'Quoted' : o.status, q);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        value={o.status}
                        onChange={(e) =>
                          void setStatus(o.id, e.target.value as CustomOrderStatus)
                        }
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
