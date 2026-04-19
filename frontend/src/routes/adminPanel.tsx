import { createFileRoute } from '@tanstack/react-router'
import { useReviewsQuery } from '../api/ReviewsQuery'
import { useUserQuery } from '../api/UserQuery'
import { useDeleteReviewMutation } from '../api/DeleteReviewMutation'
import { useDeleteUserMutation } from '../api/DeleteUserMutation'
import { useUsersQuery } from '../api/UsersQuery'

export const Route = createFileRoute('/adminPanel')({
  component: App,
})

function App() {
  const { data: user, isLoading: userLoading } = useUserQuery()
  const reviewsQuery = useReviewsQuery()
  const usersQuery = useUsersQuery()
  const deleteReviewMutation = useDeleteReviewMutation()
  const deleteUserMutation = useDeleteUserMutation()
  if (userLoading || reviewsQuery.isLoading || usersQuery.isLoading)
    return <div>Loading...</div>

  if (!user || !user.isAdmin) {
    return <div>Unauthorized — admin access required.</div>
  }

  const reviews = reviewsQuery.data ?? []
  const users = usersQuery.data ?? []

  return (
    <div className="min-h-screen bg-green-950 text-white">
      <div style={{}}>
        <div className="bg-gray-700/40 backdrop-blur-[5px] border-b border-gray-700 px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
          <div className="bg-gray-700/40 backdrop-blur-[10px] rounded-lg p-6 border border-gray-700">
            <section style={{ marginBottom: 24 }}>
              <h2 className="text-lg font-semibold mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 && <div>No reviews found.</div>}
              {reviews.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Location
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Stars</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Notes</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Created By
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>
                        Created At
                      </th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r) => (
                      <tr key={r.id} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: 8 }}>{r.id}</td>
                        <td style={{ padding: 8 }}>{r.address}</td>
                        <td style={{ padding: 8 }}>{r.stars}</td>
                        <td style={{ padding: 8 }}>{r.notes}</td>
                        <td style={{ padding: 8 }}>{r.createdBy}</td>
                        <td style={{ padding: 8 }}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: 8 }}>
                          <button
                            onClick={() => {
                              if (!window.confirm('Delete this review?')) return
                              ;(deleteReviewMutation as any).mutate(r.id)
                            }}
                            disabled={(deleteReviewMutation as any).isLoading}
                            style={{ marginRight: 8 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
          <div className="bg-gray-700/40 backdrop-blur-[10px] rounded-lg p-6 border border-gray-700">
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Users ({users.length})
              </h2>
              {users.length === 0 && <div>No users found.</div>}
              {users.length > 0 && (
                <ul>
                  {users.map((u: any) => (
                    <li key={u.emailAddress} style={{ marginBottom: 8 }}>
                      {u.emailAddress}{' '}
                      {u.firstName ? `(${u.firstName} ${u.lastName})` : ''}{' '}
                      <button
                        onClick={() => {
                          if (!window.confirm(`Delete user ${u.emailAddress}?`))
                            return
                          ;(deleteUserMutation as any).mutate(u.emailAddress)
                        }}
                        disabled={(deleteUserMutation as any).isLoading}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
