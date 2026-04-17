import { useEffect, useState } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import { useReviewsQuery } from '../api/ReviewsQuery'
import SearchControl from './Search'
import 'leaflet/dist/leaflet.css'
import { ReviewList } from './ReviewList'
import ReviewForm from './ReviewForm'

const provider = new OpenStreetMapProvider({
  params: {
    viewbox: '-82.4418,29.5988,-82.2458,29.7268',
    bounded: 1,
    countrycodes: 'us',
    'accept-language': 'en',
  },
})

export const LeafletMap = () => {
  const [showList, setShowList] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const { data: reviews } = useReviewsQuery()
  const [components, setComponents] = useState<{
    MapContainer: any
    Marker: any
    Popup: any
    TileLayer: any
  } | null>(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const leafletModules = await import('react-leaflet')
      await import('leaflet/dist/leaflet.css')
      setComponents({
        MapContainer: leafletModules.MapContainer,
        Marker: leafletModules.Marker,
        Popup: leafletModules.Popup,
        TileLayer: leafletModules.TileLayer,
      })
    })()
    return () => {
      mounted = false
    }
  }, [])
  if (!components) {
    return null
  }
  const { MapContainer, Marker, Popup, TileLayer } = components

  return (
    <div style={{ height: '95vh', width: '100%' }}>
      <MapContainer
        center={[29.6516, -82.3248]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reviews?.map((review) => (
          <Marker key={review.id} position={[review.lat, review.lon]}>
            <Popup>
              <div>
                <p className="text-sm font-bold mb-2">{review.address}</p>
                <button
                  onClick={() => {
                    setShowList(true)
                    setSelectedLocation(review.locationId)
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View Reviews
                </button>
                <button
                  onClick={() => {
                    setShowForm(true)
                    setSelectedLocation(review.address)
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Review This Location
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <SearchControl provider={provider} />
      </MapContainer>
      {showList && (
        <ReviewList
          onClose={() => setShowList(false)}
          locationId={selectedLocation}
        />
      )}
      {showForm && (
        <ReviewForm
          onClose={() => setShowForm(false)}
          selectedLocation={selectedLocation}
        />
      )}
    </div>
  )
}
