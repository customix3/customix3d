import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  subscribeHomepage,
  saveHomepage,
  DEFAULT_HOME,
  type HomepageCms,
  type HomeSectionId,
} from '@/services/homepageCms';
import { useProducts } from '@/store/productsStore';

const SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Hero banner',
  ticker: 'Quote ticker',
  categories: 'Categories grid',
  featured: 'Featured products',
  customBand: 'Custom CTA band',
  liveOrders: 'Live orders strip',
};

type TextKey =
  | 'badge'
  | 'headline1'
  | 'headline2'
  | 'subtitle'
  | 'ctaPrimary'
  | 'ctaSecondary'
  | 'heroImage'
  | 'customTitle'
  | 'customSubtitle';

export default function AdminHomepage() {
  const [form, setForm] = useState<HomepageCms>(DEFAULT_HOME);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const products = useProducts((s) => s.products).filter((p) => p.active !== false);

  useEffect(() => subscribeHomepage(setForm), []);

  const setText = (key: TextKey, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const moveSection = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const order = [...(f.sectionOrder || [])];
      const j = index + dir;
      if (j < 0 || j >= order.length) return f;
      [order[index], order[j]] = [order[j], order[index]];
      return { ...f, sectionOrder: order };
    });
  };

  const toggleSection = (id: HomeSectionId) => {
    setForm((f) => {
      const hidden = new Set(f.hiddenSections || []);
      if (hidden.has(id)) hidden.delete(id);
      else hidden.add(id);
      return { ...f, hiddenSections: [...hidden] };
    });
  };

  const toggleFeatured = (productId: string) => {
    setForm((f) => {
      const ids = [...(f.featuredProductIds || [])];
      const i = ids.indexOf(productId);
      if (i >= 0) ids.splice(i, 1);
      else ids.push(productId);
      return { ...f, featuredProductIds: ids };
    });
  };

  const moveFeatured = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const ids = [...(f.featuredProductIds || [])];
      const j = index + dir;
      if (j < 0 || j >= ids.length) return f;
      [ids[index], ids[j]] = [ids[j], ids[index]];
      return { ...f, featuredProductIds: ids };
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await saveHomepage({
        ...DEFAULT_HOME,
        ...form,
        sectionOrder: form.sectionOrder?.length ? form.sectionOrder : DEFAULT_HOME.sectionOrder,
        hiddenSections: form.hiddenSections || [],
        featuredProductIds: form.featuredProductIds || [],
      });
      setMsg('Page layout saved — refresh the store to see changes');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: TextKey, opts?: { multiline?: boolean; hint?: string }) => (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {opts?.hint && <p className="text-xs text-slate-400">{opts.hint}</p>}
      {opts?.multiline ? (
        <textarea
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          rows={3}
          value={form[key] || ''}
          onChange={(e) => setText(key, e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          value={form[key] || ''}
          onChange={(e) => setText(key, e.target.value)}
        />
      )}
    </div>
  );

  const sectionOrder = form.sectionOrder?.length ? form.sectionOrder : DEFAULT_HOME.sectionOrder;
  const hidden = form.hiddenSections || [];
  const featuredIds = form.featuredProductIds || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Page layout</h1>
          <p className="mt-1 text-sm text-slate-500">
            Reorder sections, edit text and images, pick featured products
          </p>
        </div>
        <Link to="/" target="_blank" className="text-sm font-medium text-brand-600 underline">
          Open store
        </Link>
      </div>

      {msg && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>
      )}

      <form onSubmit={save} className="space-y-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
            Homepage sections
          </h2>
          <ul className="space-y-2">
            {sectionOrder.map((id, index) => {
              const off = hidden.includes(id);
              return (
                <li
                  key={id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    off ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <button type="button" className="text-xs" onClick={() => moveSection(index, -1)}>
                      Up
                    </button>
                    <button type="button" className="text-xs" onClick={() => moveSection(index, 1)}>
                      Down
                    </button>
                  </div>
                  <span className="flex-1 text-sm font-medium">{SECTION_LABELS[id]}</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600">
                    <input type="checkbox" checked={!off} onChange={() => toggleSection(id)} />
                    Visible
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Hero</h2>
          {field('Badge', 'badge')}
          {field('Headline line 1', 'headline1')}
          {field('Headline line 2 (accent)', 'headline2')}
          {field('Subtitle', 'subtitle', { multiline: true })}
          {field('Primary button text', 'ctaPrimary')}
          {field('Secondary button text', 'ctaSecondary')}
          {field('Hero image URL', 'heroImage', { hint: 'Paste image link' })}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-400">
            Featured products
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Select and reorder. Empty = first 4 active products.
          </p>
          {featuredIds.length > 0 && (
            <ul className="mb-4 space-y-2">
              {featuredIds.map((id, index) => {
                const p = products.find((x) => x.id === id);
                return (
                  <li
                    key={id}
                    className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50/50 px-2 py-1.5"
                  >
                    <div className="flex flex-col">
                      <button type="button" className="text-[10px]" onClick={() => moveFeatured(index, -1)}>
                        Up
                      </button>
                      <button type="button" className="text-[10px]" onClick={() => moveFeatured(index, 1)}>
                        Down
                      </button>
                    </div>
                    <span className="flex-1 truncate text-sm font-medium">{p?.name || id}</span>
                    <button type="button" className="text-xs text-red-600" onClick={() => toggleFeatured(id)}>
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-100 p-2">
            {products.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={featuredIds.includes(p.id)}
                  onChange={() => toggleFeatured(p.id)}
                />
                <span className="truncate">{p.name}</span>
                <span className="ml-auto text-xs text-slate-400">Rs {p.price}</span>
              </label>
            ))}
            {!products.length && <p className="p-2 text-xs text-slate-400">No products yet.</p>}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Custom band</h2>
          {field('Title', 'customTitle')}
          {field('Subtitle', 'customSubtitle', { multiline: true })}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.showLiveOrders !== false}
              onChange={(e) => setForm((f) => ({ ...f, showLiveOrders: e.target.checked }))}
            />
            Show live customer orders ticker
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save page layout'}
        </button>
      </form>
    </div>
  );
}
