import { useUserQuery } from '../api/UserQuery'
import '../styles/auth.css'

export default function ProfileCard() {
  const { data: user, isPending, isError } = useUserQuery()

  if (isPending) {
    return (
      <div className="backElement">
        <p className="text-gray-300 text-center">Loading profile...</p>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="backElement">
        <div className="error">Failed to load profile. Please log in again.</div>
      </div>
    )
  }

  return (
    <div className="backElement">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="space-y-4">
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
  )
}
