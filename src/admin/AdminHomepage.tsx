import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  subscribeHomepage,
  saveHomepage,
  DEFAULT_HOME,
  type HomepageCms,
} from '@/services/homepageCms';

export default function AdminHomepage() {
  const [form, setForm] = useState<HomepageCms>(DEFAULT_HOME);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => subscribeHomepage(setForm), []);

  const set = (key: keyof HomepageCms, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await saveHomepage(form);
      setMsg('Homepage saved — refresh the store to see changes');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof HomepageCms,
    opts?: { multiline?: boolean; hint?: string }
  ) => (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {opts?.hint && <p className="text-xs text-slate-400">{opts.hint}</p>}
      {opts?.multiline ? (
        <textarea
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          rows={3}
          value={String(form[key] ?? '')}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          value={String(form[key] ?? '')}
          onChange={(e) => set(key, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Homepage editor</h1>
          <p className="mt-1 text-sm text-slate-500">Edit storefront copy & hero without code</p>
        </div>
        <Link to="/" target="_blank" className="text-sm font-medium text-brand-600 underline">
          Open store ↗
        </Link>
      </div>

      {msg && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>
      )}

      <form onSubmit={save} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Hero</h2>
        {field('Badge', 'badge')}
        {field('Headline line 1', 'headline1')}
        {field('Headline line 2 (gradient)', 'headline2')}
        {field('Subtitle', 'subtitle', { multiline: true })}
        {field('Primary button text', 'ctaPrimary')}
        {field('Secondary button text', 'ctaSecondary')}
        {field('Hero image URL', 'heroImage', { hint: 'Paste any image link' })}

        <h2 className="pt-2 text-sm font-bold uppercase tracking-wide text-slate-400">Custom band</h2>
        {field('Title', 'customTitle')}
        {field('Subtitle', 'customSubtitle', { multiline: true })}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.showLiveOrders}
            onChange={(e) => set('showLiveOrders', e.target.checked)}
          />
          Show live customer orders ticker at bottom
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save homepage'}
        </button>
      </form>
    </div>
  );
}
