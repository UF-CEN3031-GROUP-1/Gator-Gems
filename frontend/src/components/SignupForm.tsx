import { useState } from 'react'
import { useSignupMutation } from '../api/SignupMutation.tsx'
import '../styles/auth.css'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const signupMutation = useSignupMutation(setError)
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
    <div className="backElement">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      {error && (
        <div className="error">
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
            className="textBox"
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
            className="textBox"
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
            className="textBox"
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
            className="textBox"
            required
          />
        </div>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="button"
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
  )
}
