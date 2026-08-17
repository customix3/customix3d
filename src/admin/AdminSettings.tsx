import { useSite } from '@/context/SiteContext'

export default function AdminSettings() {
  const { maintenanceMode, setMaintenanceMode } = useSite()

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="card p-6 max-w-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Maintenance mode</p>
            <p className="text-sm text-ink-500 mt-1">
              When on, customers see a maintenance page. Admin stays accessible.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative h-8 w-14 rounded-full transition ${
              maintenanceMode ? 'bg-brand-500' : 'bg-cream-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition ${
                maintenanceMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        <p className="mt-4 text-sm text-ink-600">
          Status: <strong>{maintenanceMode ? 'ON — store hidden' : 'OFF — store live'}</strong>
        </p>
      </div>
    </div>
  )
}
