import { useEffect, useState } from 'react';
import { useSite } from '@/context/SiteContext';
import { subscribePromoPopup, savePromoPopup, type PromoPopup } from '@/services/firestoreAdmin';
import {
  subscribeBusinessContact,
  saveBusinessContact,
  type BusinessContact,
} from '@/services/businessContact';

export default function AdminSettings() {
  const { maintenanceMode, setMaintenanceMode } = useSite();
  const [promo, setPromo] = useState<PromoPopup>({
    enabled: false,
    title: 'Special offer',
    subtitle: '',
    imageUrl: '',
    link: '/products',
  });
  const [contact, setContact] = useState<BusinessContact>({
    whatsapp: '+91',
    email: 'support@customix3d.com',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => subscribePromoPopup(setPromo), []);
  useEffect(() => subscribeBusinessContact(setContact), []);

  const savePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await savePromoPopup(promo);
      setMsg('Popup saved');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await saveBusinessContact(contact);
      setMsg('Business WhatsApp / email saved — used on Custom page');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      {msg && <p className="text-sm text-emerald-600">{msg}</p>}

      <form onSubmit={saveContact} className="card space-y-4 p-6">
        <h2 className="font-semibold">Business contact (custom orders)</h2>
        <p className="text-xs text-slate-500">
          Customers open WhatsApp to this number when they request a custom print.
        </p>
        <div>
          <label className="text-sm font-medium">Your WhatsApp (with country code)</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            placeholder="+9198XXXXXXXX"
            value={contact.whatsapp}
            onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save contact'}
        </button>
      </form>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Maintenance mode</p>
            <p className="mt-1 text-sm text-ink-500">Hide store for customers; admin stays open.</p>
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
      </div>

      <form onSubmit={savePromo} className="card space-y-4 p-6">
        <h2 className="font-semibold">Popup banner</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={promo.enabled}
            onChange={(e) => setPromo({ ...promo, enabled: e.target.checked })}
          />
          Enable popup
        </label>
        <input
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          placeholder="Title"
          value={promo.title}
          onChange={(e) => setPromo({ ...promo, title: e.target.value })}
        />
        <input
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          placeholder="Subtitle"
          value={promo.subtitle}
          onChange={(e) => setPromo({ ...promo, subtitle: e.target.value })}
        />
        <input
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          placeholder="Image URL (optional)"
          value={promo.imageUrl}
          onChange={(e) => setPromo({ ...promo, imageUrl: e.target.value })}
        />
        <input
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          placeholder="Link"
          value={promo.link}
          onChange={(e) => setPromo({ ...promo, link: e.target.value })}
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white"
        >
          Save popup
        </button>
      </form>
    </div>
  );
}
