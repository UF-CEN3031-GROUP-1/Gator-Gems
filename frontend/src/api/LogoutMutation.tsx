import { useMutation } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import { useNavigate } from '@tanstack/react-router'
import type { paths } from '../types/api'

export const useLogoutMutation = (setError: (error: string) => void) => {
  const navigate = useNavigate()
  const client = createClient<paths>({
    baseUrl: 'http://localhost:8000',
  })

  return useMutation({
    mutationFn: async () => {
      const response = await client.GET('/users/logout', {
        credentials: 'include',
      })
      if (!response.response.ok) {
        throw new Error('Logout failed')
      }
      return response
    },
    onSuccess: () => {
      setError('')
      navigate({ to: '/login' })
    },
    onError: () => {
      setError('Invalid email or password')
    },
  })
}
