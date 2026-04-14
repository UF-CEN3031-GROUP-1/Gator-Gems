import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LeafletMap } from '../components/LeafletMap'
import ReviewForm from '../components/ReviewForm'

export const Route = createFileRoute('/gemMap')({ component: App, ssr: false })

function App() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <LeafletMap />

      <button
        onClick={() => setShowForm(true)}
        style={{ zIndex: 999 }}
        className="fixed bottom-8 right-8 bg-green-800 hover:bg-green-700 text-white font-bold text-2xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        +
      </button>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
