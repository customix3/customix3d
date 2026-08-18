import { useState } from 'react';
import { useCustomOrders } from '@/store/customOrdersStore';

export default function CustomPage() {
  const submit = useCustomOrders((s) => s.submit);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [refId, setRefId] = useState('');

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Request received</h1>
        <p className="text-ink-600 mb-2">
          Ref: <strong>{refId}</strong>
        </p>
        <p className="text-ink-600">
          We will review your file and contact you on WhatsApp with a quote. Saved to admin cloud.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fileName) {
      setError('Please select a 3D file (STL / OBJ / 3MF)');
      return;
    }
    setLoading(true);
    try {
      const row = await submit({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        fileName,
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
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Custom 3D Print</h1>
      <p className="text-ink-600 mb-8">Upload your STL / OBJ and tell us what you need.</p>
      <form className="card p-6 space-y-4" onSubmit={onSubmit}>
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
          <label className="text-sm font-medium">3D file (STL, OBJ, 3MF) *</label>
          <input
            type="file"
            accept=".stl,.obj,.3mf"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
          />
          {fileName && <p className="text-xs text-ink-500 mt-1">{fileName}</p>}
          <p className="text-xs text-slate-400 mt-1">
            File name is saved with the request (full file upload to Storage can be added next).
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="input mt-1 min-h-[100px]"
            placeholder="Material, color, quantity..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}
