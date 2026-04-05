import { useEffect, useState } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import SearchControl from './Search'
import 'leaflet/dist/leaflet.css'

const provider = new OpenStreetMapProvider({
  params: {
    viewbox: '-82.4418,29.5988,-82.2458,29.7268',
    bounded: 1,
    countrycodes: 'us',
    'accept-language': 'en',
  },
})

export const LeafletMap = () => {
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
        <Marker position={[29.6516, -82.3248]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <SearchControl provider={provider} />
      </MapContainer>
    </div>
  )
}
