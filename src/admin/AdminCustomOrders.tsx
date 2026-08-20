import { useEffect, useState } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
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
  const { items, loading, error, setStatus, refresh } = useCustomOrders();
  const [quoteDraft, setQuoteDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveQuote = async (id: string, currentStatus: CustomOrderStatus) => {
    const q = Number(quoteDraft[id] ?? 0);
    setSavingId(id);
    setMsg('');
    try {
      await setStatus(id, currentStatus === 'New' ? 'Quoted' : currentStatus, q);
      setMsg('Saved');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">Custom Orders</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5" />
            {loading ? 'Syncing…' : `${items.length} requests · Firebase`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refresh()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {msg && <p className="mb-4 text-sm text-emerald-600">{msg}</p>}

      {items.length === 0 && !loading ? (
        <div className="card p-10 text-center text-slate-500">
          <p className="font-medium text-slate-700 mb-1">No custom orders yet</p>
          <p className="text-sm">When a customer submits /custom, it appears here on every device.</p>
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
                      <p className="mt-1 max-w-xs text-xs text-slate-500">{o.notes || '—'}</p>
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
                          disabled={savingId === o.id}
                          className="px-1 text-xs font-medium text-sky-600 disabled:opacity-50"
                          onClick={() => void saveQuote(o.id, o.status)}
                        >
                          {savingId === o.id ? '…' : 'Save'}
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
