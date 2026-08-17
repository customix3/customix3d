import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
        <Link to="/products" className="btn-primary">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex gap-4 items-center">
            <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-ink-500">₹{item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button type="button" className="w-8 h-8 rounded-full border" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" className="w-8 h-8 rounded-full border" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                <button type="button" className="text-sm text-red-600 ml-4" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 card p-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: ₹{total()}</p>
        <Link to="/checkout" className="btn-primary">Checkout</Link>
      </div>
    </div>
  )
}
