import { createFileRoute } from '@tanstack/react-router'
import ProfileCard from '../components/ProfileCard'
import '../styles/auth.css'

export const Route = createFileRoute('/profile')({ component: App })

function App() {
  return (
    <div className="backgroundImage">
      <ProfileCard />
    </div>
  )
}
