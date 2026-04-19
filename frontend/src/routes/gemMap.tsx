import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LeafletMap } from '../components/LeafletMap'
import ReviewForm from '../components/ReviewForm'
// import { SearchControl } from 'leaflet-geosearch'
// import { OpenStreetMapProvider } from 'leaflet-geosearch'
// import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'

export const Route = createFileRoute('/gemMap')({ component: App, ssr: false })

function App() {
  const [showForm, setShowForm] = useState(false)

  // const provider = new OpenStreetMapProvider({
  //   params: {
  //     viewbox: '-82.4418,29.5988,-82.2458,29.7268',
  //     bounded: 1,
  //     countrycodes: 'us',
  //     'accept-language': 'en',
  //   },
  // })

  // const handleSearchResult = (result: SearchResult) => {

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
