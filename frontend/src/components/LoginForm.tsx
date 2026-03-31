import { useState } from 'react'
import { useLoginMutation } from '../api/LoginMutation.tsx'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const loginMutation = useLoginMutation(email, password, setError)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate()
  }

  return (
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
  )
}
