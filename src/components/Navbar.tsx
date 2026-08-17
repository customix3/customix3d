import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { CATEGORIES } from '@/data/demoProducts'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const count = useCart((s) => s.count())
  const { user } = useAuth()
  const navigate = useNavigate()

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="font-display text-xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            CUSTO<span className="text-brand-600">MIX</span>3D
          </Link>

          <form onSubmit={search} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
              <input
                className="input pl-10 py-2 text-sm"
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            <Link to={user ? '/account' : '/login'} className="p-2 rounded-full hover:bg-cream-200 transition">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-cream-200 transition">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 pb-3 text-sm font-medium text-ink-700">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="hover:text-brand-600 transition">
              {c.name}
            </Link>
          ))}
          <Link to="/custom" className="text-brand-600 hover:text-brand-700">Custom Print</Link>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 py-4 space-y-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="block py-2" onClick={() => setOpen(false)}>
              {c.name}
            </Link>
          ))}
          <Link to="/custom" className="block py-2 text-brand-600" onClick={() => setOpen(false)}>Custom Print</Link>
          <Link to="/products" className="block py-2" onClick={() => setOpen(false)}>All Products</Link>
        </div>
      )}
    </header>
  )
}
