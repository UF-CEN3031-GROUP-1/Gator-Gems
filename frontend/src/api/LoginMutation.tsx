import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const useLoginMutation = (
  email: string,
  password: string,
  setError: (v: string) => void,
) => {
  const navigate = useNavigate()
  return useMutation({
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
}
