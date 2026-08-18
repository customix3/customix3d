import { useEffect, useState } from 'react';
import { Plus, Trash2, Cloud } from 'lucide-react';
import {
  subscribeOffers,
  saveOffer,
  deleteOffer,
  type Offer,
} from '@/services/firestoreAdmin';

export default function AdminOffers() {
  const [list, setList] = useState<Offer[]>([]);
  const [code, setCode] = useState('');
  const [percent, setPercent] = useState('10');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeOffers(setList), []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSaving(true);
    try {
      await saveOffer({
        code: code.trim(),
        discountPercent: Number(percent) || 0,
        active: true,
        description: description.trim(),
      });
      setCode('');
      setPercent('10');
      setDescription('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Offers & Coupons</h1>
      <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
        <Cloud className="h-3.5 w-3.5" /> Stored in Firebase
      </p>

      <form onSubmit={add} className="card p-5 mb-6 grid sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="text-sm font-medium">Code</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SAVE10"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">% off</label>
          <input
            type="number"
            min={1}
            max={100}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Festival sale"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> {saving ? 'Saving…' : 'Add'}
        </button>
      </form>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">No offers yet. Add a coupon above.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-cream-200">
                  <td className="px-4 py-3 font-mono font-medium">{o.code}</td>
                  <td className="px-4 py-3">{o.discountPercent}%</td>
                  <td className="px-4 py-3 text-slate-500">{o.description || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        o.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                      onClick={() =>
                        void saveOffer({ ...o, active: !o.active })
                      }
                    >
                      {o.active ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => {
                        if (confirm('Delete offer?')) void deleteOffer(o.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
