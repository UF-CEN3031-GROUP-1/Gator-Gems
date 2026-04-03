import '../styles/navbar.css'
import { useState } from 'react'
import { useLogoutMutation } from '../api/LogoutMutation'
import { useUserQuery } from '../api/UserQuery'

export const Navbar = () => {
  const [error, setError] = useState<string | null>(null)
  const { data: user, isPending, isError } = useUserQuery()
  const logoutMutation = useLogoutMutation(setError)
  const handleClick = () => {
    logoutMutation.mutate()
  }
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Gator Gems
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/gemMap">Gem Map</a>
          </li>
        </ul>
      </div>
      {user == null && (
        <div className="navbar-right">
          <ul className="nav-links">
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/signup">Sign Up</a>
            </li>
          </ul>
        </div>
      )}
      {user != null && <button onClick={handleClick}> Logout </button>}
    </nav>
  )
}
