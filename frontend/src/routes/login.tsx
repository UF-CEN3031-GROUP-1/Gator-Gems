import { createFileRoute } from '@tanstack/react-router'
import gatorBg from '/GainesvilleDownTown.jpg'
import LoginForm from '../components/LoginForm.tsx'

export const Route = createFileRoute('/login')({ component: App })

function App() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center p-4 text-white"
      style={{ backgroundImage: `url(${gatorBg})` }}
    >
      <LoginForm />
      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <a href="/signup" className="hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
