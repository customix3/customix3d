import { useEffect, useState } from 'react';
import {
  subscribeCategories,
  saveCategories,
  DEFAULT_CATEGORIES,
  type CategoryItem,
} from '@/services/categoriesCms';

export default function AdminCategories() {
  const [items, setItems] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => subscribeCategories(setItems), []);

  const update = (id: string, patch: Partial<CategoryItem>) => {
    setItems((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((list) => {
      const next = [...list];
      const j = index + dir;
      if (j < 0 || j >= next.length) return list;
      [next[index], next[j]] = [next[j], next[index]];
      return next.map((c, i) => ({ ...c, order: i }));
    });
  };

  const add = () => {
    const id = 'cat_' + Date.now().toString(36);
    setItems((list) => [
      ...list,
      {
        id,
        name: 'New category',
        slug: 'new-category',
        image: '',
        enabled: true,
        order: list.length,
      },
    ]);
  };

  const remove = (id: string) => {
    if (!confirm('Remove this category?')) return;
    setItems((list) => list.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i })));
  };

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await saveCategories(items);
      setMsg('Categories saved — live site will update');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Names, images, order — shown on home and filters
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={add}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium"
          >
            + Add
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {msg && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>
      )}

      <ul className="space-y-3">
        {items.map((c, index) => (
          <li
            key={c.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex flex-col gap-1">
                <button type="button" className="rounded border px-2 text-xs" onClick={() => move(index, -1)}>
                  Up
                </button>
                <button type="button" className="rounded border px-2 text-xs" onClick={() => move(index, 1)}>
                  Down
                </button>
              </div>
              {c.image ? (
                <img src={c.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1 grid gap-2 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={c.name}
                  onChange={(e) => update(c.id, { name: e.target.value })}
                  placeholder="Display name"
                />
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                  value={c.slug}
                  onChange={(e) => update(c.id, { slug: e.target.value })}
                  placeholder="slug"
                />
                <input
                  className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={c.image}
                  onChange={(e) => update(c.id, { image: e.target.value })}
                  placeholder="Image URL"
                />
              </div>
              <div className="flex flex-col items-end gap-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) => update(c.id, { enabled: e.target.checked })}
                  />
                  On
                </label>
                <button type="button" onClick={() => remove(c.id)} className="text-xs text-red-600">
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
