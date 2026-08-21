import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '@/store/productsStore';
import { useCart } from '@/context/CartContext';

/** Live preview page for name / text personalized 3D products */
export default function PersonalizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProducts((s) => s.getById(id || ''));
  const addItem = useCart((s) => s.addItem);
  const [text, setText] = useState('');
  const [qty, setQty] = useState(1);

  const previewName = useMemo(() => {
    const t = text.trim();
    return t || 'Your name';
  }, [text]);

  if (!product || product.active === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-600">Product not found</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product.personalizable) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-600">This product is not personalizable.</p>
        <Link
          to={`/products/${product.id}`}
          className="mt-4 inline-block text-sm font-semibold text-brand-600"
        >
          View product
        </Link>
      </div>
    );
  }

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
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-600">
        Personalize
      </p>
      <h1 className="font-display mb-2 text-2xl font-bold sm:text-3xl">{product.name}</h1>
      <p className="mb-8 max-w-xl text-sm text-slate-600">{product.description}</p>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Type className="h-4 w-4" /> Live preview
          </p>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <motion.div
                key={previewName}
                initial={{ scale: 0.92, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-full rounded-2xl border border-white/20 bg-white/10 px-8 py-6 shadow-2xl backdrop-blur-md"
                style={{
                  boxShadow:
                    '0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                <p
                  className="break-all text-center font-display text-3xl font-bold tracking-wide text-white sm:text-4xl"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                >
                  {previewName}
                </p>
                <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/50">
                  3D printed · CustoMix
                </p>
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-white/60">
              Preview only — final print may vary slightly by size and filament
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-slate-700">Name / text on product *</label>
          <input
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-lg font-semibold tracking-wide"
            placeholder="e.g. AARAV"
            maxLength={24}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <p className="mt-1.5 text-xs text-slate-400">{text.trim().length}/24 characters</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Qty</span>
            <div className="flex items-center rounded-full border border-slate-200">
              <button
                type="button"
                className="px-4 py-2 text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                className="px-4 py-2 text-lg"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <p className="mt-6 text-2xl font-bold">₹{product.price * qty}</p>
          {out && <p className="mt-2 text-sm text-red-600">Out of stock</p>}

          <button
            type="button"
            disabled={out}
            onClick={add}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Add personalized to cart
          </button>

          <Link
            to={`/products/${product.id}`}
            className="mt-4 text-center text-sm text-slate-500 underline"
          >
            View product details
          </Link>
        </div>
      </div>
    </div>
  );
}
