import { useQuery } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

export const useUserQuery = () => {
  const client = createClient<paths>({ baseUrl: 'http://localhost:8000' })

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, response } = await client.GET('/users/me', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch user')
      return data
    },
  })
}
