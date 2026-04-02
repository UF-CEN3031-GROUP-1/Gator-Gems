import { useQuery } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

export function getStoredAuth(): { email: string; token: string } | null {
  const stored = localStorage.getItem('auth')
  return stored ? (JSON.parse(stored) as { email: string; token: string }) : null
}

export const useUserQuery = () => {
  const auth = getStoredAuth()
  const client = createClient<paths>({ baseUrl: 'http://localhost:8000' })

  return useQuery({
    queryKey: ['user', auth?.email],
    enabled: !!auth,
    queryFn: async () => {
      if (!auth) throw new Error('Not authenticated')
      const { data, response } = await client.GET('/users/{email_address}', {
        params: { path: { email_address: auth.email } },
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch user')
      return data
    },
  })
}
