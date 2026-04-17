import { useState } from 'react'
import { useUserQuery } from '../api/UserQuery'
import { useMyReviewsQuery } from '../api/MyReviewsQuery'
import type { Review } from '../api/MyReviewsQuery'
import EditReviewModal from './EditReviewModal'

export default function ProfileCard() {
  const { data: user, isPending, isError } = useUserQuery()
  const { data: reviews } = useMyReviewsQuery()
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-300">Loading profile...</p>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-400">Failed to load profile. Please log in again.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* User info header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center text-3xl font-bold text-green-300">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400 mt-1">{user.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Account details */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">First Name</p>
              <p className="text-white">{user.firstName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Last Name</p>
              <p className="text-white">{user.lastName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Email</p>
              <p className="text-white">{user.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* My Reviews */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">My Gems</h2>

          {!reviews || reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No gems yet —{' '}
              <a href="/gemMap" className="text-green-400 hover:underline">
                go add one!
              </a>
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-700 rounded-lg p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{review.address}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {'⭐'.repeat(Math.min(review.stars, 10))} {review.stars}/10
                      {review.visitAgain && (
                        <span className="ml-2 text-green-400">· Would visit again</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">{review.notes}</p>
                  </div>
                  <button
                    onClick={() => setEditingReview(review)}
                    className="shrink-0 text-xs bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placeholder: Activity */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 border-dashed opacity-60">
          <h2 className="text-lg font-semibold mb-2">Activity</h2>
          <p className="text-gray-500 text-sm">
            Coming soon — your recent activity will appear here.
          </p>
        </div>

        {/* Placeholder: Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 border-dashed opacity-60">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-gray-500 text-sm">
            Coming soon — account settings will appear here.
          </p>
        </div>
      </div>

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
        />
      )}
    </div>
  )
}
