import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  FileBox,
  Tag,
  Star,
} from 'lucide-react'
import { useSite } from '@/context/SiteContext'

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/custom-orders', label: 'Custom', icon: FileBox },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { maintenanceMode, setMaintenanceMode } = useSite()

  const logout = () => {
    localStorage.removeItem('cmx_admin')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-cream-50">
      <aside className="w-56 bg-white border-r border-cream-200 flex flex-col">
        <div className="p-4 border-b border-cream-200">
          <Link to="/admin" className="font-display font-bold text-lg">
            CUSTO<span className="text-brand-600">MIX</span>
          </Link>
          <p className="text-xs text-ink-500 mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-700 hover:bg-cream-100'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-cream-200 space-y-2">
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className="w-full text-left text-xs px-3 py-2 rounded-lg bg-cream-100 hover:bg-cream-200"
          >
            Maintenance: <strong>{maintenanceMode ? 'ON' : 'OFF'}</strong>
          </button>
          <button type="button" onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-600 hover:text-ink-900">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
