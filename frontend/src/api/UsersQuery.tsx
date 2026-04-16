import { useQuery } from '@tanstack/react-query'

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/admin/users', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
  })
}
