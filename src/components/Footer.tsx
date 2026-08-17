import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-white mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">
            CUSTO<span className="text-brand-600">MIX</span>3D
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Custom and ready-made 3D printed products. Made to order in India.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/products" className="hover:text-ink-900">All products</Link></li>
            <li><Link to="/custom" className="hover:text-ink-900">Custom printing</Link></li>
            <li><Link to="/category/miniatures" className="hover:text-ink-900">Miniatures</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/about" className="hover:text-ink-900">About</Link></li>
            <li><Link to="/contact" className="hover:text-ink-900">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Support</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>support@customix3d.com</li>
            <li>WhatsApp orders welcome</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} CustoMix3D. All rights reserved.
      </div>
    </footer>
  )
}
