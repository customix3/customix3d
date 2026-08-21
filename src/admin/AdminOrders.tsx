import { useEffect } from 'react';
import { useOrders, type OrderStatus } from '@/store/ordersStore';
import { Cloud, RefreshCw, MessageCircle, Copy, CheckCircle2 } from 'lucide-react';
import { waChatUrl, shippedMessage, refundMessage } from '@/utils/whatsapp';

const STATUSES: OrderStatus[] = [
  'Pending',
  'Paid',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
];

/** Only these statuses open WhatsApp to the CUSTOMER number from the order */
const WA_ON: OrderStatus[] = ['Shipped', 'Cancelled', 'Refunded'];

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

export default function AdminOrders() {
  const { orders, loading, error, updateStatus, refresh } = useOrders();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onStatus = async (o: (typeof orders)[0], status: OrderStatus) => {
    await updateStatus(o.id, status);

    if (!WA_ON.includes(status)) return;
    if (!o.customerWhatsapp?.trim()) {
      alert('No customer WhatsApp on this order — cannot open chat.');
      return;
    }

    const phone = o.customerWhatsapp;
    let text = `Hi ${o.customerName}, regarding CustoMix3D order ${o.id}`;
    if (status === 'Shipped') text = shippedMessage(o.id, o.customerName);
    if (status === 'Cancelled' || status === 'Refunded') {
      text = refundMessage(o.id, o.customerName, o.total);
    }
    window.open(waChatUrl(phone, text), '_blank', 'noopener');
  };

  // Pending first so UPI payments are easy to find
  const sorted = [...orders].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (b.status === 'Pending' && a.status !== 'Pending') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display mb-1 text-2xl font-bold">Orders</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <Cloud className="h-3.5 w-3.5" />
            {loading ? 'Syncing…' : `${orders.length} orders`}
            {orders.filter((o) => o.status === 'Pending').length > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                {orders.filter((o) => o.status === 'Pending').length} pending UPI
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Pending = waiting for UPI confirmation. Match UTR in your UPI app, then mark Paid.
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

      {orders.length === 0 && !loading ? (
        <div className="card p-10 text-center text-slate-500">No orders yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">UTR / Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((o) => {
                  const isPending = o.status === 'Pending';
                  const isUpi = isPending || (o.paymentId && !String(o.paymentId).startsWith('pay_'));
                  return (
                    <tr
                      key={o.id}
                      className={isPending ? 'bg-amber-50/60' : 'hover:bg-cream-50/50'}
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold">{o.id}</p>
                        <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {o.items?.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                        </p>
                        {(o.status === 'Cancelled' || o.status === 'Refunded') && (
                          <p className="mt-1 text-xs font-medium text-amber-700">
                            Refund in progress / processed
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p>{o.customerName}</p>
                        <p className="text-xs text-slate-500">{o.customerEmail}</p>
                        <p className="text-xs font-medium text-slate-700">
                          {o.customerWhatsapp || 'No phone'}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium">₹{o.total}</td>
                      <td className="px-4 py-3">
                        {o.paymentId ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <code
                                className={`rounded px-2 py-1 font-mono text-xs font-bold ${
                                  isPending
                                    ? 'bg-amber-200/80 text-amber-900'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {o.paymentId}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyText(String(o.paymentId))}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                title="Copy UTR / Payment ID"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                              {isUpi ? 'UTR (UPI)' : 'Razorpay ID'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <select
                            className={`rounded-lg border px-2 py-1.5 text-sm ${
                              isPending
                                ? 'border-amber-300 bg-amber-50 font-semibold text-amber-900'
                                : 'border-slate-200'
                            }`}
                            value={o.status}
                            onChange={(e) => void onStatus(o, e.target.value as OrderStatus)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => void onStatus(o, 'Paid')}
                              className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Confirm Paid
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {o.customerWhatsapp ? (
                          <a
                            href={waChatUrl(
                              o.customerWhatsapp,
                              `Hi ${o.customerName}, regarding your CustoMix3D order ${o.id}`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
                            title={`Chat ${o.customerWhatsapp}`}
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> {o.customerWhatsapp}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
