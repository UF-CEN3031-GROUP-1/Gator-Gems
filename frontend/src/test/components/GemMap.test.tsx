import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { createMockRoute } from '../mock-routes'
import { renderWithRouter } from '../router-utils'
import { LeafletMap } from '../../components/LeafletMap'

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }: any) => (
    <div data-testid="map-container" {...props}>
      {children}
    </div>
  ),
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  TileLayer: () => <div data-testid="tilelayer" />,
}))

vi.mock('leaflet/dist/leaflet.css', () => ({}))

describe('GemMap Route / LeafletMap', () => {
  it('renders the map and its children when route is visited', async () => {
    const route = createMockRoute('/gemMap', LeafletMap)

    renderWithRouter(<div />, { routes: [route], initialLocation: '/gemMap' })

    const map = await screen.findByTestId('map-container')
    expect(map).toBeInTheDocument()

    expect(screen.getByTestId('marker')).toBeInTheDocument()
    expect(screen.getByTestId('popup')).toBeInTheDocument()
    expect(screen.getByTestId('tilelayer')).toBeInTheDocument()
  })
})
