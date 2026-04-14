import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateReviewData {
  stars: number
  notes: string
  visit_again: boolean
  location_name: string
}

export const useCreateReviewMutation = (
  onSuccess: () => void,
  setError: (error: string) => void,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const res = await fetch('http://localhost:8000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail ?? 'Failed to create review')
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
