import { createFileRoute } from '@tanstack/react-router'
import ProfileCard from '../components/ProfileCard'

export const Route = createFileRoute('/profile')({ component: App })

function App() {
  return <ProfileCard />
}
