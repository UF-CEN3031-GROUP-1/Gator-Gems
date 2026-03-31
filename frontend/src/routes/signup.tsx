import { createFileRoute } from '@tanstack/react-router'
import SignupForm from '../components/SignupForm.tsx'
import '../styles/auth.css'

export const Route = createFileRoute('/signup')({ component: App })

function App() {
  return (
    <div
      className="backgroundImage">
      <SignupForm />
    </div>
  )
}
