import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, Settings, FileBox, Tag } from 'lucide-react';
import { useProducts } from '@/store/productsStore';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';

const cards = [
  { title: 'Products', href: '/admin/products', icon: Package, desc: 'Catalog CRUD' },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag, desc: 'Paid orders' },
  { title: 'Custom', href: '/admin/custom-orders', icon: FileBox, desc: 'Print requests' },
  { title: 'Customers', href: '/admin/customers', icon: Users, desc: 'From orders' },
  { title: 'Offers', href: '/admin/offers', icon: Tag, desc: 'Coupons' },
  { title: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Maintenance' },
];

export default function AdminDashboard() {
  const products = useProducts((s) => s.products);
  const orders = useOrders((s) => s.orders);
  const custom = useCustomOrders((s) => s.items);
  const pendingCustom = custom.filter((c) => c.status === 'New').length;
  const inProgress = orders.filter((o) => o.status === 'Paid' || o.status === 'Processing').length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-ink-500 mb-8">All data synced via Firebase</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} to={c.href} className="card p-5 hover:shadow-soft transition">
            <c.icon className="h-8 w-8 text-brand-500 mb-3" />
            <p className="font-medium">{c.title}</p>
            <p className="text-sm text-ink-500 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 card p-6">
        <h2 className="font-medium mb-4">Live stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-ink-500">Products</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-ink-500">Orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{custom.length}</p>
            <p className="text-sm text-ink-500">Custom total</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCustom || inProgress}</p>
            <p className="text-sm text-ink-500">New custom / in progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
