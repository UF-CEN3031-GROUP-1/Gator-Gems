import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteReviewMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:8000/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete review')
      return res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
