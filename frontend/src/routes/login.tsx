import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import gatorBg from '/GainesvilleDownTown.jpg'

export const Route = createFileRoute('/login')({ component: App })

function App() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Login mutation with Basic Auth
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Encode credentials to Base64 for Basic Auth
      const basicAuth = btoa(`${credentials.email}:${credentials.password}`)

      const response = await fetch(
        `http://localhost:8000/users/${encodeURIComponent(credentials.email)}/login`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password')
        }
        throw new Error('Login failed')
      }

      const data = await response.json()
      return data
    },
    onSuccess: (data) => {
      // Store user data in localStorage (optional)
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('auth', btoa(`${email}:${password}`)) // Store encoded credentials

      // Navigate to home page
      navigate({ to: '/' })
    },
    onError: (err: Error) => {
      setError(err.message || 'Invalid email or password')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    loginMutation.mutate({ email, password })
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center p-4 text-white"
      style={{ backgroundImage: `url(${gatorBg})` }}
    >
      <div className="dark:bg-gray-800/95 bg-white/95 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className="px-3 py-2 w-full rounded-sm border border-gray-300 dark:border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[rgb(2,48,32)]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs mb-1 font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              className="px-3 py-2 w-full rounded-sm border border-gray-300 dark:border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[rgb(2,48,32)]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[rgb(2,48,32)] text-white rounded-sm py-2 font-black uppercase hover:bg-[rgb(2,48,32)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <a href="/signup" className="hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
