import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 text-5xl"
        >
          🛒
        </motion.div>
        <h1 className="font-display mb-3 text-2xl font-bold">Your cart is empty</h1>
        <Link to="/products" className="btn-primary">
          Browse miniatures
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display mb-8 text-3xl font-bold">Cart</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card flex items-center gap-4 p-4"
          >
            <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover bg-cream-100" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-ink-500">₹{item.price} each</p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-cream-100"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-cream-100"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="ml-3 flex items-center gap-1 text-sm text-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </motion.div>
        ))}
      </div>
      <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-lg font-semibold">Total: ₹{total()}</p>
        <Link to="/checkout" className="btn-primary">
          Checkout
        </Link>
      </div>
    </div>
  );
}
