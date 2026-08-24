import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Cloud, AlertTriangle, Upload, Link2 } from 'lucide-react';
import { useProducts } from '@/store/productsStore';
import { CATEGORIES } from '@/data/demoProducts';
import type { Product } from '@/types/product';
import { uploadProductImage } from '@/services/uploadImage';

const MAX_IMAGES = 10;

const emptyForm = {
  name: '',
  price: '',
  compareAtPrice: '',
  stock: '10',
  images: [] as string[],
  category: 'home-decor',
  description: '',
  active: true,
};

export default function AdminProducts() {
  const { products: allProducts, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  // Normal catalog only — Name it products managed on separate admin page
  const products = allProducts.filter((p) => !p.personalizable);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [urlInput, setUrlInput] = useState('');
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setUrlInput('');
    setFormError('');
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    const imgs = (p.images?.length ? p.images : p.image ? [p.image] : []).slice(0, MAX_IMAGES);
    setForm({
      name: p.name,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      stock: String(p.stock != null ? p.stock : 10),
      images: imgs,
      category: p.category,
      description: p.description || '',
      active: p.active !== false,
    });
    setUrlInput('');
    setFormError('');
    setOpen(true);
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    if (form.images.length >= MAX_IMAGES) {
      setFormError(`Max ${MAX_IMAGES} images`);
      return;
    }
    setForm((f) => ({ ...f, images: [...f.images, u] }));
    setUrlInput('');
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_IMAGES - form.images.length;
    if (room <= 0) {
      setFormError(`Max ${MAX_IMAGES} images`);
      return;
    }
    setUploading(true);
    setFormError('');
    try {
      const list = Array.from(files).slice(0, room);
      const urls: string[] = [];
      for (const file of list) urls.push(await uploadProductImage(file));
      setForm((f) => ({ ...f, images: [...f.images, ...urls].slice(0, MAX_IMAGES) }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const price = Number(form.price);
    const stock = Math.max(0, Number(form.stock));
    if (!form.name.trim() || !price || price <= 0) {
      setFormError('Name and valid price required');
      return;
    }
    if (!form.images.length) {
      setFormError('Add at least 1 image');
      return;
    }
    if (Number.isNaN(stock)) {
      setFormError('Stock must be a number (0 = out of stock)');
      return;
    }
    const images = form.images.slice(0, MAX_IMAGES);
    const payload = {
      name: form.name.trim(),
      price,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      image: images[0],
      images,
      category: form.category,
      description: form.description.trim() || form.name.trim(),
      active: form.active,
      personalizable: false,
      stock,
    };
    setSaving(true);
    try {
      if (editingId) await updateProduct(editingId, payload);
      else await addProduct(payload);
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setFormError(
        msg.includes('permission') || msg.includes('Permission')
          ? 'Permission denied. Publish Firestore rules.'
          : msg
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Products (normal)</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Cloud className="h-3.5 w-3.5" />
            {loading ? 'Syncing…' : `${products.length} normal products · Name it products are separate`}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {error && (
        <div className="mb-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const out = p.stock != null && p.stock <= 0;
                return (
                  <tr key={p.id} className="border-t border-cream-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-cream-100" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 font-medium ${out ? 'text-red-600' : ''}`}>
                      {p.stock != null ? p.stock : '—'}
                    </td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">
                      {out ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Out of stock</span>
                      ) : p.active !== false ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Hidden</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => openEdit(p)} className="rounded-lg p-2 hover:bg-cream-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove(p.id, p.name)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit product' : 'Add product'}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4 p-5">
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
              <div>
                <label className="text-sm font-medium">Name *</label>
                <input className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Price (₹) *</label>
                  <input type="number" min={1} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Compare at</label>
                  <input type="number" min={0} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock *</label>
                  <input type="number" min={0} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  <p className="mt-0.5 text-[10px] text-slate-400">0 = out of stock</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter((c) => c.slug !== 'name-it').map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Images * <span className="font-normal text-slate-400">({form.images.length}/{MAX_IMAGES})</span></label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border bg-cream-50">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {form.images.length < MAX_IMAGES && (
                  <div className="mt-3 space-y-2">
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void onFiles(e.target.files)} />
                    <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium hover:bg-cream-50 disabled:opacity-60">
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Uploading…' : 'Upload from device'}
                    </button>
                    <div className="flex gap-2">
                      <input className="flex-1 rounded-xl border py-2.5 px-3 text-sm" placeholder="Or paste image URL" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
                      <button type="button" onClick={addUrl} className="rounded-xl bg-slate-100 px-4 text-sm font-medium">Add</button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea className="mt-1 min-h-[80px] w-full rounded-xl border px-3 py-2.5 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active on store
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-full border py-2.5 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="flex-1 rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? 'Saving…' : editingId ? 'Save' : 'Add product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
