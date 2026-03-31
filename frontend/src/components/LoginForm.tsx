import { useState } from 'react'
import { useLoginMutation } from '../api/LoginMutation.tsx'
import '../styles/auth.css'

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
    <div className="backElement">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <div className="error">{error}</div>}

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
            className="textBox"
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
            className="textBox"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="button"
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
