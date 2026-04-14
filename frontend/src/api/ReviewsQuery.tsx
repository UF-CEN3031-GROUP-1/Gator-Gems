import { useQuery } from '@tanstack/react-query'

interface Review {
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

export const useReviewsQuery = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<Review[]> => {
      const res = await fetch('http://localhost:8000/reviews')
      if (!res.ok) throw new Error('Failed to fetch reviews')
      return res.json()
    },
  })
}
