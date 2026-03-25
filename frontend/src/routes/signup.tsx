import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import { useState } from 'react'
import gatorBg from '/GainesvilleDownTown.jpg'
import type { paths } from '../types/api'

export const Route = createFileRoute('/signup')({ component: App })

// Create API client
const client = createClient<paths>({
  baseUrl: 'http://localhost:8000',
})

function App() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (userData: {
      email: string
      firstName: string
      lastName: string
      password: string
    }) => {
      const { data, response } = await client.POST('/users/{email_address}', {
        params: { path: { email_address: userData.email } },
        body: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
        },
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      return data
    },
    onSuccess: () => {
      // Navigate to login page after successful signup
      navigate({ to: '/login' })
    },
    onError: (err) => {
      setError('Failed to create account. User may already exist.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !firstName || !lastName || !password) {
      setError('Please fill in all fields')
      return
    }

    signupMutation.mutate({ email, firstName, lastName, password })
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center p-4 text-white"
      style={{ backgroundImage: `url(${gatorBg})` }}
    >
      <div className="dark:bg-gray-800/95 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block text-xs mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={signupMutation.isPending}
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={signupMutation.isPending}
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={signupMutation.isPending}
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={signupMutation.isPending}
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800 disabled:opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-[rgb(2,48,32)] text-white rounded-sm py-2 font-black uppercase hover:bg-[rgb(2,48,32)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{' '}
            <a href="/login" className="hover:underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
