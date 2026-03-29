import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

const client = createClient<paths>({
  baseUrl: 'http://localhost:8000',
})

export const useSignupMutation = (setError: (v: string) => void) => {
  const navigate = useNavigate()
  return useMutation({
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
}
