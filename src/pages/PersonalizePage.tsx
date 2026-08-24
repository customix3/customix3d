import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Type, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '@/store/productsStore';
import { useCart } from '@/context/CartContext';
import { DEFAULT_TEXT_BOX } from '@/types/product';

/** Live preview page for name / text personalized 3D products */
export default function PersonalizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProducts((s) => s.getById(id || ''));
  const addItem = useCart((s) => s.addItem);
  const [text, setText] = useState('');
  const [qty, setQty] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);

  const previewName = useMemo(() => {
    const t = text.trim();
    return t || 'Your name';
  }, [text]);

  if (!product || product.active === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-600">Product not found</p>
        <Link to="/name-it" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          Back to Name it
        </Link>
      </div>
    );
  }

  if (!product.personalizable) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-600">This product is not personalizable.</p>
        <Link to={`/products/${product.id}`} className="mt-4 inline-block text-sm font-semibold text-brand-600">
          View product
        </Link>
      </div>
    );
  }

  const demos = product.images?.length ? product.images : product.image ? [product.image] : [];
  const baseSrc = product.baseImage || product.image;
  const box = product.textBox || DEFAULT_TEXT_BOX;
  const out = product.stock != null && product.stock <= 0;

  const add = () => {
    if (out) return;
    const label = text.trim();
    if (!label) {
      toast.error('Enter a name or text for the print');
      return;
    }
    if (label.length > 24) {
      toast.error('Keep text under 24 characters for a clean print');
      return;
    }
    addItem(
      {
        id: `${product.id}__${label}`,
        name: `${product.name} ("${label}")`,
        image: product.image,
        price: product.price,
      },
      qty
    );
    toast.success(`Added ${product.name} with "${label}"`);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-600">Name it</p>
      <h1 className="font-display mb-2 text-2xl font-bold sm:text-3xl">{product.name}</h1>
      <p className="mb-8 max-w-xl text-sm text-slate-600">{product.description}</p>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          {!showPreview ? (
            <>
              <div className="overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-slate-100 shadow-card">
                <img src={demos[demoIdx] || product.image} alt={product.name} className="aspect-square w-full object-cover" />
              </div>
              {demos.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {demos.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDemoIdx(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                        i === demoIdx ? 'border-brand-500' : 'border-transparent'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <ImageIcon className="h-3.5 w-3.5" />
                Demo photos — how finished pieces look
              </p>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-500"
              >
                <Type className="h-4 w-4" />
                Open live name preview
              </button>
            </>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-slate-100 shadow-card">
                <img src={baseSrc} alt="Base for preview" className="aspect-square w-full object-cover" />
                <motion.div
                  key={previewName}
                  initial={{ opacity: 0.4, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pointer-events-none absolute flex items-center justify-center text-center font-bold leading-tight text-ink-900"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `clamp(14px, ${box.fontSize * 0.55}vw, 42px)`,
                    textShadow: '0 1px 3px rgba(255,255,255,0.85)',
                    wordBreak: 'break-word',
                  }}
                >
                  {previewName}
                </motion.div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Live preview on plain base — approximate position, not exact print font.
              </p>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
              >
                ← Back to demo photos
              </button>
            </>
          )}
        </div>

        <div>
          <p className="font-display text-3xl font-bold text-ink-900">₹{product.price}</p>
          {product.stock != null && (
            <p className={`mt-1 text-sm font-medium ${out ? 'text-red-600' : 'text-slate-500'}`}>
              {out ? 'Out of stock' : `${product.stock} in stock`}
            </p>
          )}

          <label className="mt-8 block text-sm font-semibold text-ink-800">Name / text for the print</label>
          <input
            className="input mt-2"
            placeholder="e.g. AARAV"
            maxLength={24}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setShowPreview(true)}
          />
          <p className="mt-1.5 text-xs text-slate-400">{text.trim().length}/24 characters</p>

          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Qty</label>
            <input
              type="number"
              min={1}
              max={out ? 0 : product.stock ?? 99}
              className="w-20 rounded-xl border px-3 py-2 text-sm"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              disabled={out}
            />
          </div>

          <button
            type="button"
            disabled={out}
            onClick={add}
            className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            {out ? 'Out of stock' : 'Add to cart'}
          </button>

          <Link to="/name-it" className="mt-4 block text-center text-sm font-medium text-slate-500 hover:text-ink-900">
            ← All Name it products
          </Link>
        </div>
      </div>
    </div>
  );
}
