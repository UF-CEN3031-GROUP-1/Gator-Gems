import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateReviewData {
  stars: number
  notes: string
  visit_again: boolean
}

export const useUpdateReviewMutation = (
  reviewId: number,
  onSuccess: () => void,
  setError: (error: string) => void,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateReviewData) => {
      const res = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? 'Failed to update review')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      onSuccess()
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })
}
