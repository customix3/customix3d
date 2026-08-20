import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCustomOrders } from '@/store/customOrdersStore';
import { useAuth } from '@/context/AuthContext';
import { uploadCustomOrderImage } from '@/services/uploadImage';

export default function CustomPage() {
  const submit = useCustomOrders((s) => s.submit);
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [refId, setRefId] = useState('');

  const onFile = async (file: File | null) => {
    setError('');
    setFileName('');
    setPreview('');
    setImageUrl('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP, GIF)');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setFileName(file.name);
    setUploading(true);
    try {
      const local = URL.createObjectURL(file);
      setPreview(local);
      const url = await uploadCustomOrderImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setFileName('');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display mb-3 text-2xl font-bold">Request received</h1>
        <p className="mb-2 text-ink-600">
          Ref: <strong>{refId}</strong>
        </p>
        <p className="mb-6 text-ink-600">
          We will review your image and contact you on WhatsApp with a quote. Track status in Account.
        </p>
        <Link to="/account" className="btn-primary">
          View my requests
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fileName || !imageUrl) {
      setError('Please upload an image of what you want printed');
      return;
    }
    setLoading(true);
    try {
      const row = await submit({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        customerId: user?.id,
        fileName,
        imageUrl,
        notes: notes.trim(),
      });
      setRefId(row.id);
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submit failed';
      setError(
        msg.includes('permission') || msg.includes('Permission')
          ? 'Cloud permission error — publish Firestore rules first.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display mb-2 text-3xl font-bold">Custom 3D Print</h1>
      <p className="mb-8 text-ink-600">
        Upload a photo or design (JPG / PNG) of what you want printed and tell us the details.
      </p>
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm font-medium">Your name *</label>
          <input
            className="input mt-1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">WhatsApp number *</label>
          <input
            className="input mt-1"
            required
            placeholder="+91..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="input mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Upload image *</label>
          <p className="mt-0.5 text-xs text-slate-400">JPG, PNG, WebP, GIF — max 8MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
            onChange={(e) => void onFile(e.target.files?.[0] || null)}
          />
          {uploading && <p className="mt-2 text-xs text-slate-500">Uploading…</p>}
          {preview && (
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
              <img src={preview} alt="Preview" className="max-h-56 w-full object-contain bg-cream-50" />
              <p className="truncate px-3 py-2 text-xs text-slate-500">{fileName}</p>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="input mt-1 min-h-[100px]"
            placeholder="Size, material, color, quantity..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading || uploading} className="btn-primary w-full">
          {loading ? 'Submitting…' : uploading ? 'Wait for upload…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}
