import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/LoginForm.tsx'
import '../styles/auth.css'

export const Route = createFileRoute('/login')({ component: App })

function App() {
  return (
    <div className="backgroundImage">
      <LoginForm />
    </div>
  )
}
