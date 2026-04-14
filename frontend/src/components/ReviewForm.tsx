import { useState } from 'react'
import { useCreateReviewMutation } from '../api/CreateReviewMutation'
import '../styles/auth.css'

interface ReviewFormProps {
  onClose: () => void
}

export default function ReviewForm({ onClose }: ReviewFormProps) {
  const [locationName, setLocationName] = useState('')
  const [stars, setStars] = useState(5)
  const [notes, setNotes] = useState('')
  const [visitAgain, setVisitAgain] = useState(true)
  const [error, setError] = useState('')

  const mutation = useCreateReviewMutation(onClose, setError)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    mutation.mutate({
      location_name: locationName,
      stars,
      notes,
      visit_again: visitAgain,
    })
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="backElement w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add a Gem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="locationName" className="block text-xs mb-1 font-semibold">
              Location Name
            </label>
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              disabled={mutation.isPending}
              className="textBox"
              placeholder="e.g. Depot Park, Gainesville"
              required
            />
          </div>

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
              placeholder="What makes this place a gem?"
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
            {mutation.isPending ? 'Saving...' : 'Add Gem'}
          </button>
        </form>
      </div>
    </div>
  )
}
