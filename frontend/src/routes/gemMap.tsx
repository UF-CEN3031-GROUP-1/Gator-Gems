import { createFileRoute } from '@tanstack/react-router'
import { LeafletMap } from '../components/LeafletMap'

export const Route = createFileRoute('/gemMap')({ component: App })
function App() {
  return (
    <div>
      <LeafletMap />
    </div>
  )
}
