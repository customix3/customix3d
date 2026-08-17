import { useParams, Link } from 'react-router-dom'

const STEPS = ['Placed', 'Confirmed', 'Printing', 'Shipped', 'Delivered']

export default function OrderDetailPage() {
  const { id } = useParams()
  const current = 2

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-sm text-brand-600 mb-4 inline-block">← Back to orders</Link>
      <h1 className="font-display text-2xl font-bold mb-2">{id}</h1>
      <p className="text-ink-500 mb-8">Tracking (demo)</p>
      <div className="space-y-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${i <= current ? 'bg-brand-500' : 'bg-cream-300'}`} />
              {i < STEPS.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[32px] ${i < current ? 'bg-brand-500' : 'bg-cream-300'}`} />
              )}
            </div>
            <p className={`pb-6 text-sm ${i <= current ? 'font-medium text-ink-900' : 'text-ink-500'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
