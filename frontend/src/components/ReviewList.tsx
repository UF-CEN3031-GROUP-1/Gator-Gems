/* import { useState } from 'react'*/
import { useReviewsQuery } from '../api/ReviewsQuery'

interface ReviewFormProps {
  onClose: () => void
  locationId: string | null
}

export const ReviewList = ({ onClose, locationId }: ReviewFormProps) => {
  const { data: reviews, isPending, isError } = useReviewsQuery()
  const locationName =
    reviews?.find((review) => review.locationId === locationId)?.address ||
    'this location'
  /* const [location, setLocation] = useState(locationId)*/

  if (isPending) return <div>Loading reviews...</div>
  if (isError) return <div>Error loading reviews</div>
  return (
    <div className="fixed text-white inset-0 z-[1000] flex items-center justify-center bg-black/60">
      <div className="backElement w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reviews of {locationName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {reviews.map(
          (review) =>
            review.locationId === locationId && (
              <div key={review.id}>
                <strong>{review.address}</strong>
                <br />
                {'⭐'.repeat(review.stars)} ({review.stars}/10)
                <br />
                {review.notes}
                <br />
                <br />
              </div>
            ),
        )}
      </div>
    </div>
  )
}
