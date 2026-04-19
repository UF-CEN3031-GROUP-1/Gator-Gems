import { Link, createFileRoute } from '@tanstack/react-router'
import '../styles/front.css'
import { useMemo } from 'react'
import { useReviewsQuery } from '../api/ReviewsQuery'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data: reviews, isLoading, isError } = useReviewsQuery()

  const dailyGem = useMemo(() => {
    if (!reviews || reviews.length === 0) return null
    const days = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000)
    const idx = days % reviews.length
    return reviews[idx]
  }, [reviews])

  return (
    <div className="bg">
      <div className="be">
        <h1 className="title">Welcome</h1>
        <p className="text">
          Gator Gems is a state of the art application that takes advantage of
          user submitted hidden gems all around Gainesville as to provide the
          best places for old and new Gainsville citizens to gain a new
          experience in the city.
        </p>

        <div className="actions">
          <button
            onClick={() => (window.location.href = '/gemMap')}
            className="explore-button"
          >
            Explore the Map
          </button>
          <button
            onClick={() => (window.location.href = '/signup')}
            className="gt-button"
          >
            Get Started
          </button>
        </div>

        <div className="row">
          <div className="item">
            <h3>Discover</h3>
            <p>Find unique local spots.</p>
          </div>
          <div className="item">
            <h3>Save</h3>
            <p>Keep your favorite places.</p>
          </div>
          <div className="item">
            <h3>Share</h3>
            <p>Help others explore Gainesville.</p>
          </div>
        </div>

        <div className="daily-gem mt-8 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-white mb-3">Daily Gem</h2>
          <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700">
            {isLoading ? (
              <p className="text-gray-400">Loading daily gem…</p>
            ) : isError ? (
              <p className="text-red-400">Failed to load daily gem.</p>
            ) : !dailyGem ? (
              <p className="text-gray-400">No gems available yet.</p>
            ) : (
              <div className="bg-gray-700/70 rounded-lg p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">
                    {dailyGem.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {'⭐'.repeat(Math.min(dailyGem.stars, 10))} {dailyGem.stars}
                    /10
                    {dailyGem.visitAgain && (
                      <span className="ml-2 text-green-400">
                        · Would visit again
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                    {dailyGem.notes}
                  </p>
                </div>
                <Link
                  to="/gemMap"
                  className="shrink-0 text-xs bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded"
                >
                  View
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
