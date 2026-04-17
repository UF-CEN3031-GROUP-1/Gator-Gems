import { useState } from 'react'
import { useUpdateReviewMutation } from '../api/UpdateReviewMutation'
import type { Review } from '../api/MyReviewsQuery'
import '../styles/auth.css'

interface EditReviewModalProps {
  review: Review
  onClose: () => void
}

export default function EditReviewModal({ review, onClose }: EditReviewModalProps) {
  const [stars, setStars] = useState(review.stars)
  const [notes, setNotes] = useState(review.notes)
  const [visitAgain, setVisitAgain] = useState(review.visitAgain)
  const [error, setError] = useState('')

  const mutation = useUpdateReviewMutation(review.id, onClose, setError)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    mutation.mutate({ stars, notes, visit_again: visitAgain })
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="backElement w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4 truncate">{review.address}</p>

        {error && <div className="error">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="stars" className="block text-xs mb-1 font-semibold">
              Rating: {stars}/10
            </label>
            <input
              type="range"
              id="stars"
              min={1}
              max={10}
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              disabled={mutation.isPending}
              className="w-full accent-green-700"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs mb-1 font-semibold">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              className="textBox resize-none h-24"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visitAgain"
              checked={visitAgain}
              onChange={(e) => setVisitAgain(e.target.checked)}
              disabled={mutation.isPending}
              className="accent-green-700"
            />
            <label htmlFor="visitAgain" className="text-sm">
              Would visit again
            </label>
          </div>

          <button type="submit" disabled={mutation.isPending} className="button">
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
