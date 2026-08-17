import { useState } from 'react'

export default function CustomPage() {
  const [fileName, setFileName] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Request received</h1>
        <p className="text-ink-600">We will review your file and contact you on WhatsApp with a quote.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Custom 3D Print</h1>
      <p className="text-ink-600 mb-8">Upload your STL / OBJ and tell us what you need.</p>
      <form
        className="card p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
        }}
      >
        <div>
          <label className="text-sm font-medium">Your name</label>
          <input className="input mt-1" required />
        </div>
        <div>
          <label className="text-sm font-medium">WhatsApp number</label>
          <input className="input mt-1" required placeholder="+91..." />
        </div>
        <div>
          <label className="text-sm font-medium">3D file (STL, OBJ, 3MF)</label>
          <input
            type="file"
            accept=".stl,.obj,.3mf"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
          />
          {fileName && <p className="text-xs text-ink-500 mt-1">{fileName}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea className="input mt-1 min-h-[100px]" placeholder="Material, color, quantity..." />
        </div>
        <button type="submit" className="btn-primary w-full">Submit request</button>
      </form>
    </div>
  )
}
