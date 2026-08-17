import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' })

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <p>Cart is empty</p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Order placed!</h1>
        <p className="text-ink-600 mb-6">Demo payment successful. You will receive updates on WhatsApp.</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/orders')}>View orders</button>
      </div>
    )
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    clear()
    setDone(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-medium">Shipping</h2>
          {(['name', 'phone', 'address', 'city', 'pincode'] as const).map((k) => (
            <div key={k}>
              <label className="text-sm capitalize">{k}</label>
              <input
                className="input mt-1"
                required
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="card p-6">
            <h2 className="font-medium mb-4">Order summary</h2>
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm py-2 border-b border-cream-200">
                <span>{i.name} × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            <p className="mt-4 font-semibold text-lg">Total ₹{total()}</p>
            <p className="text-xs text-ink-500 mt-2">TEST payment mode — no real charge</p>
            <button type="submit" className="btn-primary w-full mt-6">Pay (Demo)</button>
          </div>
        </div>
      </form>
    </div>
  )
}
