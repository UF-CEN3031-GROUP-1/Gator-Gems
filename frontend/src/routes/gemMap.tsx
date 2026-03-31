import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar'
import { LeafletMap } from '../components/LeafletMap'

export const Route = createFileRoute('/gemMap')({ component: App })
function App() {
  return (
    <div>
      <Navbar />
      <LeafletMap />
    </div>
  )
}
