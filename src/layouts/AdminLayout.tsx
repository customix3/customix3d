import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/custom-orders', label: 'Custom', icon: FileBox },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { maintenanceMode, setMaintenanceMode } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('cmx_admin');
    localStorage.removeItem('customix3d-admin');
    navigate('/admin/login');
  };

  const Sidebar = (
    <>
      <div className="border-b border-cream-200 p-4">
        <Link to="/admin" className="font-display text-lg font-bold">
          CUSTO<span className="text-brand-600">MIX</span>
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">Admin</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? 'bg-brand-50 font-medium text-brand-700'
                  : 'text-ink-700 hover:bg-cream-100'
              }`
            }
          >
            <l.icon className="h-4 w-4 shrink-0" />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-cream-200 p-3">
        <button
          type="button"
          onClick={() => setMaintenanceMode(!maintenanceMode)}
          className="w-full rounded-lg bg-cream-100 px-3 py-2 text-left text-xs hover:bg-cream-200"
        >
          Maintenance: <strong>{maintenanceMode ? 'ON' : 'OFF'}</strong>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:text-ink-900"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 md:flex-row">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-cream-200 bg-white px-3 md:hidden">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-100"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="font-display font-bold">
          CUSTO<span className="text-brand-600">MIX</span> Admin
        </span>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-white shadow-xl md:hidden">
            {Sidebar}
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-cream-200 bg-white md:flex">
        {Sidebar}
      </aside>

      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
