import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, Mail, Upload } from 'lucide-react';
import { useCustomOrders } from '@/store/customOrdersStore';
import { useAuth } from '@/context/AuthContext';
import { uploadCustomOrderImage } from '@/services/uploadImage';
import PhoneInput, { splitPhone } from '@/components/PhoneInput';
import { subscribeBusinessContact, type BusinessContact } from '@/services/businessContact';
import { waChatUrl } from '@/utils/whatsapp';

export default function CustomPage() {
  const submit = useCustomOrders((s) => s.submit);
  const { user } = useAuth();
  const [params] = useSearchParams();
  const hint = params.get('hint') || '';
  const fileRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState<BusinessContact>({
    whatsapp: '+919999999999',
    email: 'support@customix3d.com',
  });

  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '+91');
  const [email, setEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState(hint ? `Looking for: ${hint}` : '');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [refId, setRefId] = useState('');

  useEffect(() => subscribeBusinessContact(setContact), []);

  const onFile = async (file: File | null) => {
    setError('');
    setFileName('');
    setPreview('');
    setImageUrl('');
    setProgress(0);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files (optional)');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setFileName(file.name);
    setUploading(true);
    try {
      setPreview(URL.createObjectURL(file));
      const url = await uploadCustomOrderImage(file, (p) => setProgress(p.percent));
      setImageUrl(url);
      setProgress(100);
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : 'Upload failed') +
          ' — you can still submit without image and send photo on WhatsApp.'
      );
      setFileName('');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const buildWaMessage = (id?: string) => {
    const lines = [
      `Hi CustoMix3D, I want a *custom 3D print*.`,
      id ? `Request ID: ${id}` : '',
      `Name: ${name.trim()}`,
      `My WhatsApp: ${whatsapp.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : '',
      notes.trim() ? `Details: ${notes.trim()}` : '',
      imageUrl ? `(I attached / will send a reference photo)` : `I will send reference photos here.`,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const openBusinessWhatsApp = (id?: string) => {
    const phone = contact.whatsapp || '+919999999999';
    window.open(waChatUrl(phone, buildWaMessage(id)), '_blank', 'noopener');
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display mb-3 text-2xl font-bold">Request received</h1>
        <p className="mb-2 text-ink-600">
          Ref: <strong>{refId}</strong>
        </p>
        <p className="mb-6 text-sm text-ink-600">
          Send your reference photos on WhatsApp so we can quote faster.
        </p>
        <button
          type="button"
          onClick={() => openBusinessWhatsApp(refId)}
          className="btn-primary mb-3 inline-flex w-full items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" /> Send photos on WhatsApp
        </button>
        <Link to="/account" className="block text-sm font-medium text-brand-600">
          View my requests
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { local } = splitPhone(whatsapp);
    if (local.length < 8) {
      setError('Enter your valid WhatsApp number');
      return;
    }
    if (!notes.trim() && !imageUrl) {
      setError('Add a short description of what you want (or optional image)');
      return;
    }
    setLoading(true);
    try {
      const row = await submit({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        customerId: user?.id,
        fileName: fileName || 'whatsapp-photo-pending',
        imageUrl: imageUrl || undefined,
        notes: notes.trim() || 'Custom request — photo via WhatsApp',
      });
      setRefId(row.id);
      setSent(true);
      // Open WA so customer can send photos immediately
      openBusinessWhatsApp(row.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submit failed';
      setError(
        msg.includes('permission') || msg.includes('Permission')
          ? 'Cloud permission error — publish Firestore rules.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display mb-2 text-3xl font-bold">Custom 3D Print</h1>
      <p className="mb-6 text-ink-600">
        Tell us what you need. Easiest path: submit this form, then send reference photos on{' '}
        <strong>WhatsApp</strong>.
      </p>

      {/* Primary CTA — no upload required */}
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-900">Fastest way</p>
        <p className="mt-1 text-sm text-emerald-800/90">
          Message us on WhatsApp with your idea + photos. We’ll quote and guide payment.
        </p>
        <button
          type="button"
          onClick={() => openBusinessWhatsApp()}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp us your design
        </button>
        {contact.email && (
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent('Custom 3D print request')}&body=${encodeURIComponent(buildWaMessage())}`}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white py-2.5 text-sm font-medium text-emerald-800"
          >
            <Mail className="h-4 w-4" /> Or email us
          </a>
        )}
      </div>

      <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        Or leave a request on the site
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
          <label className="text-sm font-medium">Your WhatsApp *</label>
          <div className="mt-1">
            <PhoneInput value={whatsapp} onChange={setWhatsapp} required />
          </div>
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
          <label className="text-sm font-medium">What do you want printed? *</label>
          <textarea
            className="input mt-1 min-h-[100px]"
            placeholder="Size, material, colour, quantity, idea…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Reference image (optional)</label>
          <p className="mt-0.5 text-xs text-slate-400">
            Not required — you can send photos on WhatsApp instead
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
            onChange={(e) => void onFile(e.target.files?.[0] || null)}
          />
          {uploading && (
            <div className="mt-2">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-brand-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Uploading {progress}%…</p>
            </div>
          )}
          {preview && (
            <div className="mt-3 overflow-hidden rounded-xl border">
              <img src={preview} alt="" className="max-h-40 w-full object-contain bg-cream-50" />
              <p className="truncate px-2 py-1 text-xs text-slate-500">{fileName}</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || uploading} className="btn-primary w-full">
          {loading ? 'Submitting…' : 'Submit request + open WhatsApp'}
        </button>
        <p className="text-center text-xs text-slate-400">
          <Upload className="mr-1 inline h-3 w-3" />
          Product catalog images stay as links — unchanged
        </p>
      </form>
    </div>
  );
}
