import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { GeoSearchControl } from 'leaflet-geosearch'
import type { OpenStreetMapProvider } from 'leaflet-geosearch';
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js'
import 'leaflet-geosearch/dist/geosearch.css'

interface SearchControlProps {
  provider: OpenStreetMapProvider
  onResult?: (result: SearchResult) => void
}

function SearchControl({ provider, onResult }: SearchControlProps) {
  const map = useMap()

  useEffect(() => {
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Search for gem...',
    })

    map.addControl(searchControl)

    const handleResult = (e: any) => {
      onResult?.(e.location)
    }

    if (onResult) {
      map.on('geosearch/showlocation', handleResult)
    }

    return () => {
      map.removeControl(searchControl)
      map.off('geosearch/showlocation', handleResult)
    }
  }, [map, provider, onResult])

  return null
}

export default SearchControl
