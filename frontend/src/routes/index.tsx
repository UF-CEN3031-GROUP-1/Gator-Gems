import { createFileRoute } from '@tanstack/react-router'
import Navbar from '../components/Navbar'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <Navbar />
      <h1>Welcome to the App!</h1>
    </div>
  )
}
