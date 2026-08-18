import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-white mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">
            CUSTO<span className="text-brand-600">MIX</span>3D
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Custom and ready-made 3D printed products. Made to order in India.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/products" className="hover:text-slate-900">All products</Link></li>
            <li><Link to="/custom" className="hover:text-slate-900">Custom printing</Link></li>
            <li><Link to="/category/miniatures" className="hover:text-slate-900">Miniatures</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-slate-900">About</Link></li>
            <li><Link to="/contact" className="hover:text-slate-900">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Policies</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/terms" className="hover:text-slate-900">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-slate-900">Refund Policy</Link></li>
            <li><Link to="/return" className="hover:text-slate-900">Return Policy</Link></li>
            <li><Link to="/shipping" className="hover:text-slate-900">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CustoMix3D · 9346894224 · LB Nagar
      </div>
    </footer>
  );
}
