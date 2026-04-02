import { useMutation } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import { useNavigate } from '@tanstack/react-router'
import type { paths } from '../types/api'

export const useLoginMutation = (
  emailAddress: string,
  password: string,
  setError: (error: string) => void,
) => {
  const navigate = useNavigate()
  const client = createClient<paths>({
    baseUrl: 'http://localhost:8000',
  })

  return useMutation({
    mutationFn: async () => {
      const { data, response } = await client.GET(
        '/users/{email_address}/login',
        {
          params: { path: { email_address: emailAddress } },
          headers: {
            Authorization: `Basic ${btoa(`${emailAddress}:${password}`)}`,
          },
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const loginData = data as { access_token: string }
      localStorage.setItem(
        'auth',
        JSON.stringify({ email: emailAddress, token: loginData.access_token }),
      )
    },
    onSuccess: () => {
      setError('')
      navigate({ to: '/profile' })
    },
    onError: () => {
      setError('Invalid email or password')
    },
  })
}
