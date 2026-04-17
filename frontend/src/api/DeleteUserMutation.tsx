import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteUserMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `http://localhost:8000/admin/users/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      if (!res.ok) throw new Error('Failed to delete user')
      return res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}
