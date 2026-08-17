import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, Settings } from 'lucide-react'

const cards = [
  { title: 'Products', href: '/admin/products', icon: Package, desc: 'Manage catalog' },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag, desc: 'View & update orders' },
  { title: 'Customers', href: '/admin/customers', icon: Users, desc: 'Customer list' },
  { title: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Maintenance & more' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-ink-500 mb-8">Welcome to CustoMix3D admin</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} to={c.href} className="card p-5 hover:shadow-soft transition">
            <c.icon className="h-8 w-8 text-brand-500 mb-3" />
            <p className="font-medium">{c.title}</p>
            <p className="text-sm text-ink-500 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 card p-6">
        <h2 className="font-medium mb-2">Quick stats (demo)</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-ink-500">Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-ink-500">Orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-ink-500">Pending custom</p>
          </div>
        </div>
      </div>
    </div>
  )
}
