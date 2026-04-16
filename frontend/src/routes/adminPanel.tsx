import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useReviewsQuery } from '../api/ReviewsQuery'
import { useUserQuery } from '../api/UserQuery'

export const Route = createFileRoute('/adminPanel')({
  component: RouteComponent,
})

function RouteComponent() {
  const qc = useQueryClient()
  const { data: user, isLoading: userLoading } = useUserQuery()
  const reviewsQuery = useReviewsQuery()
  const usersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/admin/users', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`http://localhost:8000/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete review')
      return res
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `http://localhost:8000/users/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      if (!res.ok) throw new Error('Failed to delete user')
      return res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })

  if (userLoading || reviewsQuery.isLoading || usersQuery.isLoading)
    return <div>Loading...</div>

  if (!user || !user.isAdmin) {
    return <div>Unauthorized — admin access required.</div>
  }

  const reviews = reviewsQuery.data ?? []
  const users = usersQuery.data ?? []

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length === 0 && <div>No reviews found.</div>}
        {reviews.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Location</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Stars</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Notes</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Created By</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Created At</th>
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
                      Delete Review
                    </button>
                    {r.createdBy && (
                      <button
                        onClick={() => {
                          if (!window.confirm(`Delete user ${r.createdBy}?`))
                            return
                          ;(deleteUserMutation as any).mutate(r.createdBy)
                        }}
                        disabled={(deleteUserMutation as any).isLoading}
                      >
                        Delete User
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>Users ({users.length})</h3>
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
  )
}
