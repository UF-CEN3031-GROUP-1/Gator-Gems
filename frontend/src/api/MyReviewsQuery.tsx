import { useQuery } from '@tanstack/react-query'

export interface Review {
  id: number
  stars: number
  notes: string
  visitAgain: boolean
  address: string
  locationId: string
  lat: number
  lon: number
  createdBy: string
  createdAt: string
}

export const useMyReviewsQuery = () => {
  return useQuery({
    queryKey: ['reviews', 'me'],
    queryFn: async (): Promise<Review[]> => {
      const res = await fetch('http://localhost:8000/reviews/me', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch reviews')
      return res.json()
    },
  })
}
