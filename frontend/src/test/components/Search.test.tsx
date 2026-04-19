/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import SearchControl from '../../components/Search'

const addControl = vi.fn()
const removeControl = vi.fn()
const on = vi.fn()
const off = vi.fn()

vi.mock('react-leaflet', () => ({
  useMap: () => ({ addControl, removeControl, on, off }),
}))

vi.mock('leaflet-geosearch', () => ({
  GeoSearchControl: (opts: any) => ({ opts }),
}))

describe('SearchControl', () => {
  it('attaches and detaches control to map', () => {
    const fakeProvider: any = { foo: 'bar' }
    render(<SearchControl provider={fakeProvider} />)

    expect(addControl).toHaveBeenCalled()
  })
})
