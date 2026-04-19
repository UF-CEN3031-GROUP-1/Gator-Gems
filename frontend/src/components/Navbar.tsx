import '../styles/navbar.css'
import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useLogoutMutation } from '../api/LogoutMutation'
import { useUserQuery } from '../api/UserQuery'

export const Navbar = () => {
  const [error, setError] = useState<string | null>(null)
  const { data: user, isPending, isError } = useUserQuery()
  const logoutMutation = useLogoutMutation(setError)
  const handleClick = () => {
    logoutMutation.mutate()
  }
  let location = '/'
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    location = useLocation({ select: (location) => location.pathname }) || '/'
  } catch (e) {}
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Gator Gems
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <Link to="/gemMap">Gem Map</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          {(location === '/login' || location === '/signup' || !user) && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
          {user && (
            <>
              {user.isAdmin && (
                <li>
                  <Link to="/adminPanel"> Admin </Link>
                </li>
              )}
              <li>
                <Link to="/profile"> Profile </Link>
              </li>
              <li>
                <Link to="/login" onClick={handleClick}>
                  {' '}
                  Logout{' '}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
