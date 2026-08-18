import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-cream-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
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
            <li>
              <Link to="/products" className="hover:text-slate-900">
                All products
              </Link>
            </li>
            <li>
              <Link to="/custom" className="hover:text-slate-900">
                Custom printing
              </Link>
            </li>
            <li>
              <Link to="/category/miniatures" className="hover:text-slate-900">
                Miniatures
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link to="/about" className="hover:text-slate-900">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-slate-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-sm font-semibold">Policies</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-500 md:block md:space-y-2">
            <li>
              <Link to="/terms" className="hover:text-slate-900">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-slate-900">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-slate-900">
                Refund
              </Link>
            </li>
            <li>
              <Link to="/return" className="hover:text-slate-900">
                Return
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-slate-900">
                Shipping
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CustoMix3D · 9346894224 · LB Nagar
      </div>
    </footer>
  );
}
