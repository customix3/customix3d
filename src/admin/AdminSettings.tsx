import { useEffect, useState } from 'react';
import { useSite } from '@/context/SiteContext';
import { subscribePromoPopup, savePromoPopup, type PromoPopup } from '@/services/firestoreAdmin';

export default function AdminSettings() {
  const { maintenanceMode, setMaintenanceMode } = useSite();
  const [promo, setPromo] = useState<PromoPopup>({
    enabled: false,
    title: 'Special offer',
    subtitle: '',
    imageUrl: '',
    link: '/products',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => subscribePromoPopup(setPromo), []);

  const savePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await savePromoPopup(promo);
      setMsg('Popup saved — live on store');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Maintenance mode</p>
            <p className="mt-1 text-sm text-ink-500">
              When on, customers see maintenance page. Admin stays open.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative h-8 w-14 rounded-full transition ${
              maintenanceMode ? 'bg-brand-500' : 'bg-cream-300'
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                maintenanceMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        <p className="mt-4 text-sm text-ink-600">
          Status: <strong>{maintenanceMode ? 'ON — store hidden' : 'OFF — store live'}</strong>
        </p>
      </div>

      <form onSubmit={savePromo} className="card space-y-4 p-6">
        <h2 className="font-semibold">Popup banner (circular promo)</h2>
        <p className="text-xs text-slate-500">
          Shows once per browser session on the storefront with motion rings.
        </p>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={promo.enabled}
            onChange={(e) => setPromo({ ...promo, enabled: e.target.checked })}
          />
          Enable popup
        </label>

        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            value={promo.title}
            onChange={(e) => setPromo({ ...promo, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Subtitle</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            value={promo.subtitle}
            onChange={(e) => setPromo({ ...promo, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Image URL (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            placeholder="https://..."
            value={promo.imageUrl}
            onChange={(e) => setPromo({ ...promo, imageUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Link when clicked</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            value={promo.link}
            onChange={(e) => setPromo({ ...promo, link: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save popup'}
        </button>
      </form>
    </div>
  );
}
